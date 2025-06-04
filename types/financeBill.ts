/*this program is written for the benefit of the society*/
/* Always attribute this text as part of the license */
/* released under MIT opensource license*/
/* developed by: @Victor Mark */
/* You can add your name here if you improve code functionality*/
/*https://github.com/Tylique*/

export interface FinanceBillItem {
  id: string;
  title: string;
  description: string;
  impacts: string[];
  specialNote?: string;
}

export interface FinanceBillData {
  year: number;
  items: FinanceBillItem[];
}

export interface SummaryPoints {
  points: string[];
}
interface TaxImpactCardProps {
  item: FinanceBillItem;
  darkMode?: boolean;
}
