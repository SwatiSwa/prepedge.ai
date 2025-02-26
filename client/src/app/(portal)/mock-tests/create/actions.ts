"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { questionBankTable, mockTestTable, mockTestQuestionTable } from "@/db/schema"
import { sql } from "drizzle-orm"
import { slugify } from "@/lib/utils"

export async function getRandomQuestions(count: number, excludeIds: number[] = []) {
  try {
    let query:any = db.select().from(questionBankTable)

    // If we have IDs to exclude, add that condition
    if (excludeIds.length > 0) {
      query = query.where((mockTestTable.id, excludeIds))
    }

    // Get random questions using SQL's random() function
    const questions = await query.orderBy(sql`RANDOM()`).limit(count)

    // Parse the options and correctAnswer fields if they're JSON strings
    return questions.map((q:any) => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : null,
      correctAnswer: q.correctAnswer
        ? q.correctAnswer.startsWith("[")
          ? JSON.parse(q.correctAnswer)
          : q.correctAnswer
        : null,
    }))
  } catch (error) {
    console.error("Error fetching random questions:", error)
    throw new Error("Failed to fetch random questions")
  }
}

export async function createMockTest(data: {
  title: string
  description: string
  questionIds: number[]
}) {
  try {
    // Generate a unique slug from the title
    const slug = slugify(data.title)

    // Create the mock test
    const [newMockTest] = await db
      .insert(mockTestTable)
      .values({
        title: data.title,
        description: data.description,
        slug: slug,
      })
      .returning()

    // Add questions to the mock test with order
    if (data.questionIds.length > 0) {
      const mockTestQuestions = data.questionIds.map((questionId, index) => ({
        mockTestId: newMockTest.id,
        questionId: questionId,
        order: index + 1,
      }))

      await db.insert(mockTestQuestionTable).values(mockTestQuestions)
    }

    revalidatePath("/mock-tests")
    return newMockTest
  } catch (error) {
    console.error("Error creating mock test:", error)
    throw new Error("Failed to create mock test")
  }
}

