import type { ErrType } from '@purrfect_match/shared/lib/result';
import { AlertTriangleIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from './alert';

export function ErrorComponent({
  title,
  message,
  type = 'unexpected',
}: {
  title?: string;
  message: string;
  type?: ErrType;
}) {
  const titleMap = {
    unexpected: 'Unexpected Error',
    authentication: 'Authentication Error',
    conflict: 'Conflict Error',
    not_found: 'Not Found Error',
    validation: 'Validation Error',
  };

  return (
    <Alert className="border-red-950 dark:border-red-400 bg-destructive text-destructive-foreground">
      <AlertTriangleIcon />
      <AlertTitle className="text-white">{title ?? titleMap[type] ?? titleMap.unexpected}</AlertTitle>
      <AlertDescription className="text-white">{message}</AlertDescription>
    </Alert>
  );
}
