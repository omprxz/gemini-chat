// src/app/api/response/route.js

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { cookies } from 'next/headers';

export async function POST(req) {
  const { model, prompt, history } = await req.json();
  const modelToUse = model || 'gemini-1.5-flash';

  // Check for API key in cookies
  const cookieStore = cookies();
  const apiKey = cookieStore.get('gemini_api')?.value || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const chatSession = await genAI.getGenerativeModel({ model: modelToUse });
    const result = await chatSession.startChat({ history });
    const response = await result.sendMessage(prompt);

    return NextResponse.json({ response: response.response.text() });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error generating response' }, { status: 500 });
  }
}