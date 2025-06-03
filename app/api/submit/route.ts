/*this program is written for the benefit of the society*/
/* Always attribute this text as part of the license */
/* released under MIT opensource license*/
/* developed by: @Victor Mark */
/* You can add your name here if you improve code functionality*/
/*https://github.com/Tylique*/

// app/api/submit/route.ts
import { submitToGitHub } from '@/lib/github';
import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize rate limiter (3 requests per minute)
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '1 m'),
});

export async function POST(req: Request) {
  try {
    // Rate limiting check
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return new NextResponse(
        JSON.stringify({
          error: `Too many requests. Try again in ${Math.ceil((reset - Date.now()) / 1000)} seconds`
        }),
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString()
          }
        }
      );
    }

    const {
      title,
      description,
      recipients,
      contact,
      captchaAnswer
    } = await req.json();

    // CAPTCHA verification
    if (typeof captchaAnswer !== 'number') {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed' },
        { status: 400 }
      );
    }

    // Input validation
    if (!title || typeof title !== 'string' || title.trim().length < 5) {
      return NextResponse.json(
        { error: 'Title must be at least 5 characters' },
        { status: 400 }
      );
    }

    // Recipients validation (accept both string and array)
    let recipientEmails: string[] = [];
    if (typeof recipients === 'string') {
      recipientEmails = recipients.split(',').map(e => e.trim()).filter(Boolean);
    } else if (Array.isArray(recipients)) {
      recipientEmails = recipients.map(e => typeof e === 'string' ? e.trim() : '').filter(Boolean);
    }

    if (recipientEmails.length === 0) {
      return NextResponse.json(
        { error: 'At least one valid email recipient is required' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = recipientEmails.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      return NextResponse.json(
        { error: `Invalid email format: ${invalidEmails.join(', ')}` },
        { status: 400 }
      );
    }

    // Contact validation (if provided)
    if (contact && (typeof contact !== 'string' || contact.trim().length > 100)) {
      return NextResponse.json(
        { error: 'Contact information is too long (max 100 characters)' },
        { status: 400 }
      );
    }

    // Description validation
    if (description && (typeof description !== 'string' || description.length > 2000)) {
      return NextResponse.json(
        { error: 'Description is too long (max 2000 characters)' },
        { status: 400 }
      );
    }

    // Submit to GitHub - convert recipients to comma-separated string for compatibility
    const submission = await submitToGitHub({
      title: title.trim(),
      description: description?.trim() || '',
      recipients: recipientEmails.join(','), // Convert back to string
      contact: contact?.trim() || ''
    });

    return new NextResponse(
      JSON.stringify(submission),
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString()
        }
      }
    );

  } catch (error) {
    console.error('Submission error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Failed to submit. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge'; // Optional: for Vercel Edge Functions
