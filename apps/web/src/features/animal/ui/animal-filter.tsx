'use client';

import type { Route } from 'next';
import { animals } from '@purrfect_match/shared/entities/animal/constants';
import { BookAlertIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { createLoader, createSerializer, parseAsInteger, parseAsString } from 'nuqs/server';

import { Button } from '@/shared/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/collapsible';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/shared/ui/item';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/shared/ui/navigation-menu';

const queries = {
  type: parseAsString,
  breed: parseAsString,

  page: parseAsInteger,
};

const serialize = createSerializer(queries);
const loader = createLoader(queries);

export function AnimalFilter({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const sp = new ReadonlyURLSearchParams(searchParams as Record<string, string>);
  const queryState = loader(searchParams);

  const selectedAnimal = animals.find(
    (a) => a.name === queryState.type || a.breeds.findIndex((i) => i.name === queryState.breed) > 0,
  );
  const selectedBreed = selectedAnimal?.breeds.find((b) => b.name === queryState.breed);

  return (
    <Collapsible>
      <Item variant="muted" role="listitem">
        {selectedAnimal && (
          <CollapsibleContent
            render={
              <ItemMedia>
                <Image alt={selectedAnimal.name} src={selectedAnimal.image} width={128} height={128} />
              </ItemMedia>
            }
          />
        )}
        <ItemContent>
          <div className="flex gap-2 items-center justify-between">
            <ItemTitle className="capitalize text-2xl">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="capitalize text-lg">
                      {selectedAnimal?.name ?? 'Select Animal Type'}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <NavigationMenuLink
                        className="capitalize"
                        render={<Link href={`/ad${serialize(sp, { page: null, breed: null, type: null })}` as Route} />}
                      >
                        All
                      </NavigationMenuLink>
                      {animals.map((animal) => (
                        <NavigationMenuLink
                          className="capitalize"
                          render={
                            <Link
                              href={`/ad${serialize(sp, { page: null, breed: null, type: animal.name })}` as Route}
                            />
                          }
                          key={animal.name}
                        >
                          {animal.name}
                        </NavigationMenuLink>
                      ))}
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {selectedAnimal && (
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="capitalize text-lg">
                        {selectedBreed?.name ?? 'Select Animal Breed'}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <NavigationMenuLink
                          className="capitalize"
                          render={
                            <Link
                              href={
                                `/ad${serialize(sp, { page: null, breed: null, type: selectedAnimal.name })}` as Route
                              }
                            />
                          }
                        >
                          All
                        </NavigationMenuLink>
                        {selectedAnimal.breeds.map((breed) => (
                          <NavigationMenuLink
                            className="capitalize"
                            render={
                              <Link
                                href={
                                  `/ad${serialize(sp, { page: null, breed: breed.name, type: selectedAnimal.name })}` as Route
                                }
                              />
                            }
                            key={breed.name}
                          >
                            {breed.name}
                          </NavigationMenuLink>
                        ))}
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  )}

                  <NavigationMenuLink
                    aria-label="clear animals type and breed filters"
                    render={<Link href={`/ad${serialize(sp, { page: null, breed: null, type: null })}` as Route} />}
                  >
                    <XIcon />
                  </NavigationMenuLink>
                </NavigationMenuList>
              </NavigationMenu>
            </ItemTitle>
            <CollapsibleTrigger
              render={(props, { open }) => (
                <Button size="icon-lg" variant="ghost" {...props}>
                  {open ? <XIcon /> : <BookAlertIcon />}
                </Button>
              )}
            />
          </div>

          {selectedAnimal && <CollapsibleContent render={<p>{selectedAnimal.description}</p>} />}
          {selectedBreed && <CollapsibleContent render={<p className="border-t">{selectedBreed.description}</p>} />}
        </ItemContent>
      </Item>
    </Collapsible>
  );
}
