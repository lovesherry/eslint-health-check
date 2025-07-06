// import type { Models } from '@google/genai';

declare module '@google/genai' {
  export interface GoogleGenAIOptions {
    /**
     * Optional. Determines whether to use the Vertex AI or the Gemini API.
     * When true, the Vertex AI API will be used.
     * When false, the Gemini API will be used.
     * If unset, default SDK behavior is to use the Gemini API service.
     */
    vertexai?: boolean;
    /**
     * Optional. The Google Cloud project ID for Vertex AI clients.
     * Only supported on Node runtimes, ignored on browser runtimes.
     */
    project?: string;
    /**
     * Optional. The Google Cloud project location for Vertex AI clients.
     * Only supported on Node runtimes, ignored on browser runtimes.
     */
    location?: string;
    /**
     * The API Key, required for Gemini API clients.
     * Required on browser runtimes.
     */
    apiKey?: string;
  }

  export interface Content {
    parts?: Part[];
    role?: string;
  }

  export interface Part {
    text?: string;
    inlineData?: InlineData;
  }

  export interface InlineData {
    mimeType: string;
    data: string;
  }

  export interface GenerationConfig {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
    stopSequences?: string[];
  }

  export interface GenerateContentParameters {
    model: string;
    contents: Content | Content[] | string | string[];
    config?: {
      generationConfig?: GenerationConfig;
      safetySettings?: SafetySetting[];
    };
  }

  export interface SafetySetting {
    category: string;
    threshold: string;
  }

  export interface GenerateContentResponse {
    candidates?: Candidate[];
    promptFeedback?: PromptFeedback;
  }

  export interface Candidate {
    content?: Content;
    finishReason?: string;
    index?: number;
    safetyRatings?: SafetyRating[];
  }

  export interface PromptFeedback {
    safetyRatings?: SafetyRating[];
  }

  export interface SafetyRating {
    category?: string;
    probability?: string;
  }

  export class Models {
    generateContent(
      params: GenerateContentParameters
    ): Promise<GenerateContentResponse>;
    generateContentStream(
      params: GenerateContentParameters
    ): Promise<AsyncGenerator<GenerateContentResponse>>;
  }

  export class GoogleGenAI {
    constructor(options: GoogleGenAIOptions);
    readonly models: Models;
  }
}

// 为现有的 GenerateContentResponse 添加 text 方法
declare module '@google/genai' {
  interface GenerateContentResponse {
    text(): string;
  }
}
