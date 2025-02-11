"use client"

import { useState, useCallback, useRef } from "react"

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      streamRef.current = stream
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setError(null)
    } catch (err) {
      setError("Failed to start recording. Please check camera permissions.")
      console.error(err)
    }
  }, [])

  const stopRecording = useCallback(() => {
    return new Promise<{ blob: Blob; url: string }>((resolve) => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "video/webm" })
          const url = URL.createObjectURL(blob)
          resolve({ blob, url })

          // Clean up
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop())
          }
        }
        mediaRecorderRef.current.stop()
        setIsRecording(false)
      }
    })
  }, [isRecording])

  return {
    isRecording,
    error,
    startRecording,
    stopRecording,
  }
}

