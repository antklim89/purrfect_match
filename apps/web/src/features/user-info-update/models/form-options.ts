import { UserInfoSchema } from '@purrfect_match/shared/entities/auth/schema';
import type { UserMessengerType } from '@purrfect_match/shared/entities/auth/types';
import { toast } from 'sonner';
import { z } from 'zod/v4-mini';

import { authClient } from '@/shared/lib/auth-client';
import { createFormOptions } from '@/shared/lib/form';

export const userInfoUpdateFormOptions = createFormOptions({
  schema: z.required(UserInfoSchema),
  defaultValues: {
    name: '',
    address: '',
    description: '',
    fullName: '',
    messengers: [] as UserMessengerType[],
  },
  async onSubmit({ value, formApi }) {
    if (formApi.state.isPristine) return;
    toast.loading('Updating user data...', { id: formApi.formId });
    const { error } = await authClient.updateUser(value);

    formApi.reset(value);
    if (error) toast.success('User data update failed', { id: formApi.formId });
    toast.success('User data updated successfully', { id: formApi.formId });
  },
});
