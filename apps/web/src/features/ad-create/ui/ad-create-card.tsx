'use client';

import type { ProfileType } from '@purrfect_match/shared/entities/auth/types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { createAd } from '@/shared/api/ads';
import { useAppForm } from '@/shared/lib/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { AdCreateForm } from './ad-create-form';
import { adCreateFormOptions } from '../models/form-options';

export function AdCreateCard({ profile }: { profile: ProfileType }) {
  const router = useRouter();
  const form = useAppForm({
    ...adCreateFormOptions,
    defaultValues: {
      ...adCreateFormOptions.defaultValues,
      contacts: profile.contacts || adCreateFormOptions.defaultValues.contacts,
    },
    async onSubmit({ value, formApi }) {
      toast.loading('Creating new ad...', { id: formApi.formId });

      const { images, ...input } = value;
      const { data, error } = await createAd({ input, images });
      if (error) return toast.error(error.message, { id: formApi.formId });

      formApi.reset(value);
      toast.success('Ad created successfully', { id: formApi.formId });

      router.replace(`/ad/${data.id}`);
    },
  });

  return (
    <form.AppForm>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create new ad</CardTitle>
        </CardHeader>
        <CardContent>
          <AdCreateForm />
        </CardContent>
        <CardFooter className="justify-end">
          <form.FormSubmitButton
            variant="outline"
            onClick={() => form.setFieldValue('isPublished', true)}
            className="grow"
          >
            Create And Publish
          </form.FormSubmitButton>
          <form.FormSubmitButton
            variant="default"
            onClick={() => form.setFieldValue('isPublished', false)}
            className="grow"
          >
            Create
          </form.FormSubmitButton>
        </CardFooter>
      </Card>
    </form.AppForm>
  );
}
