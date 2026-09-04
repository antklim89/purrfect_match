/** biome-ignore-all lint/suspicious/noConsole: ok */

import process from 'node:process';
import { createMiddleware } from 'hono/factory';

const colors = {
  RED: (text: string | number) => `\x1b[31m${text}\x1b[39m`,
  GREEN: (text: string | number) => `\x1b[32m${text}\x1b[39m`,
  YELLOW: (text: string | number) => `\x1b[33m${text}\x1b[39m`,
  BLUE: (text: string | number) => `\x1b[34m${text}\x1b[39m`,
  MAGENTA: (text: string | number) => `\x1b[36m${text}\x1b[39m`,
} as const;

const modifiers = {
  BOLD: (text: string | number) => `\x1b[1m${text}\x1b[22m`,
  DIM: (text: string | number) => `\x1b[2m${text}\x1b[22m`,
  UNDERLINE: (text: string | number) => `\x1b[4m${text}\x1b[22m`,
} as const;

function getStatus(currentStatus: number) {
  if (currentStatus < 300) return colors.GREEN(currentStatus);
  if (currentStatus < 400) return colors.BLUE(currentStatus);
  if (currentStatus < 500) return colors.YELLOW(currentStatus);
  if (currentStatus >= 500) return colors.RED(currentStatus);

  return colors.BLUE(currentStatus);
}

function getResponseTime(startTime: number) {
  const endTime = Date.now() - startTime;

  if (endTime > 600) return colors.RED(`${endTime}ms`);
  if (endTime > 200) return colors.YELLOW(`${endTime}ms`);
  return colors.GREEN(`${endTime}ms`);
}

export const loggerMiddleware = createMiddleware(async (c, next) => {
  if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production') return next();

  const start = Date.now();
  await next();
  console.log(
    '%s / %s in %s (%s)',
    modifiers.BOLD(c.req.method),
    getStatus(c.res.status),
    getResponseTime(start),
    modifiers.DIM(c.req.path),
  );
});
