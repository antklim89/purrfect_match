'use client';
import type { ReactNode } from 'react';
import type { AdDraftType } from '@purrfect_match/shared/entities/ad/types';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { AdCreateForm } from './ad-create-form';
import { useAdCreate } from '../models/use-form';

export function AdCreateCard({ ad, animalSelectSlot }: { ad: AdDraftType; animalSelectSlot: ReactNode }) {
  const form = useAdCreate({ defaultValues: ad });

  return (
    <form.AppForm>
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle className="text-2xl font-bold">Create new ad</CardTitle>
        </CardHeader>
        <CardContent>
          <AdCreateForm animalSelectSlot={animalSelectSlot} />
        </CardContent>
        <CardFooter className="justify-end">
          <form.FormSubmitButton className=" w-1/2">Publish</form.FormSubmitButton>
        </CardFooter>
      </Card>
    </form.AppForm>
  );
}
