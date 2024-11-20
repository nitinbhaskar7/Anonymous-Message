import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';



// export async function POST(request) {

//   const google = createGoogleGenerativeAI({
//     // custom settings
//     apiKey: "-------------------"
//   });
  
//   const result = await streamText({
//     model: google('gemini-1.5-pro-latest'),
//     prompt: "Suggest me 5 questions for an anonymous question website The response should just be the questions and each question is seprated by || keep the questions fun but respectful without numbering plain like a paragraph and keep them short"
//     });

// return result.toDataStreamResponse() 
// }

// ----------------

import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';



export async function POST(request){
  
  try{const lmstudio = createOpenAI({
    name: 'lmstudio',
    apiKey: 'not-needed',
    baseURL: 'http://localhost:1234/v1',
  });
  
  const text = await streamText({
    model: lmstudio('llama-3.2-1b'),
    prompt: "Suggest me 5 questions for an anonymous question website The response should just be the questions and each question is seprated by || keep the questions fun but respectful without numbering plain like a paragraph and keep them short",
  });

  return text.toDataStreamResponse() ;
}
catch(e){
  console.log(e)
}
}