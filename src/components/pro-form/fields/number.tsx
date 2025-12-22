import { Form, InputNumber, type InputNumberProps } from 'antd';
import type { ProFormFieldProps } from '../types';

export function ProFormNumber({ formItemProps, name, label, rules, ...fieldProps }: ProFormFieldProps<InputNumberProps>) {
  return (
    <Form.Item name={name} label={label} rules={rules} {...formItemProps}>
      <InputNumber {...fieldProps} />
    </Form.Item>
  );
}
