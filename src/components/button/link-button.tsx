import { cn } from '@/utils';
import type { IconProps } from '../icon';
import Icon from '../icon';

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  icon?: string;
  iconProps?: Partial<IconProps>;
  position?: 'left' | 'right';
}

export default function LinkButton({ children, icon, iconProps, position = 'left', className, ...props }: LinkButtonProps) {
  const iconElement = icon ? (
    <Icon size="20px" className="transition duration-200 text-#718096 dark:text-assist group-hover:text-primary" name={icon} {...iconProps} />
  ) : null;
  return (
    <a type="link" {...props} className={cn(className, 'flex items-center gap-1 group text-normal')}>
      {position === 'left' && iconElement}
      {children}
      {position === 'right' && iconElement}
    </a>
  );
}
