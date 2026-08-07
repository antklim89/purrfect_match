'use client';
import type { ProfileType } from '@purrfect_match/shared/entities/auth/types';

import { useAppForm } from '@/shared/lib/form';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { UserInfoUpdateForm } from './user-info-update-form';
import { userInfoUpdateFormOptions } from '../models/form-options';

export function UserInfoUpdateCard({ user }: { user: ProfileType }) {
  const form = useAppForm({
    ...userInfoUpdateFormOptions,
    defaultValues: {
      address: user.address ?? userInfoUpdateFormOptions.defaultValues.address,
      description: user.description ?? userInfoUpdateFormOptions.defaultValues.description,
      fullName: user.fullName ?? userInfoUpdateFormOptions.defaultValues.fullName,
      messengers: user.messengers ?? userInfoUpdateFormOptions.defaultValues.messengers,
    },
  });

  return (
    <form.AppForm>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{user.fullName || 'User'}'s Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <UserInfoUpdateForm />
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
