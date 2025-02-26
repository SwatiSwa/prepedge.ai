"use client"

import { useState } from "react"
import { Loader2, Sparkles, Save, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type Question = {
  id?: number
  questionType: "mcq" | "video" | "audio" | "descriptive"
  questionText: string
  mediaUrl?: string
  options?: string
  correctAnswer?: string
  createdBy: string
  updatedBy: string
}

export default function QuestionPlayground() {
  const [topic, setTopic] = useState("React")
  const [count, setCount] = useState(3)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([])
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [activeTab, setActiveTab] = useState("generate")

  const generateQuestions = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/questions/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, count }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate questions")
      }

      const data = await response.json()
      setGeneratedQuestions(data.questions)
      toast("Questions Generated",{
        description: `Successfully generated ${data.questions.length} questions about ${topic}`,
      })
      setActiveTab("preview")
    } catch (error) {
      console.error("Error generating questions:", error)
      toast("Generation Failed",{
        description: "Failed to generate questions. Please try again.",
        // variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const saveQuestions = async () => {
    try {
      const response = await fetch("/api/questions/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questions: generatedQuestions }),
      })

      if (!response.ok) {
        throw new Error("Failed to save questions")
      }

      toast("Questions Saved",{
        description: `Successfully saved ${generatedQuestions.length} questions to the database`,
      })
      setGeneratedQuestions([])
      setActiveTab("generate")
    } catch (error) {
      console.error("Error saving questions:", error)
      toast("Save Failed",{
        description: "Failed to save questions. Please try again.",
        // variant: "destructive",
      })
    }
  }

  const startEditing = (question: Question) => {
    setEditingQuestion({ ...question })
    setActiveTab("edit")
  }

  const updateEditingQuestion = (field: keyof Question, value: any) => {
    if (editingQuestion) {
      setEditingQuestion({ ...editingQuestion, [field]: value })
    }
  }

  const saveEditedQuestion = () => {
    if (editingQuestion) {
      const updatedQuestions = generatedQuestions.map((q) =>
        q === generatedQuestions.find((gq) => gq.questionText === editingQuestion.questionText) ? editingQuestion : q,
      )
      setGeneratedQuestions(updatedQuestions)
      setEditingQuestion(null)
      setActiveTab("preview")
    }
  }

  const removeQuestion = (question: Question) => {
    setGeneratedQuestions(generatedQuestions.filter((q) => q !== question))
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Question Playground
          </CardTitle>
          <CardDescription>Generate and manage AI-powered questions for your tests</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="preview" disabled={generatedQuestions.length === 0}>
                Preview ({generatedQuestions.length})
              </TabsTrigger>
              <TabsTrigger value="edit" disabled={!editingQuestion}>
                Edit
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="Enter a topic (e.g. React, JavaScript, CSS)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="count">Number of Questions: {count}</Label>
                </div>
                <Slider
                  id="count"
                  min={1}
                  max={10}
                  step={1}
                  value={[count]}
                  onValueChange={(value) => setCount(value[0])}
                />
              </div>

              <Button onClick={generateQuestions} disabled={isGenerating || !topic.trim()} className="w-full">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> Generate Questions
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4 pt-4">
              {generatedQuestions.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {generatedQuestions.map((question, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="capitalize">
                              {question.questionType}
                            </Badge>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => startEditing(question)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => removeQuestion(question)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <CardTitle className="text-base">{question.questionText}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          {question.questionType === "mcq" && question.options && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Options:</p>
                              <div className="grid grid-cols-1 gap-2">
                                {JSON.parse(question.options).map((option: string, i: number) => (
                                  <div
                                    key={i}
                                    className={`rounded-md border p-2 text-sm ${
                                      option === question.correctAnswer
                                        ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                                        : ""
                                    }`}
                                  >
                                    {option}
                                    {option === question.correctAnswer && (
                                      <span className="ml-2 text-xs text-green-600">(Correct)</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {question.questionType === "descriptive" && question.correctAnswer && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Sample Answer:</p>
                              <p className="text-sm text-muted-foreground">{question.correctAnswer}</p>
                            </div>
                          )}
                          {(question.questionType === "video" || question.questionType === "audio") &&
                            question.mediaUrl && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Media URL:</p>
                                <a
                                  href={question.mediaUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-500 underline"
                                >
                                  {question.mediaUrl}
                                </a>
                              </div>
                            )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Button onClick={saveQuestions} className="w-full">
                    <Save className="mr-2 h-4 w-4" /> Save All Questions
                  </Button>
                </>
              ) : (
                <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed">
                  <p className="text-sm text-muted-foreground">No questions generated yet</p>
                  <Button variant="link" onClick={() => setActiveTab("generate")}>
                    Generate Questions
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="edit" className="space-y-4 pt-4">
              {editingQuestion && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="questionType">Question Type</Label>
                    <Select
                      value={editingQuestion.questionType}
                      onValueChange={(value: "mcq" | "video" | "audio" | "descriptive") =>
                        updateEditingQuestion("questionType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select question type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mcq">Multiple Choice</SelectItem>
                        <SelectItem value="descriptive">Descriptive</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="questionText">Question Text</Label>
                    <Textarea
                      id="questionText"
                      value={editingQuestion.questionText}
                      onChange={(e) => updateEditingQuestion("questionText", e.target.value)}
                      rows={3}
                    />
                  </div>

                  {editingQuestion.questionType === "mcq" && (
                    <div className="space-y-2">
                      <Label htmlFor="options">Options (JSON array)</Label>
                      <Textarea
                        id="options"
                        value={editingQuestion.options || ""}
                        onChange={(e) => updateEditingQuestion("options", e.target.value)}
                        rows={4}
                        placeholder='["Option A", "Option B", "Option C", "Option D"]'
                      />
                    </div>
                  )}

                  {(editingQuestion.questionType === "video" || editingQuestion.questionType === "audio") && (
                    <div className="space-y-2">
                      <Label htmlFor="mediaUrl">Media URL</Label>
                      <Input
                        id="mediaUrl"
                        value={editingQuestion.mediaUrl || ""}
                        onChange={(e) => updateEditingQuestion("mediaUrl", e.target.value)}
                        placeholder="https://example.com/media.mp4"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="correctAnswer">
                      {editingQuestion.questionType === "mcq"
                        ? "Correct Answer (must match one option exactly)"
                        : "Sample Answer"}
                    </Label>
                    <Textarea
                      id="correctAnswer"
                      value={editingQuestion.correctAnswer || ""}
                      onChange={(e) => updateEditingQuestion("correctAnswer", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={saveEditedQuestion} className="flex-1">
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingQuestion(null)
                        setActiveTab("preview")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

