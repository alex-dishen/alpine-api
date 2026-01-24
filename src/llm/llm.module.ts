import { Module } from '@nestjs/common';
import { GeminiService } from 'src/llm/gemini/gemini.service';

@Module({
  providers: [GeminiService],
  exports: [GeminiService],
})
export class LLMModule {}
