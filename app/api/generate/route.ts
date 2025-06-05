/*this program is written for the benefit of the society*/
/* Always attribute this text as part of the license */
/* released under MIT opensource license*/
/* developed by: @Victor Mark */
/* You can add your name here if you improve code functionality*/
/*https://github.com/Tylique*/

import { AIRotator } from '@/lib/ai-rotator';
import { NextResponse } from 'next/server';
import type { PetitionTopic, UserDetails } from '@/lib/types';
import { getTemplateForTopic } from '@/lib/templates';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { topic, userDetails }: { topic: PetitionTopic; userDetails: UserDetails } = await req.json();

  // Get template fallback ready first
  const name = userDetails.name || 'Concerned Citizen';
  const location = userDetails.location || 'Kenya';
  const template = getTemplateForTopic(
  topic.id,
  userDetails.name || 'Concerned Citizen',
  userDetails.location || 'Kenya',
  topic.title // Pass the title for {TOPIC} replacement
);

  try {
    // 1. Get AI provider
    const { key, model, markFailure } = AIRotator.getInstance().getNextProvider();

    // 2. Build minimal, focused prompt (removed any AI disclosure hints)
    const prompt = `
      Write as if you are the petitioner directly:
      - Use KENYAN ENGLISH
      - Where applicable quote Kenyan Constitution clauses
      - Maintain OFFICIAL but ACCESSIBLE tone
      - Word count: 250-300 words

      Petition Details:
      ${topic.basePrompt
        .replace(/{TOPIC}/g, topic.title)
        .replace(/{NAME}/g, name)
        .replace(/{LOCATION}/g, location)}
    `;

    // 3. Call AI API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://petitions-ke.vercel.app',
        'X-Title': 'Kenyan Petitions App'
      },
      body: JSON.stringify({
        model,
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 800,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      markFailure();
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const rawContent = data.choices[0]?.message?.content || '';

    // 4. Format response (completely remove any AI artifacts)
    const email = formatEmailBody(rawContent, userDetails);
    return NextResponse.json({
      email,
      source: 'generated' // Changed from 'ai' to more neutral term
    });

  } catch (error) {
    console.error('Generation error:', error);

    // Silent fallback to template - no mention of system issues
    if (template) {
      return NextResponse.json({
        email: template.body, // Return template as-is
        source: 'template'
      });
    }

    // Final fallback message (generic error)
    return NextResponse.json(
      {
        error: 'We encountered high demand. Please try again shortly.',
        source: 'error'
      },
      { status: 500 }
    );
  }
}

function formatEmailBody(raw: string, user: UserDetails): string {
  // 1. Remove any potential AI signatures
  let cleaned = raw.replace(/(As an AI|As a language model).*?(?=\n\n|$)/gis, '').trim();

  // 2. Ensure proper opening/closing
  if (!cleaned.startsWith('Dear')) {
    cleaned = `Dear Official,\n\n${cleaned}`;
  }
  if (!cleaned.includes('Sincerely,')) {
    cleaned += `\n\nSincerely,\n${user.name || 'Concerned Citizen'}\n${user.location || 'Kenya'}`;
  }

  // 3. Remove any remaining technical artifacts
  return cleaned.replace(/Note:.*?(?=\n\n|$)/g, '').trim();
}
