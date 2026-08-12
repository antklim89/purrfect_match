import type { ReactNode } from 'react';
import { AlertTriangleIcon } from 'lucide-react';

import { Alert, AlertAction, AlertDescription, AlertTitle } from './alert';

export function ErrorComponent({
  title,
  message,
  status = 500,
  action,
}: {
  title?: string;
  message?: string;
  status?: number;
  action?: ReactNode;
}) {
  const titleMap = {
    500: 'Unexpected Error',
    400: 'Client Error',
    401: 'Authentication Error',
    409: 'Conflict Error',
    404: 'Not Found Error',
  } as Record<number, string>;

  return (
    <Alert className="border-red-950 dark:border-red-400 bg-destructive text-destructive-foreground">
      <AlertTriangleIcon className="size-8" />
      <AlertTitle className="text-white text-2xl">{title ?? titleMap[status] ?? titleMap[500]}</AlertTitle>
      <AlertDescription className="text-white">{message ?? 'Unexpected error. Try again later.'}</AlertDescription>
      <AlertAction className="p-2">{action}</AlertAction>
    </Alert>
  );
}
