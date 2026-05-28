'use client';

import { useTheme } from 'next-themes';
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      position="top-center"
      theme={theme as ToasterProps['theme']}
      className="toaster group select-none"
      icons={{
        success: <CircleCheckIcon className="size-6 stroke-green-600" />,
        info: <InfoIcon className="size-6" />,
        warning: <TriangleAlertIcon className="size-6 stroke-orange-600" />,
        error: <OctagonXIcon className="size-6 stroke-red-600" />,
        loading: <Loader2Icon className="size-6 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      closeButton
      swipeDirections={['top', 'right']}
      toastOptions={{
        classNames: { toast: 'cn-toast' },
      }}
      {...props}
    />
  );
};

export { Toaster };
