/*this program is written for the benefit of the society*/
/* Always attribute this text as part of the license */
/* released under MIT opensource license*/
/* developed by: @Victor Mark */
/* You can add your name here if you improve code functionality*/
/*https://github.com/Tylique*/

export class AIRotator {
  private static instance: AIRotator;
  private keys: string[];
  private models: string[];
  private currentKeyIndex = 0;
  private currentModelIndex = 0;
  private errorCounts: Map<string, number> = new Map();
  private readonly MAX_ERRORS = 3;
  private readonly COOLDOWN_MS = 60000;

  private constructor() {
    this.keys = [
      process.env.OPENROUTER_KEY1!,
      process.env.OPENROUTER_KEY2!,
      process.env.OPENROUTER_KEY3!,
      process.env.OPENROUTER_KEY4!,
      process.env.OPENROUTER_KEY5!,
      process.env.OPENROUTER_KEY6!
    ].filter(Boolean);

    this.models = [
      'mistralai/mistral-7b-instruct:free',
      'meta-llama/llama-3.1-8b-instruct:free',
      'nousresearch/nous-hermes-2-mixtral-8x7b-dpo:free'
    ];
  }

  public static getInstance(): AIRotator {
      if (!AIRotator.instance) {
        AIRotator.instance = new AIRotator();
      }
      return AIRotator.instance;
    }

    // Changed from getNextKeyModel to getNextProvider for consistency
    public getNextProvider() {
      if (this.keys.length === 0) throw new Error('😢No AI models available😢');

      let attempts = 0;
      while (attempts < this.keys.length * 2) {
        const key = this.keys[this.currentKeyIndex];
        this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;

        const model = this.models[this.currentModelIndex];
        this.currentModelIndex = (this.currentModelIndex + 1) % this.models.length;

        const errorCount = this.errorCounts.get(key) || 0;
        if (errorCount < this.MAX_ERRORS) {
          return {
            key,
            model,
            markSuccess: () => this.errorCounts.delete(key),
            markFailure: () => {
              const count = this.errorCounts.get(key) || 0;
              this.errorCounts.set(key, count + 1);
              setTimeout(() => {
                this.errorCounts.delete(key);
              }, this.COOLDOWN_MS);
            }
          };
        }
        attempts++;
      }
      throw new Error('That was a hot run😭🔥 I am currently in cooldown🥵');
    }
  }
