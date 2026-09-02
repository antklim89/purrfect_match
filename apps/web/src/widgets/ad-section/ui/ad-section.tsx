import type { ReactNode } from 'react';
import { AdStatus } from '@purrfect_match/shared/entities/ad/constants';
import { AlertCircleIcon } from 'lucide-react';

import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/shared/ui/alert';

export function AdSection({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>;
}

export function AdSectionContent({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

export function AdSectionDescription({ children }: { children: ReactNode }) {
  return (
    <div className="col-span-full">
      <h3 className="text-3xl mb-2">Description</h3>
      {children}
    </div>
  );
}

export function AdSectionPublishAlert({
  children,
  status,
  description,
}: {
  children: ReactNode;
  status?: AdStatus | null;
  description?: string;
}) {
  return (
    <Alert className="my-4 ">
      <AlertCircleIcon />
      <AlertTitle>{status === AdStatus.PUBLISHED ? 'Ad is published' : 'Ad is not published'}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>

      {children}
    </Alert>
  );
}

export function AdSectionPublishAlertActions({ children }: { children: ReactNode }) {
  return (
    <AlertAction className="gap-4">
      <div className="flex gap-2">{children}</div>
    </AlertAction>
  );
}
