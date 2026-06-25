import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }
  const result = loginUser(email);
  if (!result) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(result);
}
