import type { ReactNode } from 'react';

export function AdList({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-6">{children}</div>;
}
