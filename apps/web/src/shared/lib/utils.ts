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

const dateFormatter = Intl.DateTimeFormat('en-US', { dateStyle: 'long' });

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

export function calculateAge(birth: string) {
  const birthDate = new Date(birth);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (today.getDate() < birthDate.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    years,
    months,
    text:
      years === 0 && months === 0
        ? `less than a month old`
        : years === 0
          ? `${months} months old`
          : months === 0
            ? `${years} years old`
            : `${years} years and ${months} month old`,
  };
}
