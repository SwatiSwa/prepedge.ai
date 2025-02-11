export interface Question {
    id: string
    text: string
    timeLimit?: number // in seconds
  }
  
  export interface Recording {
    questionId: string
    blob: Blob
    url: string
  }
  
  