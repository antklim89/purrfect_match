import { UserProfileUpdateSchema } from '@purrfect_match/shared/entities/auth/schemas';
import type { UserContactType } from '@purrfect_match/shared/entities/auth/types';
import { formOptions, revalidateLogic } from '@tanstack/react-form';
import { z } from 'zod/v4-mini';

export const profileUpdateFormOptions = formOptions({
  validators: {
    onDynamic: z.required(UserProfileUpdateSchema),
  },
  defaultValues: {
    name: '',
    address: '',
    description: '',
    fullName: '',
    contacts: [] as UserContactType[],
  },
  validationLogic: revalidateLogic(),
  onSubmitInvalid({ formApi }) {
    console.error('Form Submit Error:\n', formApi.state.values, formApi.state.errors);
  },
});
