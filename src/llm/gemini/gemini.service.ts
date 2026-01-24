import type { GenerateContentParameters, GenerateContentResponse } from '@google/genai';
import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiService {
  private gemini: GoogleGenAI;

  constructor() {
    // The client gets the API key from the environment variable `GEMINI_API_KEY`.
    this.gemini = new GoogleGenAI({});
  }

  async askGeminiWithStream(data: GenerateContentParameters): Promise<AsyncGenerator<GenerateContentResponse>> {
    const response = await this.gemini.models.generateContentStream({
      model: data.model,
      contents: data.contents,
    });

    return response;
  }

  async askGemini(data: GenerateContentParameters): Promise<GenerateContentResponse> {
    const response = await this.gemini.models.generateContent({
      model: data.model,
      contents: data.contents,
    });

    return response;
  }
}
