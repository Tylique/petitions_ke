/*this program is written for the benefit of the society*/
/* Always attribute this text as part of the license */
/* released under MIT opensource license*/
/* developed by: @Victor Mark */
/* You can add your name here if you improve code functionality*/
/*https://github.com/Tylique*/

"use client";

import { Typography, Divider, Button } from 'antd';
import Link from 'next/link';
import styles from './page.module.css';
import type { LegalDocumentType, LegalContent } from '@/types/legal';

const { Title, Text, Paragraph } = Typography;

export default function LegalClient({
  content,
  lastUpdated
}: {
  content: LegalContent[LegalDocumentType];
  lastUpdated: string;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <Button type="primary" className="btn btn-outline-success btn-sm mb-3">
            ← Back to Home
          </Button>
        </Link>
        <Title level={2} className={styles.title}>
          {content.title}
        </Title>
        <Paragraph type="secondary" className={styles.subtitle}>
          Last Updated: {lastUpdated}
        </Paragraph>
      </div>

      <div className={styles.content}>
        {content.sections.map((section, index) => (
          <Paragraph key={index}>
            <Text strong>{section.title}</Text><br />
            {section.content}
          </Paragraph>
        ))}

        <Divider className={styles.divider} />

        <Title level={4}>Contact Us</Title>
        <Paragraph>
          {content.contact.text}{' '}
          <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
        </Paragraph>
      </div>
    </div>
  );
}
