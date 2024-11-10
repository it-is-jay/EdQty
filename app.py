from flask import Flask, request, jsonify

app = Flask(__name__)
print("Server started")
# Global variable to store the video URL
video_url = None

@app.route('/api/store_video_url', methods=['POST'])
def store_video_url():
    global video_url  # Declare it as global to modify the outer scope variable

    # Get the video URL from the request data
    data = request.get_json()  # Assume JSON format
    video_url = data.get("url")

    # Check if the URL was provided
    if not video_url:
        return jsonify({"error": "No URL provided"}), 400

    return jsonify({"message": "URL stored successfully", "video_url": video_url})

if __name__ == '__main__':
    app.run(debug=True)
