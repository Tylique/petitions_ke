/*this program is written for the benefit of the society*/
/* Always attribute this text as part of the license */
/* released under MIT opensource license*/
/* developed by: @Victor Mark */
/* You can add your name here if you improve code functionality*/
/*https://github.com/Tylique*/

// components/TaxImpactCard.tsx
"use client";

import { Card, Typography } from 'antd';
import styles from './TaxImpactCard.module.css';
import type { FinanceBillItem } from '@/types/financeBill';

const { Text, Paragraph } = Typography;

interface TaxImpactCardProps {
  item: FinanceBillItem;
  darkMode?: boolean; // Add this line
}

export default function TaxImpactCard({ item, darkMode = false }: TaxImpactCardProps) {
  return (
    <Card className={`${styles.card} ${darkMode ? styles.dark : ''}`}>
      <Text className={`${styles.cardTitle} ${styles.clauseNumber}`}>
        Clause {item.id}: <span style={{ color: '#33333' }}>{item.title}</span>
      </Text>

      <div className={styles.cardContent}>
        <Text strong className={styles.sectionLabel}>What it is:</Text>
        <Paragraph style={{ color: '#ff0000' }}>{item.description}</Paragraph>

        <Text strong className={styles.impactLabel}>Negative Impacts:</Text>
        <ul>
          {item.impacts.map((impact, i) => (
            <li key={i}>{impact}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
