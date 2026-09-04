import { ProfileUpdateSchema } from '@purrfect_match/shared/entities/profile/schemas';
import type { ProfileContactType } from '@purrfect_match/shared/entities/profile/types';
import { formOptions, revalidateLogic } from '@tanstack/react-form';
import { z } from 'zod/v4-mini';

export const profileUpdateFormOptions = formOptions({
  validators: {
    onDynamic: z.required(ProfileUpdateSchema),
  },
  defaultValues: {
    address: '',
    description: '',
    fullName: '',
    contacts: [] as ProfileContactType[],
  },
  validationLogic: revalidateLogic(),
  onSubmitInvalid({ formApi }) {
    console.error('Form Submit Error:\n', formApi.state.values, formApi.state.errors);
  },
});
