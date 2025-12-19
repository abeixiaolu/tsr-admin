import type React from 'react';
import { cn } from '@/utils';

interface HeaderBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function HeaderBtn({
  ref,
  children,
  className,
  ...props
}: HeaderBtnProps & {
  ref?: React.RefObject<HTMLButtonElement | null> | null;
}) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'pp-header-btn size-48px flex items-center justify-center rounded-48px bg-secondary hover:bg-gray/25 bd-normal text-24px',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
