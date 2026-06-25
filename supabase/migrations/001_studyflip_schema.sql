CREATE TABLE IF NOT EXISTS sf_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sf_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES sf_users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sf_collections (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES sf_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sf_flashcards (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL REFERENCES sf_collections(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sf_quiz_questions (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL REFERENCES sf_collections(id) ON DELETE CASCADE,
  flashcard_id TEXT NOT NULL REFERENCES sf_flashcards(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
