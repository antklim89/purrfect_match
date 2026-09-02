import type { AdDraftType } from '@purrfect_match/shared/entities/ad/types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { publishDraftAd, updateDraftAd } from '@/shared/api/ads';
import { useAppForm } from '@/shared/lib/form';
import { adCreateFormOptions } from './form-options';

export function useAdCreate({ defaultValues }: { defaultValues: AdDraftType }) {
  const router = useRouter();
  const form = useAppForm({
    ...adCreateFormOptions,
    defaultValues: { ...adCreateFormOptions.defaultValues, ...defaultValues },
    listeners: {
      async onChange({ formApi }) {
        const { error } = await updateDraftAd({ json: formApi.state.values });
        if (error) toast.error(error.message);
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

  return form;
}
