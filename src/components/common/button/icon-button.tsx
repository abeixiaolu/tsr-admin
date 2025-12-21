import type { ButtonProps } from 'antd';
import { Button } from 'antd';
import type { IconProps } from '../icon';
import Icon from '../icon';

export interface IconButtonProps extends ButtonProps {
  icon: string;
  iconProps?: Omit<IconProps, 'name'>;
}

export default function IconButton({ icon, iconProps, children, ...props }: IconButtonProps) {
  return (
    <Button {...props} icon={<Icon name={icon} {...iconProps} />}>
      {children}
    </Button>
  );
}
