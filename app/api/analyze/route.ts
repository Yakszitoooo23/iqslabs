import { NextRequest, NextResponse } from 'next/server';
import {
  AnalyzeInput,
  INTERPRETATION_SYSTEM_PROMPT,
  buildFallbackInterpretation,
  buildInterpretationUserPrompt,
} from '@/lib/interpretation';

const OPENAI_TIMEOUT_MS = 15_000;

function isValidInput(body: unknown): body is AnalyzeInput {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  if (
    typeof b.scaledScore !== 'number' ||
    typeof b.percentile !== 'number' ||
    typeof b.category !== 'string' ||
    !Array.isArray(b.strengths) ||
    !Array.isArray(b.weaknesses)
  ) {
    return false;
  }
  if (b.improvementGoal != null && typeof b.improvementGoal !== 'string') return false;
  if (b.cognitiveProfile != null && typeof b.cognitiveProfile !== 'object') return false;
  if (b.demographics != null) {
    if (typeof b.demographics !== 'object') return false;
    const d = b.demographics as Record<string, unknown>;
    if (d.age_range != null && typeof d.age_range !== 'string') return false;
  }
  return true;
}

export async function POST(req: NextRequest) {
  let input: AnalyzeInput;

  try {
    const body = await req.json();
    if (!isValidInput(body)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    input = body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const generatedAt = new Date().toISOString();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      interpretation: buildFallbackInterpretation(input),
      generated_at: generatedAt,
      source: 'fallback',
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 220,
        messages: [
          { role: 'system', content: INTERPRETATION_SYSTEM_PROMPT },
          { role: 'user', content: buildInterpretationUserPrompt(input) },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const interpretation = data.choices?.[0]?.message?.content?.trim();

    if (!interpretation) {
      throw new Error('Empty OpenAI response');
    }

    return NextResponse.json({
      interpretation,
      generated_at: generatedAt,
      source: 'openai',
    });
  } catch (err) {
    console.error('Analyze route error:', err);
    return NextResponse.json({
      interpretation: buildFallbackInterpretation(input),
      generated_at: generatedAt,
      source: 'fallback',
    });
  } finally {
    clearTimeout(timeout);
  }
}
