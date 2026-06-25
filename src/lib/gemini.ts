const API_KEY = process.env.GOOGLE_AI_API_KEY || '';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function generateFlashcards(text: string): Promise<{ question: string; answer: string }[]> {
  const prompt = `Generate flashcards from this text. Return a JSON array of objects with "question" and "answer" fields. Each card should test one key concept. Return ONLY valid JSON, no markdown, no code fences.

Text: ${text.slice(0, 10000)}`;

  const res = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
    }),
  });

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data = await res.json();
  const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('No JSON array in response');
  return JSON.parse(jsonMatch[0]);
}

export async function generateQuizQuestions(cards: { question: string; answer: string }[]): Promise<{ question: string; options: string[]; correctIndex: number }[]> {
  const prompt = `Create multiple-choice quiz questions from these flashcards. For each flashcard, generate one question with 4 options (one correct). Return a JSON array of objects with "question", "options" (array of 4 strings), and "correctIndex" (0-3). Return ONLY valid JSON, no markdown.

Flashcards:
${JSON.stringify(cards, null, 2)}`;

  const res = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 8192 },
    }),
  });

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data = await res.json();
  const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('No JSON array in response');
  return JSON.parse(jsonMatch[0]);
}
