import type { ComponentType } from 'react';
import ossUpload from '@/components/biz/oss-upload';
import type { OssUploadProps } from '@/components/biz/oss-upload/types';
import type { CurrencyInputWidgetProps } from './currency-input';
import currencyInput from './currency-input';
import type { DatePickerWidgetProps } from './date-picker';
import datePicker from './date-picker';
import type { InputWidgetProps } from './input';
import input from './input';
import type { InputNumberWidgetProps } from './input-number';
import inputNumber from './input-number';
import type { RangePickerWidgetProps } from './range-picker';
import rangePicker from './range-picker';
import type { SelectWidgetProps } from './select';
import select from './select';
import type { TextareaWidgetProps } from './textarea';
import textarea from './textarea';
import type { UploadWidgetProps } from './upload';
import upload from './upload';

export const widgets: Record<string, ComponentType<any>> = {
  input,
  select,
  textarea,
  inputNumber,
  currencyInput,
  datePicker,
  rangePicker,
  upload,
  ossUpload,
};

export interface WidgetPropsMap {
  title: unknown;
  input: InputWidgetProps;
  select: SelectWidgetProps;
  textarea: TextareaWidgetProps;
  inputNumber: InputNumberWidgetProps;
  currencyInput: CurrencyInputWidgetProps;
  datePicker: DatePickerWidgetProps;
  rangePicker: RangePickerWidgetProps;
  upload: UploadWidgetProps;
  ossUpload: OssUploadProps;
}
