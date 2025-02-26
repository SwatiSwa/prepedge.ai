import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { NextResponse } from "next/server"

// Define question schema
const questionSchema = z.object({
  // questionType: z.enum(["mcq", "video", "audio", "descriptive"]),
  questionType: z.string(),
  questionText: z.string(),
  mediaUrl: z.string().optional(),
  options: z.string().optional(), // JSON string for MCQ options
  correctAnswer: z.string().optional(),
  createdBy: z.string(),
  updatedBy: z.string(),
})

// Define test schema
const mockTestSchema = z.object({
  questions: z.array(questionSchema),
})

export async function POST(request: Request) {
  try {
    const { topic, count } = await request.json()

    if (!topic || !count) {
      return NextResponse.json({ error: "Topic and count are required" }, { status: 400 })
    }

    const result = await generateObject({
      model: openai("gpt-4-turbo"),
      system: `You are an expert test creator for software development topics.
        Create realistic and challenging test questions for technical interviews.
        For MCQs, provide 4 options as a JSON string array with only one correct answer.
        For descriptive questions, provide a sample answer.
        Do not include any media URLs for video or audio questions.`,
      prompt: `Create ${count} challenging test questions about ${topic}.
        Include a mix of multiple-choice and descriptive questions.
        For MCQs, ensure the correct answer is one of the options.`,
      schema: mockTestSchema,
    })

    // Extract questions from the response object
    const questions = result?.object?.questions || []

    // Process questions for consistency
    const processedQuestions = questions.map((q: any) => {
      // Set default user for created/updated by
      const question = {
        ...q,
        createdBy: "AI Generator",
        updatedBy: "AI Generator",
      }

      // Ensure MCQ options are properly formatted
      if (q.questionType === "mcq" && q.options) {
        try {
          const parsedOptions = JSON.parse(q.options)
          if (!Array.isArray(parsedOptions) || parsedOptions.length !== 4) {
            question.options = JSON.stringify(["Option A", "Option B", "Option C", "Option D"])
          }

          // Ensure correct answer is one of the options
          const options = JSON.parse(question.options)
          if (question.correctAnswer && !options.includes(question.correctAnswer)) {
            question.correctAnswer = options[0]
          }
        } catch {
          question.options = JSON.stringify(["Option A", "Option B", "Option C", "Option D"])
        }
      }

      return question
    })

    return NextResponse.json({ questions: processedQuestions })
  } catch (error) {
    console.error("Error generating questions:", error)
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 })
  }
}

