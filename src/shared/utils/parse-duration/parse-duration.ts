type TimeUnit = 'ms' | 's' | 'm' | 'h' | 'd';

const UNIT_TO_MS: Record<TimeUnit, number> = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

/**
 * Parses a duration string and converts it to the specified time unit.
 *
 * @param duration - Duration string in format like "1h", "30m", "7d", "500ms"
 * @param to - Target time unit: 'ms' | 's' | 'm' | 'h' | 'd'
 * @returns Duration converted to the target unit
 * @throws Error if the format is invalid
 *
 * @example
 * parseDuration('1h', 'ms')  // 3600000
 * parseDuration('1h', 's')   // 3600
 * parseDuration('60s', 'm')  // 1
 * parseDuration('24h', 'd')  // 1
 */
export function parseDuration(duration: string, to: TimeUnit): number {
  const match = duration.match(/^(\d+)(ms|[smhd])$/);

  if (!match) {
    throw new Error(`Invalid duration format: ${duration}. Expected format like "1h", "30m", "7d", "500ms"`);
  }

  const value = parseInt(match[1], 10);
  const fromUnit = match[2] as TimeUnit;

  const valueInMs = value * UNIT_TO_MS[fromUnit];

  return valueInMs / UNIT_TO_MS[to];
}
