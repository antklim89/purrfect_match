import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
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

const dateFormatter = Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short', hour12: false });

export function formatPrice(price: number): string {
  return priceFormatter.format(price);
}

export function formatDate(date: number | string | Date): string {
  if (typeof date === 'string') {
    try {
      return dateFormatter.format(new Date(date));
    } catch {
      console.error('Failed to format date');
      return dateFormatter.format(new Date());
    }
  }
  return dateFormatter.format(date);
}
