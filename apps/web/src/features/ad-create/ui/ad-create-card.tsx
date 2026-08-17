'use client';

import { useRouter } from 'next/navigation';

import { useAppForm } from '@/shared/lib/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { AdCreateForm } from './ad-create-form';
import { adCreateFormOptions } from '../models/form-options';

export function AdCreateCard() {
  const router = useRouter();
  const form = useAppForm({ ...adCreateFormOptions, onSubmitMeta: { replace: router.replace } });

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
          <form.FormSubmitButton onClick={() => form.setFieldValue('isPublished', false)} className="grow">
            Create
          </form.FormSubmitButton>
        </CardFooter>
      </Card>
    </form.AppForm>
  );
}
