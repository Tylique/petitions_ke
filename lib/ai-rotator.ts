/*this program is written for the benefit of the society*/
/* Always attribute this text as part of the license */
/* released under MIT opensource license*/
/* developed by: @Victor Mark */
/* You can add your name here if you improve code functionality*/
/*https://github.com/Tylique*/

export class AIRotator {
  private static instance: AIRotator;
  private readonly keys: string[];
  private readonly models: string[];
  private currentKeyIndex = 0;
  private currentModelIndex = 0;
  private errorCounts: Map<string, number> = new Map();
  private readonly MAX_ERRORS = 3;
  private readonly COOLDOWN_MS = 60000;
  private readonly ERROR_THRESHOLD = 2; // Number of attempts before switching model

  private constructor() {
    // Dynamically collect all available keys from environment
    this.keys = Array.from({ length: 16 }, (_, i) =>
      process.env[`OPENROUTER_KEY${i+1}`]
    ).filter((key): key is string => !!key);

    if (this.keys.length === 0) {
      throw new Error('No OpenRouter API keys found in environment variables');
    }

    // Models ordered by preference/performance
    this.models = [
      'meta-llama/llama-3.1-8b-instruct:free',
      'mistralai/mistral-7b-instruct:free',
      'google/gemma-2-9b:free',
      'qwen/qwen2.5-72b-instruct:free',
      'meta-llama/llama-3.2-1b-instruct:free',
      'nousresearch/nous-hermes-2-mixtral-8x7b-dpo:free'
    ];
  }

  public static getInstance(): AIRotator {
    if (!AIRotator.instance) {
      AIRotator.instance = new AIRotator();
    }
    return AIRotator.instance;
  }

  public getNextProvider() {
    if (this.keys.length === 0) {
      throw new Error('😢 No API keys available for AI models.');
    }

    let attempts = 0;
    let lastErrorCount = 0;

    while (attempts < this.keys.length * this.ERROR_THRESHOLD) {
      const key = this.keys[this.currentKeyIndex];
      const model = this.models[this.currentModelIndex];
      const errorCount = this.errorCounts.get(key) || 0;

      // Rotate models less frequently than keys
      if (attempts > 0 && attempts % this.ERROR_THRESHOLD === 0) {
        this.currentModelIndex = (this.currentModelIndex + 1) % this.models.length;
      }

      if (errorCount < this.MAX_ERRORS) {
        return {
          key,
          model,
          markSuccess: () => {
            this.errorCounts.delete(key);
            // Reset model index on success to prefer better models
            this.currentModelIndex = 0;
          },
          markFailure: () => {
            const count = this.errorCounts.get(key) || 0;
            this.errorCounts.set(key, count + 1);
            setTimeout(() => this.errorCounts.delete(key), this.COOLDOWN_MS);

            // Move to next key immediately on failure
            this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
          }
        };
      }

      this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
      attempts++;
    }

    throw new Error('🥵 All API keys are in cooldown. Please wait before retrying.');
  }
}
