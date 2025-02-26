"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type QuestionType = "mcq" | "descriptive" | "video" | "audio"

interface Option {
  id: string
  text: string
}

interface Question {
  id: number
  questionType: QuestionType
  questionText: string
  mediaUrl?: string
  options?: Option[]
  correctAnswer?: string | string[]
}

export function QuestionPreview({ question, index }: { question: Question; index: number }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const options = question.options
    ? typeof question.options === "string"
      ? JSON.parse(question.options)
      : question.options
    : []

  const isMultipleChoice =
    Array.isArray(question.correctAnswer) || (question.correctAnswer && question.correctAnswer.includes("["))

  const handleCheckboxChange = (optionId: string) => {
    setSelectedOptions((prev) => (prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="capitalize">
          {question.questionType}
        </Badge>
        <span className="text-sm text-muted-foreground">Question {index + 1}</span>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">{question.questionText}</h3>

        {question.mediaUrl && (
          <div className="rounded-md border overflow-hidden">
            {question.questionType === "video" ? (
              <video src={question.mediaUrl} controls className="w-full max-h-[300px]" />
            ) : question.questionType === "audio" ? (
              <audio src={question.mediaUrl} controls className="w-full p-4" />
            ) : null}
          </div>
        )}

        {question.questionType === "mcq" && options.length > 0 && (
          <div className="space-y-2">
            {isMultipleChoice ? (
              // Multiple correct answers
              <div className="space-y-2">
                {options.map((option: Option) => (
                  <div key={option.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`${question.id}-${option.id}`}
                      checked={selectedOptions.includes(option.id)}
                      onCheckedChange={() => handleCheckboxChange(option.id)}
                    />
                    <Label htmlFor={`${question.id}-${option.id}`} className="text-sm leading-tight">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              // Single correct answer
              <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption}>
                {options.map((option: Option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} />
                    <Label htmlFor={`${question.id}-${option.id}`} className="text-sm">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        )}

        {question.questionType === "descriptive" && (
          <div className="rounded-md border p-3 bg-muted/30">
            <p className="text-sm text-muted-foreground italic">[Descriptive answer question]</p>
          </div>
        )}
      </div>
    </div>
  )
}

