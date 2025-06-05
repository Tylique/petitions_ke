/*this program is written for the benefit of the society*/
/* Always attribute this text as part of the license */
/* released under MIT opensource license*/
/* developed by: @Victor Mark */
/* You can add your name here if you improve code functionality*/
/*https://github.com/Tylique*/

// components/EmailPreview.tsx
"use client";
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface Topic {
  id: string;
  title: string;
  recipients: string[];
}

interface EmailPreviewProps {
  email: string;
  currentTopic?: Topic;
  source?: 'ai' | 'template' | 'error';
}

export default function EmailPreview({
  email,
  currentTopic,
  source = 'ai'
}: EmailPreviewProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  const handleSendEmail = () => {
    if (!currentTopic) return;

    const subject = currentTopic.title.startsWith('Petition:')
      ? currentTopic.title
      : `Petition: ${currentTopic.title}`;

    const recipients = currentTopic.recipients.join(';');
    const mailtoLink = `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(email)}`;

    window.open(mailtoLink, '_blank');
  };

  return (
    <div className="border rounded p-3 bg-white dark:bg-[#1e1e1e] dark:border-[#2e2e2e]">
      {source === 'template' && (
        <div className="alert alert-warning mb-3">
          <i className="bi bi-info-circle me-2"></i>
          Using template email due to high demand. You may{' '}
          <button
            className="btn btn-link p-0 align-baseline"
            onClick={() => setShowOriginal(!showOriginal)}
          >
            {showOriginal ? 'hide' : 'show'} original template
          </button>.
        </div>
      )}

      <div
        className="mb-3 p-3 border rounded bg-light dark:bg-[#1e1e1e] dark:border-[#2e2e2e]"
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          lineHeight: '1.5'
        }}
      >
        {email}
      </div>

      {source === 'template' && showOriginal && (
        <div className="mt-2 p-2 bg-light rounded small">
          <strong>Template Note:</strong> This email was generated from a template.
          Consider personalizing it further before sending.
        </div>
      )}

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
