import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { EnvironmentVariables } from 'src/shared/services/config-service/env-variables/env-schema';

export const validateEnv = (config: Record<string, unknown>): EnvironmentVariables => {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    const errorMessages = errors
      .map(error => {
        const constraints = error.constraints
          ? Object.values(error.constraints)
              .map(msg => msg.replace(new RegExp(`^${error.property}\\s*`), '').trim())
              .join(', ')
          : '';

        return `- ${error.property}: ${constraints}`;
      })
      .join('\n');
    throw new Error(`Environment variables validation failed:\n${errorMessages}\n`);
  }

  return validatedConfig;
};
