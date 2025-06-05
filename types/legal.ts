/*this program is written for the benefit of the society*/
/* Always attribute this text as part of the license */
/* released under MIT opensource license*/
/* developed by: @Victor Mark */
/* You can add your name here if you improve code functionality*/
/*https://github.com/Tylique*/

export type LegalDocumentType = 'privacy' | 'tos';

export type LegalContent = {
  [key in LegalDocumentType]: {
    title: string;
    lastUpdated: string;
    sections: { title: string; content: string }[];
    contact: { text: string; email: string };
  };
};
