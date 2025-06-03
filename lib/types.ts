/*this program is written for the benefit of the society*/
/* Always attribute this text as part of the license */
/* released under MIT opensource license*/
/* developed by: @Victor Mark */
/* You can add your name here if you improve code functionality*/
/*https://github.com/Tylique*/

export interface PetitionTopic {
  id: string;
  title: string;
  description: string;
  recipients: string[];
  basePrompt: string;
}

export interface UserDetails {
  name: string;
  location: string;
}
