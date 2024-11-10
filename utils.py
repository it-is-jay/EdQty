from langchain_ollama import ChatOllama
from langchain_core.output_parsers import StrOutputParser
import os
import subprocess
import whisper
from gtts import gTTS
import requests
import re
from datetime import timedelta
from langchain.prompts import ChatPromptTemplate
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
import PyPDF2

from dotenv import load_dotenv

load_dotenv()

print("Imports done")
# Agents
def init_llama():
    llama_model = ChatOllama(
        model="llama3.2",
        temperature=0.8,
        num_predict=256
    )
    return llama_model
llama_model = init_llama()
parser = StrOutputParser()
print("Llama initialized")
embeddings = OpenAIEmbeddings()
filter_criteria = {"id": 1} 
pinecone_index = "know-ease"

def transcribe_pdf(filename):
    try:
        # Open the PDF file in read-binary mode
        with open(filename, "rb") as pdf_file:
            # Create a PDF reader object
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            txt_path = "transcription.txt"
            # Open a new text file in write mode
            with open(txt_path, "w", encoding="utf-8") as text_file:
                # Iterate through each page
                for page_num in range(len(pdf_reader.pages)):
                    page = pdf_reader.pages[page_num]
                    text = page.extract_text()  # Extract text from the page
                    if text:
                        text_file.write(text)  # Write text to the file
                        text_file.write("\n\n")  # Add space between pages

        print(f"Text successfully extracted to {txt_path}")

    except Exception as e:
        print(f"Error: {e}")

def text_to_speech(text, lang="en"):
    tts = gTTS(text=text, lang=lang)
    tts.save("speech_output.mp3")
    print("Speech saved as speech_output.mp3")

def speech_to_text(audio_path):
    whisper_model = whisper.load_model("base")
    transcription = whisper_model.transcribe(audio_path, fp16=False)["text"].strip()
    return transcription

def summarize_text(text):
    summary_prompt = ChatPromptTemplate.from_template(
    "Summarize the given content: {text}"
    )
    
    from operator import itemgetter
    translation_chain = (
        summary_prompt | llama_model | parser
    )
    return translation_chain.invoke(
        {
            "text": text,
        }
    )

def highlight_keywords(text):
    highlight_prompt = ChatPromptTemplate.from_template(
    "Highlight the keywords in this content: {text}"
    )
    
    from operator import itemgetter
    highlight_chain = (
        highlight_prompt | llama_model | parser
    )
    return highlight_chain.invoke(
        {
            "text": text,
        }
    )
    
def timestamp_localization(query):
    timestamp_prompt = ChatPromptTemplate.from_template(
    "At what timestamp does {query} appear. Output format: HH:MM:SS. Use the data below:\n{text}"
    )
    
    timestamp_chain = (
        timestamp_prompt | llama_model | parser
    )
    with open("transcription.txt") as file:
        transcription = file.read()
    return timestamp_chain.invoke(
        {
            "text": transcription,
            "query":query
        }
    )
    

def get_embedding(text):
    embedded_query = embeddings.embed_query(text)
    print(f"Embedding length: {len(embedded_query)}")
    print(embedded_query[:10])

def send_pinecone():   
    # pinecone.delete_index(pinecone_index)
    # pinecone.create_index(pinecone_index, dimension=1536, metric="cosine") 
    loader = TextLoader("transcription.txt", encoding="utf-8")
    text_documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=20)
    documents = text_splitter.split_documents(text_documents)
    pinecone = PineconeVectorStore.from_documents(
        documents, embeddings, index_name=pinecone_index
    )
    return pinecone
    
def simplify_content(text, language="engish"):
    simplified_text = summarize_text(text) 
    translated_text = translate_content(simplified_text, language)
    return translated_text

def translate_content(context, language):
    translation_prompt = ChatPromptTemplate.from_template(
    "Translate {answer} to {language}."
    )
    
    from operator import itemgetter
    translation_chain = (
        translation_prompt | llama_model | parser
    )
    return translation_chain.invoke(
        {
            "answer": context,
            "language": language,
        }
    )

def format_timestamp(seconds):
    """Convert seconds to SRT timestamp format: HH:MM:SS,mmm."""
    td = timedelta(seconds=float(seconds))
    return str(td)[:-3].replace(".", ",")

def video_captioning(transcription_file="transcription.txt", output_file="captions.srt"):
    with open(transcription_file, "r") as f:
        lines = f.readlines()

    srt_lines = []
    index = 1  
    
    for line in lines:
        # Use regex to extract the timestamp and text
        match = re.match(r"\[(\d+\.\d+) - (\d+\.\d+)\] (.+)", line.strip())
        if match:
            start, end, text = match.groups()
            # Format start and end times to SRT format
            start_timestamp = format_timestamp(start)
            end_timestamp = format_timestamp(end)
            # Append to SRT lines
            srt_lines.append(f"{index}")
            srt_lines.append(f"{start_timestamp} --> {end_timestamp}")
            srt_lines.append(text)
            srt_lines.append("")  # Blank line after each subtitle entry
            index += 1
    
    with open(output_file, "w") as f:
        f.write("\n".join(srt_lines))
    print(f"Captioning file created as {output_file}")

def db_query(pinecone, query):
    template = """
    Answer the question based on the context below. If you can't 
    answer the question, reply "I don't know".

    Context: {context}

    Question: {question}
    """
    prompt = ChatPromptTemplate.from_template(template)
    chain = (
        {"context": pinecone.as_retriever(), "question": RunnablePassthrough()}
        | prompt
        | llama_model
        | parser
    )
    return chain.invoke(query)

def init_llama():
    llama_model = ChatOllama(
        model="llama3.2",
        temperature=0.8,
        num_predict=256
    )
    return llama_model

def transcribe(url):
    if not os.path.exists("transcription.txt"):
        # Download audio using yt-dlp
        subprocess.run(["yt-dlp", "-x", "--audio-format", "mp3", "-o", "downloaded_audio.%(ext)s", url])

        # Transcribe with Whisper
        whisper_model = whisper.load_model("base")
        transcription = whisper_model.transcribe("downloaded_audio.mp3", fp16=False, word_timestamps=True)#["text"].strip()
        transcription_with_timestamps = []
        for segment in transcription["segments"]:
            start = segment["start"]
            end = segment["end"]
            text = segment["text"].strip()
            transcription_with_timestamps.append({
                "start": start,
                "end": end,
                "text": text
            })

        # Output transcription to a file or return it
        with open("transcription.txt", "w") as f:
            for segment in transcription_with_timestamps:
                f.write(f"[{segment['start']:.2f} - {segment['end']:.2f}] {segment['text']}\n")

        return transcription_with_timestamps
        # with open("transcription.txt", "w") as f:
        #     f.write(transcription)
        # return transcription

def transcription_promting(query, llama_model):
    prompt = """Answer the question based on the context below. If you can't 
    answer the question, reply 'I don't know'.
    Context: {context}
    Question: {question}"""
    
    
    chain = llama_model | parser
    with open("transcription.txt") as file:
        transcription = file.read()

    try:
        out = chain.invoke(prompt.format(context=transcription, question=query))
        print(out)
        return out
    except Exception as e:
        print(e)

def study_plan():
    pass

def generate_visualization():
    pass

def generate_flashcards():
    pass
    
def generate_quiz():
    pass


def msg_history_context():
    pass