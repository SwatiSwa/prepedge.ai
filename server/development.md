Core Features & Workflow
Upload Video File → User uploads a video file.
Extract Audio → Convert the video file into an audio file.
Transcribe Audio → Generate a transcript using speech-to-text.
Chat Completion & Answer Verification → Use an AI model with Rubrik to analyze and validate responses.
Tech Stack
Backend: FastAPI (for handling API requests)
Frontend: React/Next.js (for UI if needed)
Database: PostgreSQL / MongoDB (to store transcripts & results)
Cloud Storage: AWS S3 / Google Cloud Storage (for storing video/audio files)
Speech-to-Text API: OpenAI Whisper / Google Speech-to-Text
AI Verification: OpenAI ChatGPT API + Rubrik
