import type { ElementType } from 'react';
import { cn } from '@/utils';

export interface IconProps {
  name: string | ElementType;
  className?: string;
}

const defaultClass = 'size-1em align-[-0.125em]';

export default function Icon({ name, className }: IconProps) {
  if (typeof name === 'string') {
    return <div className={cn(defaultClass, className, name)} />;
  }
  const SvgIcon = name;
  return <SvgIcon className={cn(defaultClass, className)} />;
}
