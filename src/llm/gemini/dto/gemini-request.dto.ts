import { IsEnum, IsString } from 'class-validator';
import { GeminiModels } from 'src/llm/gemini/type/gemini-models';

export class GeminiRequestDto {
  @IsEnum(GeminiModels)
  model: GeminiModels;

  @IsString()
  message: string;
}
