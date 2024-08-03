// src/app/api/models/route.js

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // Check for API key in cookies
  const cookieStore = cookies();
  const apiKey = cookieStore.get('gemini_api')?.value || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
  }

  try {
    const endp = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(endp);
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }
    const models = await response.json();
    return NextResponse.json({ models: models.models });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Error fetching models' }, { status: 500 });
  }
}