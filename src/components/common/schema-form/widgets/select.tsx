import type { SelectProps } from 'antd';
import { Select } from 'antd';
import SelectIcon from '@/icons/internal/widget/select.svg?react';
import { cn } from '@/utils';
import Icon from '../../icon';

export type SelectWidgetProps = SelectProps;

export default function SelectWidget(props: SelectWidgetProps) {
  return <Select {...props} className={cn('w-full', props.className)} suffixIcon={<Icon name={SelectIcon} className="size-4" />} />;
}
