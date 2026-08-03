import type { ReactNode } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function ProfileContent({ children, title }: { children: ReactNode; title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
