import React from 'react';
import { useState, useRef } from "react";
import axios from "axios";

export default function Interview() {
  const [isRecording, setIsRecording] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const videoRef = useRef(null);
  let intervalRef = useRef(null);

  const questions = [
    "Tell me about yourself.",
    "What are your strengths and weaknesses?",
    "Where do you see yourself in five years?",
  ];

  const startInterview = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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

    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const formData = new FormData();
    formData.append("file", blob, "interview.webm");

    try {
      const response = await axios.post("http://localhost:8000/evaluate-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Evaluation Result:", response.data);
    } catch (error) {
      console.error("Error uploading video", error);
    }
  };

  return <div>Interview Recorder</div>;
}
