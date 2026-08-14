'use client';

import { type ComponentProps, useRef, useTransition } from 'react';
import type { DialogRootActions } from '@base-ui/react';
import type { AdType } from '@purrfect_match/shared/entities/ad/types';
import { Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { apiCall, apiClient } from '@/shared/lib/api-client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';
import { Spinner } from '@/shared/ui/spinner';

export function AdDeleteButton({
  id,
  onDelete,
  ...props
}: { id: AdType['id']; onDelete?: () => void } & ComponentProps<typeof AlertDialogTrigger>) {
  const actionsRef = useRef<DialogRootActions | null>(null);
  const [isPending, startTransition] = useTransition();
  function handleAdDelete() {
    startTransition(async () => {
      const { error } = await apiCall(apiClient.api.ad[':id'].$delete({ param: { id } }));

      if (error) {
        toast.error('Failed to delete ad');
        return;
      }

      onDelete?.();
      actionsRef.current?.close();
    });
  }

  return (
    <AlertDialog actionsRef={actionsRef}>
      <AlertDialogTrigger
        aria-label="open delete ad dialog"
        render={
          <Button variant="destructive">
            <Trash2Icon />
          </Button>
        }
        {...props}
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>Are you sure you want delete this ad?</AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={isPending} onClick={handleAdDelete} aria-label="delete ad">
            {isPending ? <Spinner /> : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
