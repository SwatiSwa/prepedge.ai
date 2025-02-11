export interface AssessmentInfo {
    id: string
    title: string
    type: "behavioral" | "technical" | "leadership"
    questionCount: number
    timePerQuestion: number
    totalDuration: number
    description: string
  }
  
  