import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, name } = await req.json();
  if (!email || !name) {
    return NextResponse.json({ error: 'Email and name required' }, { status: 400 });
  }
  try {
    const result = await createUser(email, name);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
