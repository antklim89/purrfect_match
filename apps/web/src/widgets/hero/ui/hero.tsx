import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';

import heroImage from '@/shared/assets/hero.jpg';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

export function Hero() {
  return (
    <section className="overflow-hidden">
      <div className="container relative h-128 px-6 py-28 lg:py-20">
        <div className="relative z-10 flex max-w-2xl flex-col gap-5 px-4">
          <h1
            className={cn(
              'text-balance font-medium text-4xl text-foreground leading-tight md:text-5xl',
              'fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-100 duration-500 ease-out',
            )}
          >
            Give your pet a chance to find a loving home!
          </h1>

          <p
            className={cn(
              'text-muted-foreground text-sm tracking-wider sm:text-lg md:text-xl',
              'fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-200 duration-500 ease-out',
            )}
          >
            This is a convenient platform for placing ads for the sale of
            <br /> pets or find a fitting pet.
          </p>

          <div className="fade-in slide-in-from-bottom-10 flex w-fit animate-in items-center justify-center gap-3 fill-mode-backwards pt-2 delay-300 duration-500 ease-out">
            <Button>
              Explore Catalog <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 -mx-4 rounded-3xl p-3 lg:col-span-3">
          <div className="relative">
            <div className="absolute -inset-17 z-1 bg-radial-[at_65%_25%] from-transparent to-40% to-background" />
            <Image
              loading="eager"
              className="hidden dark:block"
              src={heroImage}
              alt="app illustration"
              width={2796}
              height={2008}
            />
            <Image
              loading="eager"
              className="dark:hidden"
              src={heroImage}
              alt="app illustration"
              width={2796}
              height={2008}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
