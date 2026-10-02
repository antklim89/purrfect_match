'use client';

import { useState } from 'react';
import type { AnimalType } from '@purrfect_match/shared/entities/animal/types';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/shared/lib/utils';
import { Item, ItemContent, ItemDescription, ItemFooter, ItemMedia, ItemTitle } from '@/shared/ui/item';
import { Separator } from '@/shared/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

export function AnimalItem({ animal }: { animal: AnimalType }) {
  const [selectedBreed, setSelectedBreed] = useState<string | 'null'>('null');

  return (
    <Item variant="outline" role="listitem">
      <ItemMedia>
        <Image alt={animal.name} src={animal.image} width={128} height={128} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="capitalize text-2xl">
          <Link className={cn('capitalize text-2xl hover:underline text-primary')} href={`/ad?type=${animal.name}`}>
            {animal.name}
          </Link>
        </ItemTitle>
        <ItemDescription>{animal.description}</ItemDescription>
      </ItemContent>
      <ItemFooter>
        <Tabs value={selectedBreed} className="w-full">
          <TabsList>
            {animal.breeds.map((breed) => (
              <TabsTrigger
                onClick={() => {
                  if (breed.name === selectedBreed) setSelectedBreed('null');
                  else setSelectedBreed(breed.name);
                }}
                value={breed.name}
                key={breed.name}
              >
                {breed.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {animal.breeds.map((breed) => (
            <TabsContent value={breed.name} key={breed.name} className="p-1">
              <Separator />
              <p>{breed.description}</p>
              <div className="flex justify-end">
                <Link className="text-primary hover:underline" href={`/ad?breed=${breed.name}`}>
                  Show
                </Link>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </ItemFooter>
    </Item>
  );
}
