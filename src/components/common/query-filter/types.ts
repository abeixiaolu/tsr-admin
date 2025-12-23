import type { FormProps, PopoverProps } from 'antd';
import type { FieldConfig } from '../schema-form/types';

export interface QueryFilterProps<FormData = any> extends FormProps {
  config: FieldConfig<FormData>[];
  defaultCollapsed?: boolean;
  showCollapseButton?: boolean;
  minWidth?: number;
  gap?: number;
  onSearch?: (values: FormData) => void;
  onReset?: () => void;
  titleRender?: boolean | (() => React.ReactNode);
  className?: string;
  simple?: {
    btnText?: string;
    className?: string;
    popoverProps?: PopoverProps;
    render?: (props: { tags: React.ReactNode; button: React.ReactNode }) => React.ReactNode;
  };
}
