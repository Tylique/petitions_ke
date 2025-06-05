/*this program is written for the benefit of the society*/
/* Always attribute this text as part of the license */
/* released under MIT opensource license*/
/* developed by: @Victor Mark */
/* You can add your name here if you improve code functionality*/
/*https://github.com/Tylique*/

// app/legal/privacy/page.tsx
import legalContent from '@/lib/legalContent.json';
import LegalClient from './LegalClient';

export default function PrivacyPage() {
  const content = legalContent['tos'];
  const lastUpdated = new Date(content.lastUpdated).toLocaleDateString();

  return <LegalClient content={content} lastUpdated={lastUpdated} />;
}
