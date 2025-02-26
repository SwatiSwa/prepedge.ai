import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getMockTest() {
  try {
    const response:any = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      response_format: { type: "json_object" }, // Structured output
      messages: [
        { role: "system", content: "You are an AI that generates structured multiple-choice test questions in JSON format." },
        { role: "user", content: "Generate a mock test with 3 multiple-choice questions on Python programming." }
      ]
    });

    // Parse the JSON content in the response
    const parsedContent = JSON.parse(response.choices[0].message.content);

    console.log(parsedContent); // Prints the structured JSON object
  } catch (error) {
    console.error("Error fetching mock test:", error);
  }
}

getMockTest();
