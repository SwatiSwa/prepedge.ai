import openai
import os
from fastapi import HTTPException

# Load OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise HTTPException(status_code=500, detail="OpenAI API key is missing.")

def evaluate_response(transcript: str) -> dict:
    """Evaluates the given transcript using OpenAI's ChatCompletion API."""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an AI that evaluates interview responses."},
                {"role": "user", "content": f"Transcript: {transcript}\nEvaluate this response with a score and confidence level."}
            ]
        )
        return {
            "evaluation": response['choices'][0]['message']['content']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")
