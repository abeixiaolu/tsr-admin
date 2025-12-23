import { Input } from 'antd';
import type { CurrencyInputProps } from 'react-currency-input-field';
import { CurrencyInput } from 'react-currency-input-field';
import { cn } from '@/utils';

export interface CurrencyInputWidgetProps extends Omit<CurrencyInputProps, 'onChange'> {
  onChange?: (value?: string | number) => void;
}

export default function CurrencyInputWidget({ className, onChange, ...props }: CurrencyInputWidgetProps) {
  return <CurrencyInput customInput={Input} className={cn('w-full', className)} onValueChange={onChange} {...props} />;
}
