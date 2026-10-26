import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { addYears, differenceInMonths, differenceInYears, subMonths, subYears } from 'date-fns';
import { format } from 'date-fns/format';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const priceFormatter = Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  currency: 'USD',
  style: 'currency',
  currencyDisplay: 'symbol',
  useGrouping: false,
});

const dateFormatter = Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles' });

export function formatPrice(price: number): string {
  return priceFormatter.format(price);
}

export function formatDate(date: number | string | Date): string {
  try {
    return format(dateFormatter.format(new Date(date)), 'MMM dd, yyyy');
  } catch {
    return 'Invalid date';
  }
}

export function formatIsoDate(date: number | string | Date): string {
  try {
    return format(dateFormatter.format(new Date(date)), 'yyyy-MM-dd');
  } catch {
    return 'Invalid date';
  }
}

export function calculateAge(birth: string) {
  const today = new Date();

  const years = differenceInYears(today, birth);
  const months = differenceInMonths(today, addYears(birth, years));

  const text =
    years === 0 && months === 0
      ? `less than a month old`
      : years === 0
        ? `${months} months old`
        : months === 0
          ? `${years} years old`
          : `${years} years and ${months} month old`;

  return { years, months, text };
}

export function calculateIsoDateFromAge(year: number, month: number) {
  const date = subMonths(subYears(new Date(), year), month);
  return formatIsoDate(date);
}
