'use client';
import type { ReactNode } from 'react';
import { XIcon } from 'lucide-react';
import { parseAsString, useQueryStates } from 'nuqs';

import { Field, FieldLabel, FieldSet } from '@/shared/ui/field';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/shared/ui/input-group';

export function AdCatalogFilters({ children }: { children?: ReactNode }) {
  const [filter, setFilter] = useQueryStates({
    search: parseAsString
      .withDefault('')
      .withOptions({ limitUrlUpdates: { method: 'debounce', timeMs: 700 }, shallow: false }),
  });

  return (
    <FieldSet>
      <Field>
        <FieldLabel>Search</FieldLabel>
        <InputGroup>
          <InputGroupInput
            onChange={e => setFilter({ search: e.target.value })}
            value={filter.search}
            placeholder="Enter search term..."
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label="clear search"
              onClick={() => setFilter({ search: '' }, { limitUrlUpdates: { method: 'debounce', timeMs: 0 } })}
            >
              <XIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>

      {children}
    </FieldSet>
  );
}
