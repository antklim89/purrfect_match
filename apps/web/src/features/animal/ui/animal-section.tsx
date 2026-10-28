'use client';

import { Activity, useDeferredValue, useMemo } from 'react';
import type { AnimalType } from '@purrfect_match/shared/entities/animal/types';
import { CatIcon, SearchIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { parseAsString, useQueryState } from 'nuqs';

import { buttonVariants } from '@/shared/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/shared/ui/input-group';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from '@/shared/ui/item';

export function AnimalSection({ animal }: { animal: AnimalType }) {
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const searchedBreeds = useDeferredValue(
    useMemo(
      () => animal.breeds.filter((i) => i.name.toLowerCase().includes(search.trim().toLowerCase())),
      [animal.breeds, search],
    ),
  );

  const groupedBreeds = useDeferredValue(
    useMemo(() => Object.entries(Object.groupBy(searchedBreeds, (i) => i.name.substring(0, 1))), [searchedBreeds]),
  );

  return (
    <article>
      <Image src={animal.imageUrl} alt={animal.name} width={1280} height={1024} className="w-full h-128 object-cover" />
      <header className="flex gap-2 items-center">
        <h1 className="text-5xl mt-8 mb-4">{animal.name}</h1>
        <Link aria-label={`search for ${animal.name}`} href={`/ad?type=${animal.name}`}>
          <SearchIcon />
        </Link>
        <div className="grow" />
        <nav>
          <ul className="flex gap-2 items-center flex-wrap">
            {animal.animalNames
              .filter((i) => i !== animal.name)
              .map((animalName) => (
                <li key={animalName}>
                  <Link
                    className={buttonVariants({ variant: 'link', className: 'text-lg' })}
                    href={`/animal/${animalName}`}
                  >
                    {animalName}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </header>

      <p>{animal.description}</p>

      <div className="my-8 flex flex-col gap-4">
        <InputGroup>
          <InputGroupInput
            placeholder="Enter search term..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton onClick={() => setSearch('')}>
              <XIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <Activity>
          <div className="flex flex-col gap-8">
            {groupedBreeds.map(([letter, breeds]) => (
              <div key={letter} className="flex gap-4">
                <p className="text-2xl text-primary font-bold">{letter}</p>

                <ItemGroup>
                  {breeds?.map((breed) => (
                    <Item variant="muted" className="" key={breed.name}>
                      <ItemHeader className="text-lg">
                        <ItemTitle>{breed.name}</ItemTitle>
                      </ItemHeader>
                      <ItemContent>
                        <ItemDescription>{breed.description}</ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Link
                          aria-label={`search for ${animal.name} ${breed.name}`}
                          className={buttonVariants({ variant: 'ghost' })}
                          data-icon="inline-end"
                          href={`/ad?breed=${breed.name}&type=${animal.name}`}
                        >
                          <SearchIcon />
                        </Link>
                      </ItemActions>
                    </Item>
                  ))}
                </ItemGroup>
              </div>
            ))}
            {groupedBreeds.length === 0 && (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <CatIcon />
                  </EmptyMedia>
                  <EmptyTitle>No Animals</EmptyTitle>
                  <EmptyDescription>
                    No animals were found for search term "{search}". Try to change search term.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        </Activity>
      </div>
    </article>
  );
}
