/*this program is written for the benefit of the society*/
/* Always attribute this text as part of the license */
/* released under MIT opensource license*/
/* developed by: @Victor Mark */
/* You can add your name here if you improve code functionality*/
/*https://github.com/Tylique*/

// app/bill/page.tsx
"use client";

import { Typography, Divider, Button } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { FinanceBillItem, SummaryPoints } from '@/types/financeBill';
import financeBillData from '@/lib/financeBill2025.json';
import summaryPoints from '@/lib/summaryPoints.json';
import TaxImpactCard from '@/components/TaxImpactCard';
import styles from './page.module.css';

const { Title, Text, Paragraph } = Typography;

export default function BillPage() {
  const billItems: FinanceBillItem[] = financeBillData.items;
  const summaryData: SummaryPoints = summaryPoints;
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(darkModeMediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    darkModeMediaQuery.addEventListener('change', handler);

    return () => darkModeMediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div className={`${styles.container} ${darkMode ? 'dark' : 'light'}`}>
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <Button type="primary" className="btn btn-outline-success btn-sm mb-3">
            ← Back to Home
          </Button>
        </Link>
        <Title level={2} className={styles.title}>
          Finance Bill 2025 Impact Analysis
        </Title>
        <Paragraph type="secondary" className={styles.subtitle}>
          {billItems.length} clauses that will affect ordinary Kenyans
        </Paragraph>
      </div>

      <div className={styles.cardGrid}>
        {billItems.map((item) => (
          <TaxImpactCard
            key={item.id}
            item={item}
            darkMode={darkMode}
          />
        ))}
      </div>
      <Divider className={styles.divider} />

      <div className={styles.summary}>
        <Title level={3} className={styles.summaryTitle}>Key Impacts</Title>
        <ul className={styles.summaryList}>
          {summaryData.points.map((point, index) => (
            <li key={index} className={styles.summaryPoint}>
              <Text className={styles.summaryText}>{point}</Text>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
