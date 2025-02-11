import requests
import ffmpeg
from fastapi import HTTPException

def download_video(video_url: str, save_path="video.mp4"):
    """Downloads a video from a given URL."""
    response = requests.get(video_url, stream=True)
    if response.status_code == 200:
        with open(save_path, "wb") as file:
            for chunk in response.iter_content(chunk_size=1024):
                file.write(chunk)
        return save_path
    raise HTTPException(status_code=400, detail="Failed to download video.")

def extract_audio(video_path: str, audio_path="audio.mp3"):
    """Extracts audio from a given video file using FFmpeg."""
    try:
        (
            ffmpeg
            .input(video_path)
            .output(audio_path, format='mp3')
            .run(overwrite_output=True)
        )
        return audio_path
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio extraction failed: {str(e)}")
