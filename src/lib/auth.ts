import { getDb } from './db';

export function createUser(email: string, name: string) {
  const db = getDb();
  const id = crypto.randomUUID();
  db.prepare('INSERT INTO users (id, email, name) VALUES (?, ?, ?)').run(id, email, name);
  const sessionId = crypto.randomUUID();
  db.prepare('INSERT INTO sessions (id, user_id) VALUES (?, ?)').run(sessionId, id);
  return { userId: id, sessionId };
}

export function loginUser(email: string) {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!user) return null;
  const sessionId = crypto.randomUUID();
  db.prepare('INSERT INTO sessions (id, user_id) VALUES (?, ?)').run(sessionId, user.id);
  return { userId: user.id, sessionId, name: user.name };
}

export function getSession(sessionId: string) {
  const db = getDb();
  const session = db.prepare(`
    SELECT s.id, s.user_id, u.email, u.name
    FROM sessions s JOIN users u ON s.user_id = u.id
    WHERE s.id = ?
  `).get(sessionId) as any;
  return session || null;
}
