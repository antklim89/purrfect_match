import { UserInfoUpdateSchema } from '@purrfect_match/shared/entities/auth/schema';
import type { UserMessengerType } from '@purrfect_match/shared/entities/auth/types';
import { formOptions, revalidateLogic } from '@tanstack/react-form';
import { toast } from 'sonner';

import { apiClient, apiParse } from '@/shared/lib/api-client';

export const userInfoUpdateFormOptions = formOptions({
  schema: UserInfoUpdateSchema,
  defaultValues: {
    address: '',
    description: '',
    fullName: '',
    messengers: [] as UserMessengerType[],
  },
  async onSubmit({ value, formApi }) {
    if (formApi.state.isPristine) return;
    toast.loading('Updating user data...', { id: formApi.formId });
    const { error } = await apiParse(apiClient.api.auth['update-profile'].$post({ json: value }));

    formApi.reset(value);
    if (error) toast.success('User data update failed', { id: formApi.formId });
    toast.success('User data updated successfully', { id: formApi.formId });
  },

  validators: {
    onDynamic: UserInfoUpdateSchema,
    onSubmit: UserInfoUpdateSchema,
  },
  validationLogic: revalidateLogic(),
  onSubmitInvalid({ formApi }) {
    console.error('Form Submit Error:\n', formApi.state.values, formApi.state.errors);
  },
});
