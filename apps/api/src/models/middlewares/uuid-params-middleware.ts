import { zValidator } from '@hono/zod-validator';
import { StatusCode } from '@purrfect_match/shared/models/status-codes';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { prettifyError } from 'zod';
import { z } from 'zod/v4-mini';

export const uuidParamsMiddleware = <T extends string>(...keys: T[]) => {
  const uuidV7schema = z.string().check(z.uuidv7());

  const schema = z.object(
    Object.fromEntries(keys.map((key) => [key, uuidV7schema])) as { [P in T]: typeof uuidV7schema },
  );

  return createMiddleware(
    zValidator('param', schema, (result) => {
      if (result.success === false)
        throw new HTTPException(StatusCode.CLIENT_ERROR, { message: prettifyError(result.error) });
    }),
  );
};
