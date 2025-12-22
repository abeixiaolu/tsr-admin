import { Form, Input, type InputProps } from 'antd';
import type { PasswordProps, TextAreaProps } from 'antd/es/input';
import type { ProFormFieldProps } from '../types';

export function ProFormInput({ formItemProps, name, label, rules, ...fieldProps }: ProFormFieldProps<InputProps>) {
  return (
    <Form.Item name={name} label={label} rules={rules} {...formItemProps}>
      <Input {...fieldProps} />
    </Form.Item>
  );
}

export function ProFormText({ formItemProps, name, label, rules, ...fieldProps }: ProFormFieldProps<TextAreaProps>) {
  return (
    <Form.Item name={name} label={label} rules={rules} {...formItemProps}>
      <Input.TextArea {...fieldProps} />
    </Form.Item>
  );
}

export function ProFormPassword({ formItemProps, name, label, rules, ...fieldProps }: ProFormFieldProps<PasswordProps>) {
  return (
    <Form.Item name={name} label={label} rules={rules} {...formItemProps}>
      <Input.Password {...fieldProps} />
    </Form.Item>
  );
}
