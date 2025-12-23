import type { ButtonProps } from 'antd';
import { Button } from 'antd';
import { cn } from '@/utils';
import type { IconProps } from '../icon';
import Icon from '../icon';

export interface IconButtonProps extends ButtonProps {
  icon: string;
  iconProps?: Omit<IconProps, 'name'>;
}

export default function IconButton({ icon, iconProps, children, className, ...props }: IconButtonProps) {
  const iconElement = <Icon name={icon} className={cn('size-5 text-20px', className)} {...iconProps} />;
  return (
    <Button {...props} className={cn('[&_.ant-btn-icon]:(flex items-center justify-center)', className)} icon={iconElement}>
      {children}
    </Button>
  );
}
