import { UserUpdateSchema } from '@purrfect_match/shared/entities/user/schemas';
import type { UserContactType } from '@purrfect_match/shared/entities/user/types';
import { formOptions, revalidateLogic } from '@tanstack/react-form';
import { z } from 'zod/v4-mini';

export const profileUpdateFormOptions = formOptions({
  validators: {
    onDynamic: z.required(UserUpdateSchema),
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
