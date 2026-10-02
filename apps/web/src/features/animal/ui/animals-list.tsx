import type { ReactNode } from 'react';

export function AnimalsList({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">{children}</div>;
}
