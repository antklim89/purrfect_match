import { ProfileUpdateSchema } from '@purrfect_match/shared/entities/profile/schemas';
import type { ProfileContactType } from '@purrfect_match/shared/entities/profile/types';
import { z } from 'zod/v4-mini';

import { createFormOptions } from '@/shared/lib/form';

export const profileUpdateFormOptions = createFormOptions({
  schema: z.required(ProfileUpdateSchema),
  defaultValues: {
    address: '',
    description: '',
    fullName: '',
    contacts: [] as ProfileContactType[],
  },
});
