import { zValidator } from '@hono/zod-validator';
import { StatusCode } from '@purrfect_match/shared/models/status-codes';
import type { ValidationTargets } from 'hono';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { prettifyError, type ZodObject } from 'zod';
import type { ZodMiniObject } from 'zod/v4-mini';

export const schemaMiddleware = <Schema extends ZodObject | ZodMiniObject, Target extends keyof ValidationTargets>(
  target: Target,
  schema: Schema,
) => {
  return createMiddleware(
    zValidator(target, schema, (result) => {
      if (result.success === false)
        throw new HTTPException(StatusCode.CLIENT_ERROR, { message: prettifyError(result.error) });
    }),
  );
};
