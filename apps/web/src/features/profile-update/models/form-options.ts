import { ProfileUpdateSchema } from '@purrfect_match/shared/entities/auth/schema';
import type { ProfileUpdateType, UserMessengerType } from '@purrfect_match/shared/entities/auth/types';
import { toast } from 'sonner';
import { z } from 'zod/v4-mini';

import { apiClient, apiParse } from '@/shared/lib/api-client';
import { createFormOptions } from '@/shared/lib/form';

export const profileUpdateFormOptions = createFormOptions({
  schema: z.required(ProfileUpdateSchema),
  defaultValues: {
    address: '',
    description: '',
    fullName: '',
    messengers: [] as UserMessengerType[],
  },
  async onSubmit({ value, formApi }) {
    const changedValues: Partial<ProfileUpdateType> = Object.fromEntries(
      Object.entries(value).filter(([key]) => !formApi.getFieldMeta(key as keyof typeof value)?.isDefaultValue),
    );

    if (formApi.state.isPristine) return;
    toast.loading('Updating user data...', { id: formApi.formId });
    const { error } = await apiParse(apiClient.api.auth['update-profile'].$post({ json: changedValues }));

    formApi.reset(value);
    if (error) toast.success('User data update failed', { id: formApi.formId });
    toast.success('User data updated successfully', { id: formApi.formId });
  },
});
