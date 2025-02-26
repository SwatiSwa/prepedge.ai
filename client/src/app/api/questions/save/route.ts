import { NextResponse } from "next/server"
import { db } from "@/db" 
import { questionBankTable } from "@/db/schema" 

export async function POST(request: Request) {
  try {
    const { questions } = await request.json()

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: "Valid questions array is required" }, { status: 400 })
    }

    // Format questions for database insertion
    const formattedQuestions = questions.map((question) => ({
      questionType: question.questionType,
      questionText: question.questionText,
      mediaUrl: question.mediaUrl || null,
      options: question.options || null,
      correctAnswer: question.correctAnswer || null,
      createdBy: question.createdBy || "AI Generator",
      updatedBy: question.updatedBy || "AI Generator",
    }))

    // Insert questions into database
    const result = await db.insert(questionBankTable).values(formattedQuestions).returning()

    return NextResponse.json({
      success: true,
      message: `Successfully saved ${result.length} questions`,
      questions: result,
    })
  } catch (error) {
    console.error("Error saving questions:", error)
    return NextResponse.json({ error: "Failed to save questions to database" }, { status: 500 })
  }
}

