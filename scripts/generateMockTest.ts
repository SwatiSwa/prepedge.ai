import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

// Define question schema
const questionSchema = z.object({
  questionType: z.enum(["mcq", "video", "audio", "descriptive"]),
  questionText: z.string(),
  mediaUrl: z.string().optional(),
  options: z.string().optional(), // JSON string for MCQ options
  correctAnswer: z.string().optional(),
  createdBy: z.string(),
  updatedBy: z.string(),
});

// Define test schema
const mockTestSchema = z.object({
  questions: z.array(questionSchema),
});

// Function to generate questions
async function generateMockTest(topic = "JavaScript", count = 5) {
  const result:any = await generateObject({
    model: openai("gpt-4-turbo"),
    system: `You are an expert test creator for software development topics.
      Create realistic and challenging test questions for technical interviews.
      For MCQs, provide 4 options as a JSON string array with only one correct answer.`,
    prompt: `Create ${count} challenging test questions about ${topic}.
      Include a mix of multiple-choice and descriptive questions.`,
    schema: mockTestSchema,
  });

   // Extract questions from the response object
   const questions = result?.object?.questions || [];

   // Process questions for consistency
   const processedQuestions = questions.map((q: any) => {
     if (q.questionType === "mcq" && q.options) {
       try {
         const parsedOptions = JSON.parse(q.options);
         if (!Array.isArray(parsedOptions) || parsedOptions.length !== 4) {
           q.options = JSON.stringify(["Option A", "Option B", "Option C", "Option D"]);
         }
       } catch {
         q.options = JSON.stringify(["Option A", "Option B", "Option C", "Option D"]);
       }
     }

     return { ...q, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
   });

   console.log(JSON.stringify(processedQuestions, null, 2));
}

// Run the function
generateMockTest("React", 3);
