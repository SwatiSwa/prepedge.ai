from fastapi import FastAPI, HTTPException
import os
from dotenv import load_dotenv
from services.video_processing import download_video, extract_audio
from services.transcription import transcribe_audio
from services.evaluation import evaluate_response

# Load environment variables
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.post("/evaluate-question")
def evaluate_question(video_url: str):
    """
    Evaluates an interview response from a video URL.
    Extracts audio, transcribes it, and scores the answer using OpenAI.
    """
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="OpenAI API key is missing.")
    
    try:
        # Step 1: Download Video
        video_path = download_video(video_url)
        
        # Step 2: Extract Audio
        audio_path = extract_audio(video_path)
        
        # Step 3: Get Transcript
        transcript = transcribe_audio(audio_path)
        
        # Step 4: Evaluate with OpenAI
        evaluation = evaluate_response(transcript)
        
        return {"transcript": transcript, "evaluation": evaluation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run using: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
if __name__ == "__main__":
    import sys
    print("Run the application with: uvicorn main:app --host 0.0.0.0 --port 8000 --reload")
    sys.exit(1)
