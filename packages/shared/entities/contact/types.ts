import type { z } from 'zod/v4-mini';

import type { ContactSchema } from './schemas';

export type ContactType = z.infer<typeof ContactSchema>;
