import type { Route } from 'next';
import { AdCreateSchema } from '@purrfect_match/shared/entities/ad/schemas';
import { formOptions, revalidateLogic } from '@tanstack/react-form';
import { toast } from 'sonner';

import { apiCall, apiClient } from '@/shared/lib/api-client';

export const adCreateFormOptions = formOptions({
  validators: {
    onDynamic: AdCreateSchema,
    onSubmit: AdCreateSchema,
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
    isPublished: 'false',
    price: 499,
  },
  async onSubmit({ value, formApi, meta }) {
    toast.loading('Updating user data...', { id: formApi.formId });

    const { data, error } = await apiCall(
      apiClient.api.ad.$post({
        form: { ...value, price: String(value.price) },
      }),
    );

    formApi.reset(value);
    if (error) return toast.error('User data update failed', { id: formApi.formId });
    toast.success('User data updated successfully', { id: formApi.formId });

    meta.replace(`/ad/${data.id}` as Route);
  },
  onSubmitMeta: {
    replace: (() => null) as (path: Route) => void,
  },
});
