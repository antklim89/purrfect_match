import type { Route } from 'next';
import { AdCreateSchema } from '@purrfect_match/shared/entities/ad/schemas';
import { ImagesSchema } from '@purrfect_match/shared/lib/schemas';
import { formOptions, revalidateLogic } from '@tanstack/react-form';
import { toast } from 'sonner';
import { z } from 'zod/v4-mini';

import { createAd } from '@/shared/api/ads';

export const adCreateFormOptions = formOptions({
  validators: {
    onDynamic: z.object({ ...AdCreateSchema.shape, images: ImagesSchema }),
    onSubmit: z.object({ ...AdCreateSchema.shape, images: ImagesSchema }),
  },
  validationLogic: revalidateLogic(),
  onSubmitInvalid({ formApi }) {
    console.error('Form Submit Error:\n', formApi.state.values, formApi.state.errors);
  },
  defaultValues: {
    name: 'Lorem',
    type: 'Cat',
    breed: 'Hello',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, labore?',
    images: [] as File[],
    isPublished: false,
    price: 499,
  },
  async onSubmit({ value, formApi, meta }) {
    toast.loading('Updating user data...', { id: formApi.formId });

    const { images, ...input } = value;
    const { data, error } = await createAd({ input, images });

    formApi.reset(value);
    if (error) return toast.error('User data update failed', { id: formApi.formId });
    toast.success('User data updated successfully', { id: formApi.formId });

    meta.replace(`/ad/${data.id}` as Route);
  },
  onSubmitMeta: {
    replace: (() => null) as (path: Route) => void,
  },
});
