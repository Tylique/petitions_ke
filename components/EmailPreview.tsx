/*this program is written for the benefit of the society*/
/* Always attribute this text as part of the license */
/* released under MIT opensource license*/
/* developed by: @Victor Mark */
/* You can add your name here if you improve code functionality*/
/*https://github.com/Tylique*/

"use client";
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface Topic {
  id: string;
  title: string;
  recipients: string[];
  // add other properties as needed
}
export default function EmailPreview({
  email,
  currentTopic
}: {
  email: string;
  currentTopic?: Topic
}) {
  const handleSendEmail = () => {
    if (!currentTopic) return;

    const subject = `Petition: ${currentTopic.title}`;
    const recipients = currentTopic.recipients.join(';');
    const mailtoLink = `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(email)}`;

    window.open(mailtoLink, '_blank');
  };

  return (
    <div className="border rounded p-3 bg-white dark:bg-[#1e1e1e] dark:border-[#2e2e2e]">
  <div
    className="mb-3 p-3 border rounded bg-light dark:bg-[#1e1e1e] dark:border-[#2e2e2e]"
    style={{
      maxHeight: '400px',
      overflowY: 'auto',
      whiteSpace: 'pre-wrap',
      fontFamily: 'monospace',
      lineHeight: '1.5',
      color: 'inherit'
    }}
  >
    {email}
  </div>
  <button
    onClick={handleSendEmail}
    className="btn btn-success w-100"
    disabled={!currentTopic?.recipients?.length}
  >
    <i className="bi bi-envelope me-2"></i>
    {currentTopic?.recipients?.length
      ? `Send to ${currentTopic.recipients.length} recipient(s)`
      : 'No recipients specified'}
  </button>
</div>
  );
}
