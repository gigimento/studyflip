# StudyFlip

AI-powered flashcard generator for students. Upload text, get flashcards, study with flip cards and quizzes.

## Tech Stack

Next.js 16 · TypeScript · Tailwind CSS v4 · SQLite (better-sqlite3) · Google Gemini API

## Getting Started

```bash
npm install
cp .env.local.example .env.local  # Add your Google Gemini API key
npm run dev
```

## Routes

- `/` — Landing page
- `/auth/login` — Login / Register
- `/dashboard` — My Collections
- `/dashboard/new` — Create collection + generate cards
- `/dashboard/collections/[id]` — View and edit cards
- `/dashboard/collections/[id]/study` — Study mode (flip cards)
- `/dashboard/collections/[id]/quiz` — Quiz mode (multiple choice)

## Features

- AI flashcard generation from any text
- Editable cards with inline editing
- Study mode with flip-to-reveal
- Quiz mode with AI-generated multiple choice questions
- Score tracking
- Collection management
