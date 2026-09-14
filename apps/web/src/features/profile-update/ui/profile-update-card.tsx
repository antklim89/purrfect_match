'use client';
import type { UserProfileType, UserUpdateType } from '@purrfect_match/shared/entities/user/types';
import { toast } from 'sonner';

import { profileUpdateMutation } from '@/shared/api/mutations/profile-mutations';
import { useAppForm } from '@/shared/lib/form';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { ProfileUpdateForm } from './profile-update-form';
import { profileUpdateFormOptions } from '../models/form-options';

export function ProfileUpdateCard({ user }: { user: UserProfileType }) {
  const form = useAppForm({
    ...profileUpdateFormOptions,
    defaultValues: {
      address: user.address,
      description: user.description,
      fullName: user.fullName,
      contacts: user.contacts,
      name: user.name,
    },
    async onSubmit({ value, formApi }) {
      const changedValues: Partial<UserUpdateType> = Object.fromEntries(
        Object.entries(value).filter(([key]) => !formApi.getFieldMeta(key as keyof typeof value)?.isDefaultValue),
      );

      if (formApi.state.isPristine) return;
      toast.loading('Updating user data...', { id: formApi.formId });
      const { error } = await profileUpdateMutation({ values: changedValues });

      formApi.reset(value);
      if (error) toast.success('User data update failed', { id: formApi.formId });
      toast.success('User data updated successfully', { id: formApi.formId });
    },
  });

  return (
    <form.AppForm>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User's Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileUpdateForm />
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant="ghost" onClick={() => form.reset()} className="grow">
            Cancel
          </Button>
          <form.FormSubmitButton className="grow">Save</form.FormSubmitButton>
        </CardFooter>
      </Card>
    </form.AppForm>
  );
}
