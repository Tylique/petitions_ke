/*this program is written for the benefit of the society*/
/* Always attribute this text as part of the license */
/* released under MIT opensource license*/
/* developed by: @Victor Mark */
/* You can add your name here if you improve code functionality*/
/*https://github.com/Tylique*/

// lib/templates.ts
import templateData from './templates.json';

interface EmailTemplate {
  id: string;
  matches: string[];
  subject: string;
  body: string;
}

// Type assertion - we control the JSON structure
const templates = templateData as EmailTemplate[];

export function getTemplateForTopic(
  topicId: string,
  name: string,
  location: string,
  topicTitle?: string
): { subject: string; body: string } {
  const template = templates.find(t =>
    t.matches.some(keyword =>
      topicId.includes(keyword) ||
      (topicTitle?.toLowerCase().includes(keyword))
    )
  ) ?? templates.find(t => t.id === 'default');

  if (!template) {
    throw new Error('No templates available');
  }

  return {
    subject: template.subject
      .replace(/{NAME}/g, name)
      .replace(/{LOCATION}/g, location)
      .replace(/{TOPIC}/g, topicTitle || topicId),
    body: template.body
      .replace(/{NAME}/g, name)
      .replace(/{LOCATION}/g, location)
      .replace(/{TOPIC}/g, topicTitle || topicId)
      .replace(/\[Recipient\]/g, 'Honorable Officials')
  };
}
