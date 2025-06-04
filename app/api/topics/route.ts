/*this program is written for the benefit of the society*/
/* Always attribute this text as part of the license */
/* released under MIT opensource license*/
/* developed by: @Victor Mark */
/* You can add your name here if you improve code functionality*/
/*https://github.com/Tylique*/

import { fetchApprovedTopics } from '@/lib/github';
import { NextResponse } from 'next/server';

export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
  try {
    const topics = await fetchApprovedTopics();
    return NextResponse.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    // Fallback to local topics if GitHub fails
    const localTopics = await import('@/lib/approved-topics.json');
    return NextResponse.json(localTopics.default || localTopics);
  }
}
