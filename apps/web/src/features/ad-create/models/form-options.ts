import { AdDraftSchema, AdPublishSchema } from '@purrfect_match/shared/entities/ad/schemas';
import type { AdImageType } from '@purrfect_match/shared/entities/ad/types';
import { formOptions } from '@tanstack/react-form';
import { toast } from 'sonner';
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
    price: 0,
  },
  onSubmitInvalid({ formApi }) {
    console.error('Form Submit Error:\n', formApi.state.values, formApi.state.errors);
    toast.error('Failed to create ad. Try again late.', { id: formApi.formId });
  },
});
