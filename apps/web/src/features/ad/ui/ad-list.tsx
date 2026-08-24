import type { ReactNode } from 'react';

export function AdList({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-6">{children}</div>;
}
