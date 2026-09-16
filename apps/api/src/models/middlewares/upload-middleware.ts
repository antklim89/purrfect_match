import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

export const uploadMiddleware = <T extends string>(field: T) =>
  createMiddleware<{ Variables: { [P in T]: File } }, string, { in: { form: { [P in T]: File } } }, Response>(
    async (c, next) => {
      const formData = await c.req.formData();
      const image = formData.get(field);

      if (!(image instanceof Blob)) throw new HTTPException(400, { message: 'Invalid file.' });

      c.set(field, image);

      await next();
    },
  );
