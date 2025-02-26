"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Plus, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { QuestionPreview } from "./question-preview"
import { getRandomQuestions, createMockTest } from "./actions"

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  questionCount: z.coerce
    .number()
    .min(1, {
      message: "You must select at least 1 question.",
    })
    .max(50, {
      message: "You can select up to 50 questions at once.",
    }),
})

export default function CreateMockTestForm() {
  const router = useRouter()
  const [selectedQuestions, setSelectedQuestions] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      questionCount: 10,
    },
  })

  async function onSelectQuestions(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const questions = await getRandomQuestions(data.questionCount)
      setSelectedQuestions(questions)
      setShowPreview(true)
      toast('Questions selected',{
        description: `${questions.length} questions have been randomly selected.`,
      })
    } catch (error) {
      toast('Error',{
        description: "Failed to select random questions. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onAddMoreQuestions() {
    try {
      setIsLoading(true)
      const additionalCount = form.getValues("questionCount")
      const existingIds = selectedQuestions.map((q:any) => q.id)
      const additionalQuestions = await getRandomQuestions(additionalCount, existingIds)

      setSelectedQuestions([...selectedQuestions, ...additionalQuestions])
      toast('Questions added',{
        description: `${additionalQuestions.length} more questions have been added.`,
      })
    } catch (error) {
      toast('Error',{
        description: "Failed to add more questions. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onCreateMockTest() {
    try {
      setIsCreating(true)
      const mockTestData = {
        title: form.getValues("title"),
        description: form.getValues("description") || "",
        questionIds: selectedQuestions.map((q:any) => q.id),
      }

      const result = await createMockTest(mockTestData)

      toast('Mock test created',{
        description: `Your mock test "${result.title}" has been created successfully.`,
      })

      router.push(`/mock-tests/${result.slug}`)
    } catch (error) {
      toast('Error',{
        description: "Failed to create mock test. Please try again."
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSelectQuestions)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter mock test title" {...field} />
                </FormControl>
                <FormDescription>A descriptive title for your mock test.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter a description for this mock test (optional)" {...field} />
                </FormControl>
                <FormDescription>Provide details about the purpose and content of this mock test.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="questionCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Questions</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={50} {...field} />
                </FormControl>
                <FormDescription>How many random questions to select from the question bank.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Selecting questions...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Select Random Questions
              </>
            )}
          </Button>
        </form>
      </Form>

      {showPreview && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Question Preview</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onAddMoreQuestions} disabled={isLoading || isCreating}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Add More Questions
              </Button>

              <Button onClick={onCreateMockTest} disabled={isCreating || selectedQuestions.length === 0}>
                {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Mock Test"}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {selectedQuestions.map((question:any, index:any) => (
              <Card key={question.id}>
                <CardContent className="pt-6">
                  <QuestionPreview question={question} index={index} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

