import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';
import DatePickerIcon from '@/icons/internal/widget/date-picker.svg?react';
import { cn } from '@/utils';
import Icon from '../../icon';

export interface DatePickerWidgetProps extends DatePickerProps {}

export default function DatePickerWidget({ className, ...props }: DatePickerWidgetProps) {
  return <DatePicker suffixIcon={<Icon name={DatePickerIcon} className="size-4" />} className={cn('w-full', className)} {...props} />;
}
