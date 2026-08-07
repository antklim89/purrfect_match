'use client';
import type { ProfileType } from '@purrfect_match/shared/entities/auth/types';

import { useAppForm } from '@/shared/lib/form';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { ProfileUpdateForm } from './profile-update-form';
import { profileUpdateFormOptions } from '../models/form-options';

export function ProfileUpdateCard({ user }: { user: ProfileType }) {
  const form = useAppForm({
    ...profileUpdateFormOptions,
    defaultValues: {
      address: user.address ?? profileUpdateFormOptions.defaultValues.address,
      description: user.description ?? profileUpdateFormOptions.defaultValues.description,
      fullName: user.fullName ?? profileUpdateFormOptions.defaultValues.fullName,
      messengers: user.messengers ?? profileUpdateFormOptions.defaultValues.messengers,
    },
  });

  return (
    <form.AppForm>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{user.fullName || 'User'}'s Profile</CardTitle>
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
