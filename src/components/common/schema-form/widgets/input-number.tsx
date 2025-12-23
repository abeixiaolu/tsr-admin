import type { InputNumberProps } from 'antd';
import { InputNumber } from 'antd';
import { cn } from '@/utils';

export interface InputNumberWidgetProps extends InputNumberProps {}

export default function InputNumberWidget({ className, ...props }: InputNumberWidgetProps) {
  return <InputNumber className={cn('w-full', className)} {...props} />;
}
