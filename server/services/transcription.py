import whisper
from fastapi import HTTPException

# Load Whisper model
WHISPER_MODEL = whisper.load_model("base")

def transcribe_audio(audio_path: str) -> str:
    """Transcribes audio to text using Whisper."""
    try:
        result = WHISPER_MODEL.transcribe(audio_path)
        return result["text"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
