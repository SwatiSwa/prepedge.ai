"use client"

import { useState } from "react"
import StartScreen from "./start-screen"
import Interview from "./interview"

export default function InterviewContainer() {
  const [hasStarted, setHasStarted] = useState(false)

  if (!hasStarted) {
    return <StartScreen onStart={() => setHasStarted(true)} />
  }

  return <Interview />
}

