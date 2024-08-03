// src/app/api/setup/[action]/route.js

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  const { apiKey } = await req.json();
  const action = req.url.split('/').pop();

  if (action === 'api') {
    const cookie = cookies();
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1); // 1 month

    cookie.set('gemini_api', apiKey, {
      httpOnly: true,
      sameSite: 'strict',
      expires: expirationDate
    });

    return NextResponse.json({ message: 'API key saved' });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}