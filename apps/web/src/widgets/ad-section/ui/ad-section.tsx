import type { ReactNode } from 'react';

export function AdSection({
  imagesSlot,
  descriptionSlot,
  infoSlot,
}: {
  imagesSlot: ReactNode;
  infoSlot: ReactNode;
  descriptionSlot: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {imagesSlot}
      {infoSlot}
      <div className="col-span-full">
        <h3 className="text-3xl mb-2">Description</h3>
        {descriptionSlot}
      </div>
    </div>
  );
}
