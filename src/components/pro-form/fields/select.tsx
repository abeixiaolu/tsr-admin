import { Form, Select, type SelectProps } from 'antd';
import { useEffect, useState } from 'react';
import type { ProFormFieldProps, RemoteFieldProps } from '../types';

export function ProFormSelect({
  formItemProps,
  name,
  label,
  options,
  rules,
  request,
  ...fieldProps
}: ProFormFieldProps<SelectProps> & RemoteFieldProps) {
  console.log('fieldProps: ', fieldProps);
  const [data, setData] = useState<any[]>(options || []);
  useEffect(() => {
    if (request) {
      request().then(setData);
    }
  }, [request]);
  useEffect(() => {
    if (options) setData(options);
  }, [options]);

  return (
    <Form.Item name={name} label={label} rules={rules} {...formItemProps}>
      <Select {...fieldProps} options={data} />
    </Form.Item>
  );
}
