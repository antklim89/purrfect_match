import Link from 'next/link';

import { navLinks } from '../config/nav-links';

export function Footer() {
  return (
    <footer className="container">
      <div className="flex flex-col gap-6 py-6">
        <nav>
          <ul className="flex flex-wrap gap-4 font-medium text-muted-foreground text-sm md:gap-6">
            {navLinks.map(link => (
              <li key={link.label}>
                <Link className="hover:text-foreground" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex items-center justify-between gap-4 border-t py-4 text-muted-foreground text-sm">
        <p>&copy; 2026 Purrfect Match</p>
      </div>
    </footer>
  );
}
