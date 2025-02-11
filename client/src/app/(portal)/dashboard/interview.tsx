"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRecorder } from "@/hooks/use-recorder"
import type { Question, Recording } from "@/types/interview"

const MOCK_QUESTIONS: Question[] = [
  {
    id: "1",
    text: "Tell me about yourself and your background.",
    timeLimit: 120,
  },
  { 
    id: "2",
    text: "What is your greatest professional achievement?",
    timeLimit: 180,
  },
  {
    id: "3",
    text: "Where do you see yourself in 5 years?",
    timeLimit: 120,
  },
]

export default function Interview() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [recordings, setRecordings] = useState<Recording[]>([])
  const { isRecording, error, startRecording, stopRecording } = useRecorder()
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)

  const currentQuestion = MOCK_QUESTIONS[currentQuestionIndex]
  const hasRecording = recordings.some((r) => r.questionId === currentQuestion.id)

  const handleStartRecording = async () => {
    await startRecording()
    if (currentQuestion.timeLimit) {
      setTimeRemaining(currentQuestion.timeLimit)
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval)
            handleStopRecording()
            return null
          }
          return prev - 1
        })
      }, 1000)
      setTimerInterval(interval)
    }
  }

  const handleStopRecording = async () => {
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
    setTimeRemaining(null)

    const recording = await stopRecording()
    setRecordings((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        ...recording,
      },
    ])
  }

  const handleNext = () => {
    if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const currentRecording = recordings.find((r) => r.questionId === currentQuestion.id)

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              Question {currentQuestionIndex + 1} of {MOCK_QUESTIONS.length}
            </span>
            {timeRemaining !== null && (
              <span className="text-red-500">
                Time remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg font-medium">{currentQuestion.text}</div>

          {error && <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>}

          {currentRecording && (
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video src={currentRecording.url} controls className="w-full h-full" />
            </div>
          )}

          {!currentRecording && (
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
              {isRecording ? (
                <video
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full"
                  ref={(video) => {
                    if (video) {
                      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                        video.srcObject = stream
                      })
                    }
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  Click record to start your response
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              Previous
            </Button>
            <Button onClick={handleNext} disabled={currentQuestionIndex === MOCK_QUESTIONS.length - 1 || !hasRecording}>
              Next
            </Button>
          </div>

          {!currentRecording && (
            <Button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              variant={isRecording ? "destructive" : "default"}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

