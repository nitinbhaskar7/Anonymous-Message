// import { createGoogleGenerativeAI } from '@ai-sdk/google';
// import {  streamText } from 'ai';


// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;
// const google = createGoogleGenerativeAI({
//     // custom settings
//     apiKey : process.env.GOOGLE_GENERATIVE_AI_API_KEY
//   });
// export async function POST(req) {
//   const { prompt } = await req.json();

//   const result = await streamText({
//     model: google('gemini-1.5-pro-latest'),
//     prompt,
//   });

//   return result.toDataStreamResponse();
// }