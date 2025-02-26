import { notFound } from "next/navigation"
import { db } from "@/db"
import { mockTestTable, mockTestQuestionTable, questionBankTable } from "@/db/schema"
import { eq, asc } from "drizzle-orm"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function MockTestPage({ params }: { params: { slug: string } }) {
  const mockTestData:any = await db.query.mockTestTable.findFirst({
    where: eq(mockTestTable.slug, params.slug),
  })

  if (!mockTestData) {
    notFound()
  }

  // Get all questions for this mock test with their order
  const mockTestQuestionsWithDetails = await db
    .select({
      order: mockTestQuestionTable.order,
      question: questionBankTable,
    })
    .from(mockTestQuestionTable)
    .innerJoin(questionBankTable, eq(mockTestQuestionTable.questionId, questionBankTable.id))
    .where(eq(mockTestQuestionTable.mockTestId, mockTestData.id))
    .orderBy(asc(mockTestQuestionTable.order))

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{mockTestData.title}</h1>
          {mockTestData.description && <p className="text-muted-foreground mt-2">{mockTestData.description}</p>}
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline">{mockTestQuestionsWithDetails.length} Questions</Badge>
            <Badge variant="outline">Created {new Date(mockTestData.createdAt).toLocaleDateString()}</Badge>
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <Button>Start Test</Button>
        </div>

        <div className="space-y-4">
          {mockTestQuestionsWithDetails.map(({ question, order }) => (
            <Card key={question.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="capitalize">
                    {question.questionType}
                  </Badge>
                  <span className="text-sm text-muted-foreground">Question {order}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{question.questionText}</h3>

                  {question.mediaUrl && (
                    <div className="rounded-md border overflow-hidden">
                      {question.questionType === "video" ? (
                        <div className="aspect-video bg-muted flex items-center justify-center">
                          <p className="text-sm text-muted-foreground">[Video content]</p>
                        </div>
                      ) : question.questionType === "audio" ? (
                        <div className="h-16 bg-muted flex items-center justify-center">
                          <p className="text-sm text-muted-foreground">[Audio content]</p>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {question.questionType === "mcq" && question.options && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-muted-foreground">Multiple choice options available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

