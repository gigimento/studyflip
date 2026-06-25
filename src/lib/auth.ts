import { supabase } from './supabase';

export async function createUser(email: string, name: string) {
  const id = crypto.randomUUID();
  const sessionId = crypto.randomUUID();
  const { error: userError } = await supabase.from('sf_users').insert({ id, email, name });
  if (userError) throw new Error(userError.message);
  const { error: sessionError } = await supabase.from('sf_sessions').insert({ id: sessionId, user_id: id });
  if (sessionError) throw new Error(sessionError.message);
  return { userId: id, sessionId };
}

export async function loginUser(email: string) {
  const { data: user } = await supabase.from('sf_users').select('id, name').eq('email', email).single();
  if (!user) return null;
  const sessionId = crypto.randomUUID();
  const { error: sessionError } = await supabase.from('sf_sessions').insert({ id: sessionId, user_id: user.id });
  if (sessionError) throw new Error(sessionError.message);
  return { userId: user.id, sessionId, name: user.name };
}

export async function getSession(sessionId: string) {
  const { data: session } = await supabase
    .from('sf_sessions')
    .select('id, user_id')
    .eq('id', sessionId)
    .single();
  if (!session) return null;
  const { data: user } = await supabase
    .from('sf_users')
    .select('email, name')
    .eq('id', session.user_id)
    .single();
  if (!user) return null;
  return { id: session.id, user_id: session.user_id, email: user.email, name: user.name };
}
