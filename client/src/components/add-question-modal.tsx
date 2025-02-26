"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const questionTypes = [
  { value: "mcq", label: "Multiple Choice" },
  { value: "truefalse", label: "True/False" },
  { value: "shortanswer", label: "Short Answer" },
  { value: "essay", label: "Essay" },
]

const formSchema = z.object({
  questionText: z.string().min(1, "Question text is required"),
  questionType: z.string().min(1, "Question type is required"),
  mediaUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),
  author: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface AddQuestionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onQuestionAdded: () => void
}

export function AddQuestionModal({ open, onOpenChange, onQuestionAdded }: AddQuestionModalProps) {
  const [options, setOptions] = useState<string[]>(["", ""])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionText: "",
      questionType: "",
      mediaUrl: "",
      options: ["", ""],
      correctAnswer: "",
      author: "",
    },
  })

  const watchQuestionType = form.watch("questionType")
  const showOptions = watchQuestionType === "mcq"

  const handleAddOption = () => {
    setOptions([...options, ""])
    form.setValue("options", [...options, ""])
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)
    form.setValue("options", newOptions)
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
    form.setValue("options", newOptions)
  }

  const onSubmit = async (data: FormValues) => {
    try {
      // Here you would typically send the data to your API
      console.log("Form submitted:", data)

      // Clean up form data before submission
      const formData = {
        ...data,
        options: showOptions ? data.options : undefined,
      }

      // Example API call (replace with your actual API endpoint)
      // await fetch('/api/questions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })

      // Reset form and close modal
      form.reset()
      setOptions(["", ""])
      onQuestionAdded()
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting question:", error)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Add New Question</SheetTitle>
          <SheetDescription>Create a new question for your question bank.</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="questionText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your question here..." className="min-h-24" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="questionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select question type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {questionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mediaUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showOptions && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Options</FormLabel>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddOption} className="h-8">
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Option
                  </Button>
                </div>

                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOption(index)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <FormField
              control={form.control}
              name="correctAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correct Answer</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the correct answer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="pt-4">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit">Save Question</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

