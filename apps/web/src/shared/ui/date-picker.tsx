import { type ComponentProps, useMemo, useRef } from 'react';
import type { PopoverRoot } from '@base-ui/react';
import { CalendarIcon, XIcon } from 'lucide-react';

import { cn, formatDate, formatIsoDate } from '@/shared/lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export function DatePicker({
  value,
  onChange,
  className,
  ...props
}: ComponentProps<typeof Calendar> & { value?: string; onChange?: (date: string) => void }) {
  const popoverRef = useRef<PopoverRoot.Actions | null>(null);

  const dateValue = useMemo(() => {
    try {
      return new Date(value || Date.now());
    } catch {
      return new Date();
    }
  }, [value]);

  return (
    <Popover modal actionsRef={popoverRef}>
      <PopoverTrigger
        render={
          <Button className={cn('justify-start', className)} variant="outline" data-empty={!value}>
            {value ? formatDate(value) : <span className="text-muted-foreground">Pick a date</span>}
            <div className="grow" />
            <CalendarIcon data-icon="inline-end" />
            {value != null && value.length > 0 && (
              <Button
                data-icon="inline-end"
                variant="ghost"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange?.('');
                }}
              >
                <span className="sr-only">clear date input</span>
                <XIcon />
              </Button>
            )}
          </Button>
        }
      />
      <PopoverContent>
        <Calendar
          {...props}
          captionLayout="dropdown"
          mode="single"
          disabled={(date) => date.getTime() >= Date.now()}
          selected={dateValue}
          onSelect={(v) => {
            const date = formatIsoDate(v);
            onChange?.(date);
            popoverRef.current?.close();
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
