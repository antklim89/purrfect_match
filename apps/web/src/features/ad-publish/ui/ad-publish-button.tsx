'use client';

import { type ComponentProps, useRef, useTransition } from 'react';
import type { DialogRootActions } from '@base-ui/react';
import type { AdType } from '@purrfect_match/shared/entities/ad/types';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
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

export function AdPublishButton({
  id,
  isPublished,
  onPublish,
  ...props
}: { id: AdType['id']; isPublished: AdType['isPublished']; onPublish?: () => void } & ComponentProps<
  typeof AlertDialogTrigger
>) {
  const actionsRef = useRef<DialogRootActions | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdPublish() {
    startTransition(async () => {
      const { error } = await apiCall(apiClient.api.ad[':id'].publish.$patch({ param: { id } }));

      if (error) {
        toast.error('Failed to publish ad');
        return;
      }

      onPublish?.();
      actionsRef.current?.close();
    });
  }

  return (
    <AlertDialog actionsRef={actionsRef}>
      <AlertDialogTrigger
        nativeButton={false}
        render={
          isPublished ? (
            <Button title="Ad is published" aria-label="open publish unpublish this ad dialog">
              {isPending ? <Spinner /> : <EyeIcon />}
            </Button>
          ) : (
            <Button variant="outline" title="Ad is not published" aria-label="open publish publish this ad dialog">
              {isPending ? <Spinner /> : <EyeOffIcon />}
            </Button>
          )
        }
        {...props}
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>Are you sure you want to {isPublished ? 'unpublish' : 'publish'} this ad?</AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={handleAdPublish}
            aria-label={isPublished ? 'unpublish ad' : 'publish ad'}
          >
            {isPending ? (isPublished ? 'Unblushing...' : 'Publishing...') : isPublished ? 'Unpublish' : 'Publish'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
