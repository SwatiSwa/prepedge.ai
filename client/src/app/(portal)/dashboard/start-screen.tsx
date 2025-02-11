"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Clock, Video, Mic, CheckCircle2 } from "lucide-react"

interface AssessmentInfo {
  id: string
  title: string
  type: string
  questionCount: number
  timePerQuestion: number
  totalDuration: number
  description: string
}

const MOCK_ASSESSMENT: AssessmentInfo = {
  id: "behavioral-001",
  title: "Behavioral Interview Assessment",
  type: "behavioral",
  questionCount: 5,
  timePerQuestion: 180, // 3 minutes per question
  totalDuration: 20, // 20 minutes total including preparation time
  description:
    "This assessment consists of common behavioral interview questions to evaluate your past experiences and decision-making abilities.",
}

interface StartScreenProps {
  onStart: () => void
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [hasAgreed, setHasAgreed] = useState(false)
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(false)
  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
  })

  const checkPermissions = async () => {
    setIsCheckingPermissions(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      // Stop all tracks after checking
      stream.getTracks().forEach((track) => track.stop())

      setPermissions({
        camera: true,
        microphone: true,
      })
      return true
    } catch (error) {
      console.error("Permission check failed:", error)
      return false
    } finally {
      setIsCheckingPermissions(false)
    }
  }

  const handleStart = async () => {
    const hasPermissions = await checkPermissions()
    if (hasPermissions) {
      onStart()
    }
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card className="w-full">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">{MOCK_ASSESSMENT.title}</CardTitle>
          <p className="text-muted-foreground">
            Type: {MOCK_ASSESSMENT.type.charAt(0).toUpperCase() + MOCK_ASSESSMENT.type.slice(1)} Interview
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Assessment Overview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Assessment Overview</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{MOCK_ASSESSMENT.totalDuration} minutes total</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <span>{MOCK_ASSESSMENT.questionCount} questions</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{MOCK_ASSESSMENT.timePerQuestion / 60} min per question</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-muted-foreground">{MOCK_ASSESSMENT.description}</p>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Instructions</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Ensure you are in a quiet, well-lit environment</li>
              <li>Test your camera and microphone before starting</li>
              <li>Speak clearly and maintain eye contact with the camera</li>
              <li>You can only record one response per question</li>
              <li>Once you move to the next question, you cannot return to previous responses</li>
              <li>Take time to think before recording your response</li>
            </ul>
          </div>

          {/* Technical Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Technical Requirements</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span>Working webcam</span>
                {permissions.camera && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </div>
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span>Working microphone</span>
                {permissions.microphone && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-amber-600">Important Notice</h3>
            </div>
            <p className="text-sm text-amber-600">
              By proceeding with this assessment, you acknowledge that your video and audio responses will be recorded
              and stored. These recordings may be reviewed by hiring managers and recruitment team members. Your
              responses will be handled in accordance with our privacy policy and data protection guidelines.
            </p>
          </div>

          {/* Agreement */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="agreement"
              checked={hasAgreed}
              onCheckedChange={(checked) => setHasAgreed(checked as boolean)}
            />
            <label
              htmlFor="agreement"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I understand and agree to the assessment conditions and recording of my responses
            </label>
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full" onClick={handleStart} disabled={!hasAgreed || isCheckingPermissions}>
            {isCheckingPermissions ? "Checking Permissions..." : "Start Assessment"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

