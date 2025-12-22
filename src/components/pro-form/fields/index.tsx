import ProFormDependency from './dependency';
import { ProFormNumber } from './number';
import { ProFormSelect } from './select';
import { ProFormInput, ProFormPassword, ProFormText } from './text';

export const fieldMap = {
  text: ProFormInput,
  password: ProFormPassword,
  textarea: ProFormText,
  number: ProFormNumber,
  select: ProFormSelect,
  dependency: ProFormDependency,
} as const;

export type FieldKeys = keyof typeof fieldMap;

export { ProFormInput, ProFormPassword, ProFormText, ProFormNumber, ProFormSelect, ProFormDependency };
