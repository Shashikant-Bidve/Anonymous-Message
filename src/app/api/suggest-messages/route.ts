import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, StreamingTextResponse } from "ai";
import { request } from "http";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const message = await request.json();
    const userPrompt = message.prompt;
    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be based on the input that user provide. Below is the input that user had provided : 
     ${userPrompt} .`;

    const result = await streamText({
      model: google("models/gemini-pro"),
      prompt,
    });

    return new StreamingTextResponse(result.toAIStream());
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    throw error;
  }
}
