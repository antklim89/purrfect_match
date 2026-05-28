import type { Route } from 'next';

export const navLinks = [
  { href: '#', label: 'Features' },
  { href: '#', label: 'Blog' },
  { href: '#', label: 'About' },
  { href: '#', label: 'Contact' },
  { href: '#', label: 'License' },
  { href: '#', label: 'Privacy' },
] as const satisfies { label: string; href: Route }[];
