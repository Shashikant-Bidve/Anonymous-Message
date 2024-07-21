import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';


export async function POST(request: Request) {
    
try {
    const groq = createOpenAI({
        baseURL: 'https://api.groq.com/openai/v1',
        apiKey: process.env.GROQ_API_KEY,
      });
      
      const { text } = await generateText({
        model: groq('llama3-8b-8192'),
        prompt: "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.Don't provide any additional text",
      });
      
      return Response.json({
          success: true,
          text: text
      },{
        status: 201
      })
} catch (error) {
    console.log("Error creating suggested messages",error);
    return Response.json({
        success: false,
        message:"Error in suggesting messages"
    },{
        status: 500
    })
}



}