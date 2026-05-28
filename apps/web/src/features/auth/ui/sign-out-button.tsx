'use client';
import { type ComponentProps, useTransition } from 'react';

import { authClient } from '@/shared/lib/auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';
import { Spinner } from '@/shared/ui/spinner';

export function SignOutButton({ ...props }: ComponentProps<'button'>) {
  const [isPending, startTransition] = useTransition();
  function handleSignOut() {
    startTransition(async () => {
      await authClient.signOut();
      location.reload();
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger {...props} />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>Are you sure you want to sign out.</AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={isPending} onClick={handleSignOut}>
            {isPending ? <Spinner /> : null} Sign Out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
