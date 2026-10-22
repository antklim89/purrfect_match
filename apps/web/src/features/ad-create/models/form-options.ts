import { AdDraftSchema, AdPublishSchema } from '@purrfect_match/shared/entities/ad/schemas';
import type { AdImageType } from '@purrfect_match/shared/entities/ad/types';
import type { GenderType } from '@purrfect_match/shared/models/gender';
import { formOptions } from '@tanstack/react-form';
import { toast } from 'sonner';
import { z } from 'zod/v4-mini';

export const adCreateFormOptions = formOptions({
  validators: {
    onChange: z.required(z.extend(AdDraftSchema, { type: z.string() })),
    onSubmit: z.extend(AdPublishSchema, { type: z.string() }),
  },
  defaultValues: {
    name: '',
    type: '',
    breedName: '',
    description: '',
    gender: 'male' as GenderType,
    birth: '',
    images: [] as AdImageType[],
    price: 0,
  },
  onSubmitInvalid({ formApi }) {
    console.error('Form Submit Error:\n', formApi.state.values, formApi.state.errors);
    toast.error('Failed to create ad. Try again late.', { id: formApi.formId });
  },
});
