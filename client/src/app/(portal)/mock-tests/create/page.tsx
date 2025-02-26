import type { Metadata } from "next"
import CreateMockTestForm from "./create-mock-test-form"

export const metadata: Metadata = {
  title: "Create Mock Test",
  description: "Create a new mock test with randomly selected questions",
}

export default function CreateMockTestPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create Mock Test</h1>
          <p className="text-muted-foreground mt-2">
            Create a new mock test by randomly selecting questions from the question bank
          </p>
        </div>
        <CreateMockTestForm />
      </div>
    </div>
  )
}

