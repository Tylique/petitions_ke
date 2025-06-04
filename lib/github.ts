/*this program is written for the benefit of the society*/
/* Always attribute this text as part of the license */
/* released under MIT opensource license*/
/* developed by: @Victor Mark */
/* You can add your name here if you improve code functionality*/
/*https://github.com/Tylique*/

// lib/github.ts
import { Octokit } from 'octokit';
import type { PetitionTopic } from '@/lib/types';

interface SubmissionData {
  title: string;
  description: string;
  recipients: string; // Only accept string (comma-separated) to match API route
  contact?: string;
}

interface StoredSubmission {
  id: string;
  title: string;
  description: string;
  recipients: string[]; // Store as array in JSON
  contact?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}


export async function fetchApprovedTopics(): Promise<PetitionTopic[]> {
  if (!process.env.GITHUB_OWNER || !process.env.GITHUB_REPO) {
    throw new Error('Missing GitHub configuration');
  }

  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/main/lib/approved-topics.json`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch topics: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching topics:', error);
    // Fallback to local topics if GitHub fails
    const localTopics = await import('@/lib/approved-topics.json');
    return localTopics.default || localTopics;
  }
}

export async function submitToGitHub(data: SubmissionData): Promise<StoredSubmission> {
  // Validate environment variables
  if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_OWNER || !process.env.GITHUB_REPO) {
    throw new Error('Missing required GitHub configuration');
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });

  // Process recipients (ensure we have valid array)
  const recipientsArray = data.recipients
    .split(',')
    .map(email => email.trim())
    .filter(email => {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    });

  if (recipientsArray.length === 0) {
    throw new Error('No valid email recipients provided');
  }

  // Prepare submission data
  const submission: StoredSubmission = {
    id: `sub-${Date.now()}`,
    title: data.title.trim(),
    description: data.description?.trim() || '',
    recipients: recipientsArray,
    contact: data.contact?.trim(),
    createdAt: new Date().toISOString(),
    status: 'pending'
  };

  try {
    // Get existing submissions
    const { data: existing } = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        path: 'lib/submissions.json',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    );

    // Parse existing content or initialize empty array
    let currentContent: StoredSubmission[] = [];
    if (existing.content) {
      try {
        currentContent = JSON.parse(
          Buffer.from(existing.content, 'base64').toString()
        );
        if (!Array.isArray(currentContent)) {
          currentContent = [];
        }
      } catch (parseError) {
        console.error('Error parsing existing submissions:', parseError);
        currentContent = [];
      }
    }

    // Prepare new content
    const updatedContent = [...currentContent, submission];
    const content = Buffer.from(
      JSON.stringify(updatedContent, null, 2)
    ).toString('base64');

    // Update file on GitHub
    await octokit.request(
      'PUT /repos/{owner}/{repo}/contents/{path}',
      {
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        path: 'lib/submissions.json',
        message: `New submission: ${submission.title.substring(0, 50)}${submission.title.length > 50 ? '...' : ''}`,
        content,
        sha: existing.sha,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    );

    return submission;

  } catch (error) {
    console.error('GitHub API error:', error);

    if (error instanceof Error) {
      // Handle specific GitHub API errors
      if ('status' in error && error.status === 404) {
        // File doesn't exist yet - we should create it
        try {
          await octokit.request(
            'PUT /repos/{owner}/{repo}/contents/{path}',
            {
              owner: process.env.GITHUB_OWNER,
              repo: process.env.GITHUB_REPO,
              path: 'lib/submissions.json',
              message: `Initial submissions file creation`,
              content: Buffer.from(JSON.stringify([submission], null, 2)).toString('base64'),
              headers: {
                'X-GitHub-Api-Version': '2022-11-28'
              }
            }
          );
          return submission;
        } catch (createError) {
          console.error('Error creating new submissions file:', createError);
          throw new Error('Failed to create submissions file');
        }
      }

      throw new Error(`GitHub submission failed: ${error.message}`);
    }

    throw new Error('Unknown error occurred during GitHub submission');
  }
}
