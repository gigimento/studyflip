import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StudyFlip - AI Flashcard Generator',
  description: 'Generate flashcards from your study material with AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
