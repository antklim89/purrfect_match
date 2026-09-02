'use client';

import { useTransition } from 'react';
import type { AdDraftType } from '@purrfect_match/shared/entities/ad/types';
import { SaveCheckIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { publishDraftAd, updateDraftAd } from '@/shared/api/ads';
import { useAppForm } from '@/shared/lib/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Spinner } from '@/shared/ui/spinner';
import { AdCreateForm } from './ad-create-form';
import { adCreateFormOptions } from '../models/form-options';

export function AdCreateCard({ ad }: { ad: AdDraftType }) {
  const [isSaving, startSaving] = useTransition();

  const router = useRouter();
  const form = useAppForm({
    ...adCreateFormOptions,
    defaultValues: { ...adCreateFormOptions.defaultValues, ...ad },
    listeners: {
      onChange({ formApi }) {
        startSaving(async () => {
          const { error } = await updateDraftAd({ json: formApi.state.values });
          if (error) toast.error(error.message);
        });
      },
      onChangeDebounceMs: 700,
    },
    async onSubmit({ formApi }) {
      toast.loading('Creating new ad...', { id: formApi.formId });

      const { error: updateError } = await updateDraftAd({ json: form.state.values });
      if (updateError) {
        return toast.error(updateError.message);
      }

      const { data, error } = await publishDraftAd();
      if (error) return toast.error(error.message, { id: formApi.formId });

      toast.success('Ad created successfully', { id: formApi.formId });

      router.replace(`/ad/${data.id}/publish`);
    },
  });

  return (
    <form.AppForm>
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle className="text-2xl font-bold">Create new ad</CardTitle>
          {isSaving ? <Spinner /> : <SaveCheckIcon />}
        </CardHeader>
        <CardContent>
          <AdCreateForm />
        </CardContent>
        <CardFooter className="justify-end">
          <form.FormSubmitButton className=" w-1/2">Publish</form.FormSubmitButton>
        </CardFooter>
      </Card>
    </form.AppForm>
  );
}
