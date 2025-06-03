/*this program is written for the benefit of the society*/
/* Always attribute this text as part of the license */
/* released under MIT opensource license*/
/* developed by: @Victor Mark */
/* You can add your name here if you improve code functionality*/
/*https://github.com/Tylique*/

"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    recipients: '',
    contact: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captcha, setCaptcha] = useState({ question: '', answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');

  // Generate CAPTCHA on component mount
  useEffect(() => {
    generateNewCaptcha();
  }, []);

  const generateNewCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({
      question: `${num1} + ${num2}`,
      answer: num1 + num2
    });
    setUserAnswer('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // CAPTCHA validation
    if (parseInt(userAnswer) !== captcha.answer) {
      toast.error('Incorrect CAPTCHA answer. Please try again.');
      generateNewCaptcha();
      return;
    }

    // Form validation
    if (!formData.title.trim()) {
      toast.error('Please enter a title for your petition');
      return;
    }

    if (!formData.recipients.trim()) {
      toast.error('Please enter at least one recipient email');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = formData.recipients
      .split(',')
      .map(email => email.trim())
      .filter(email => email && !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      toast.error(`Invalid email format: ${invalidEmails.join(', ')}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          recipients: formData.recipients,
          contact: formData.contact.trim(),
          captchaAnswer: captcha.answer
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Submission failed');
      }

      // Show success toast
      toast.success(
  <div className="flex items-center">
    <FaCheckCircle className="text-green-500 mr-2" />
    <span>Your petition has been submitted for review!</span>
  </div>,
  {
    duration: 5000,
    position: 'top-center',
    className: 'dark:bg-green-900 dark:text-green-100',
  }
);

      // Reset form
      setFormData({
        title: '',
        description: '',
        recipients: '',
        contact: ''
      });
      generateNewCaptcha();

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Submission failed. Please try again.');
      generateNewCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };
  const recipientCount = formData.recipients
    .split(',')
    .filter(email => email.trim()).length;

  return (
    <div className="container py-4" style={{ maxWidth: '800px' }}>
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="mb-4">
            <Link href="/" className="btn btn-outline-success btn-sm mb-3">
              <i className="bi bi-arrow-left me-1"></i> Back to Home
            </Link>
            <h2 className="h4 text-success">
              <i className="bi bi-plus-circle me-2"></i>
              Suggest New Petition
            </h2>
            <p className="text-muted small">
              Your suggestion will be reviewed before publishing.
              Approved petitions will appear in the main list.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label fw-bold">
                Petition Title*
              </label>
              <input
                type="text"
                id="title"
                className="form-control"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Corruption in Ruaraka Land Case"
                required
              />
              <div className="form-text">
                Clear, concise title describing the issue
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Detailed Description*
              </label>
              <textarea
                id="description"
                className="form-control"
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Provide context about the issue, why it matters, and what change you want to see..."
                required
              />
              <div className="form-text">
                This will help us create a better petition template
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="recipients" className="form-label fw-bold">
                Recipient Emails*
                {recipientCount > 0 && (
                  <span className="text-muted ms-2">({recipientCount})</span>
                )}
              </label>
              <input
                type="text"
                id="recipients"
                className="form-control"
                value={formData.recipients}
                onChange={(e) => setFormData({...formData, recipients: e.target.value})}
                placeholder="official1@government.go.ke, official2@agency.org"
                required
              />
              <div className="form-text">
                Separate multiple emails with commas. These should be official government addresses.
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="contact" className="form-label">
                Your Contact Information (Optional)
              </label>
              <input
                type="text"
                id="contact"
                className="form-control"
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                placeholder="your@email.com or +254700000000"
              />
              <div className="form-text">
                If you'd like to be contacted about this petition
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold d-flex align-items-center gap-2">
                <span>CAPTCHA Verification:</span>
                <span className="text-success">What is {captcha.question}?</span>
              </label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Your answer"
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={generateNewCaptcha}
                  title="Generate new question"
                  disabled={isSubmitting}
                >
                  <i className="bi bi-arrow-repeat"></i>
                </button>
              </div>
              <div className="form-text">
                Please solve this simple math problem to prove you're human
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  ></span>
                  <span role="status">Submitting...</span>
                </>
              ) : (
                'Submit for Review'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
