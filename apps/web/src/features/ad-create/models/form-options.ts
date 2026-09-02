import { AdDraftSchema, AdPublishSchema } from '@purrfect_match/shared/entities/ad/schemas';
import type { AdImageType } from '@purrfect_match/shared/entities/ad/types';
import type { ContactType } from '@purrfect_match/shared/entities/contact/types';
import { formOptions, revalidateLogic } from '@tanstack/react-form';
import { z } from 'zod/v4-mini';

export const adCreateFormOptions = formOptions({
  validators: {
    onChange: z.required(AdDraftSchema),
    onSubmit: AdPublishSchema,
  },
  defaultValues: {
    name: '',
    type: '',
    breed: '',
    description: '',
    images: [] as AdImageType[],
    contacts: [] as ContactType[],
    price: 0,
  },
  validationLogic: revalidateLogic(),
  onSubmitInvalid({ formApi }) {
    console.error('Form Submit Error:\n', formApi.state.values, formApi.state.errors);
  },
});
