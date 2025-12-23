import { DatePicker } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import DatePickerIcon from '@/icons/internal/widget/date-picker.svg?react';
import { cn } from '@/utils';
import Icon from '../../icon';

export interface RangePickerWidgetProps extends RangePickerProps {}

export default function RangePickerWidget({ className, ...props }: RangePickerWidgetProps) {
  return <DatePicker.RangePicker suffixIcon={<Icon name={DatePickerIcon} className="size-4" />} className={cn('w-full', className)} {...props} />;
}
