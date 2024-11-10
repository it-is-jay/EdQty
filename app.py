from flask import Flask, request, jsonify
from utils import *
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
import gridfs

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client['knowease_user']
msg_coll = db['msg_history']
userdata_coll = db['userdata']
filter_criteria = {"id": 1} 

app = Flask(__name__)
cors = CORS(app)

print("Server started")
# Global variable to store the video URL
llama_model = init_llama()
global user_language, current_document
user_language = "english"
current_document = ""

fs = gridfs.GridFS(db)

def add_filename(filename):
    userdata = userdata_coll.find_one(filter_criteria)
    if filename not in userdata['files']:
        userdata['files'] += [filename]
    update_data = {
        "$set": userdata
    }
    userdata_coll.update_one(filter_criteria, update_data, upsert=True)

def translate_output(out):
    if user_language!="english":
        return translate_content(out, user_language)
    else:
        return out

@app.route('/api/select-file', methods=['POST'])
def download_file():
    filename = request.get_json().get('filename')
    try:
        # Retrieve the file from GridFS by file_id
        file_data = fs.find_one({"filename": filename})
        if filename.endswith('.pdf'):
            with open(filename, "wb") as output_file:
                output_file.write(file_data.read())
            transcribe_pdf(filename)
        elif filename.endswith('.txt'):
            with open("transcription.txt", "wb") as output_file:
                output_file.write(file_data.read())
        else: 
            transcribe(filename)

    except Exception as e:
        print(f"Error: {e}")
    return jsonify({"filecontent":filename})

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    file_id = fs.put(file, filename=file.filename)
    add_filename(file.filename)
    return jsonify({'file_id': str(file_id), 'filename': file.filename}), 201

@app.route('/api/listfiles', methods=['GET'])
def listfiles():
    userdata = userdata_coll.find_one(filter_criteria)
    return jsonify({'files':  userdata['files']}), 201

@app.route('/api/db-query', methods=['POST'])
def db_query_route():
    pinecone = send_pinecone()
    data = request.get_json()  # Assume JSON format
    query = data.get("query")
    out = db_query(pinecone, query)
    return jsonify({"message": out})

@app.route('/api/prompt-video', methods=['POST'])
def prompt_video():
    data = request.get_json()  # Assume JSON format
    url = data.get("url")
    add_filename(url)
    query = data.get("query")
    # Check if the URL was provided
    if not url:
        return jsonify({"error": "No URL provided"}), 400
    transcribe(url)
    out = translate_output(transcription_promting(query, llama_model))

    return jsonify({"message": out})

@app.route('/api/translate-transcript', methods=['POST'])
def translate_transcript():
    data = request.get_json()  # Assume JSON format
    with open("transcription.txt") as file:
        transcription = file.read()
    language = data.get("language")
    # Check if the URL was provided
    out = translate_content(transcription, language)
    return jsonify({"message": out})

@app.route('/api/change-language', methods=['POST'])
def change_language():
    data = request.get_json()  # Assume JSON format
    user_language = data.get("language")
    return jsonify({"message": user_language})

@app.route('/api/summarize-transcript', methods=['GET'])
def summarize_transcript():
    with open("transcription.txt") as file:
        transcription = file.read()
    # Check if the URL was provided
    out = summarize_text(transcription)
    return jsonify({"message": out})

@app.route('/api/summarize-text', methods=['POST'])
def summarize_text():
    data = request.get_json()  # Assume JSON format
    content = request.get("content")
    out = summarize_text(content)
    return jsonify({"message": out})

@app.route('/api/simplify-text', methods=['POST'])
def simplify():
    data = request.get_json()  # Assume JSON format
    content = request.get("content")
    language = request.get("language")
    out = simplify_content(content, language)
    return jsonify({"message": out})

@app.route('/api/transcribe-url', methods=['POST'])
def transcribe_url():
    data = request.get_json()  # Assume JSON format
    url = request.get("url")
    out = transcribe(url)
    return jsonify({"message": out})
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
