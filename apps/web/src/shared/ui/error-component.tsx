import { AlertTriangleIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from './alert';

export function ErrorComponent({
  title,
  message,
  status = 500,
}: {
  title?: string;
  message?: string;
  status?: number;
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
      <AlertTriangleIcon />
      <AlertTitle className="text-white">{title ?? titleMap[status] ?? titleMap[500]}</AlertTitle>
      <AlertDescription className="text-white">{message ?? 'Unexpected error. Try again later.'}</AlertDescription>
    </Alert>
  );
}
