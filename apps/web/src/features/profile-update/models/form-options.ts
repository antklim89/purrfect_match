import { ProfileUpdateSchema } from '@purrfect_match/shared/entities/auth/schemas';
import type { ContactType } from '@purrfect_match/shared/entities/contact/types';
import { z } from 'zod/v4-mini';

import { createFormOptions } from '@/shared/lib/form';

export const profileUpdateFormOptions = createFormOptions({
  schema: z.required(ProfileUpdateSchema),
  defaultValues: {
    address: '',
    description: '',
    fullName: '',
    contacts: [] as ContactType[],
  },
});
