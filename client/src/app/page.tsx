"use client"
import React, { useState, useRef } from 'react';
import axios from 'axios'

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  const questions = [
    'Tell me about yourself.',
    'What are your strengths and weaknesses?',
    'Where do you see yourself in five years?',
  ];

  const startInterview = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    videoRef.current.srcObject = stream;
    const recorder = new MediaRecorder(stream);
    let chunks = [];

    recorder.ondataavailable = (event) => chunks.push(event.data);
    recorder.onstop = () => setRecordedChunks(chunks);

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);

    // Move to next question every 2 minutes
    let index = 0;
    intervalRef.current = setInterval(() => {
      if (index < questions.length - 1) {
        index++;
        setQuestionIndex(index);
      } else {
        clearInterval(intervalRef.current);
        stopRecording();
      }
    }, 120000);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    clearInterval(intervalRef.current);
  };

  const uploadVideo = async () => {
    if (!recordedChunks.length) return;

    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const formData = new FormData();
    formData.append('file', blob, 'interview.webm');

    try {
      const response = await axios.post(
        'http://localhost:8000/evaluate-file',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      console.log('Evaluation Result:', response.data);
    } catch (error) {
      console.error('Error uploading video', error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5'>
      <h1 className='text-2xl font-bold mb-4'>Mock Interview</h1>
      <video ref={videoRef} autoPlay className='mb-4 w-full max-w-md border' />
      <p className='text-lg font-semibold mb-2'>
        Question {questionIndex + 1}: {questions[questionIndex]}
      </p>
      {!isRecording ? (
        <button
          onClick={startInterview}
          className='bg-green-500 text-white px-4 py-2 rounded-lg'
        >
          Start Interview
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className='bg-red-500 text-white px-4 py-2 rounded-lg'
        >
          Complete Interview
        </button>
      )}
      {recordedChunks.length > 0 && (
        <button
          onClick={uploadVideo}
          className='bg-blue-500 text-white px-4 py-2 mt-3 rounded-lg'
        >
          Upload & Evaluate
        </button>
      )}
    </div>
  );
}
