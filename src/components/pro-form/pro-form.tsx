import { Button, Form } from 'antd';
import type React from 'react';
import type { ProFormProps } from './types';

const ProForm = <T = any>(props: ProFormProps<T>) => {
  const { onFinish, submitter, children, ...rest } = props;
  const [form] = Form.useForm(props.form);

  const handleFinish = async (values: T) => {
    if (onFinish) {
      await onFinish(values);
    }
  };

  // 渲染底部操作按钮 (Submitter)
  // 支持自定义渲染 (render prop) 或者使用默认的提交/重置按钮
  const renderSubmitter = () => {
    if (submitter === false) return null;

    const defaultDom = [
      <Button key="reset" onClick={() => form.resetFields()} {...(typeof submitter === 'object' ? submitter.resetButtonProps : {})}>
        Reset
      </Button>,
      <Button key="submit" type="primary" htmlType="submit" {...(typeof submitter === 'object' ? submitter.submitButtonProps : {})}>
        Submit
      </Button>,
    ];

    if (typeof submitter === 'object' && submitter.render) {
      return submitter.render({ form, onSubmit: form.submit, onReset: form.resetFields }, defaultDom);
    }

    // 默认布局：提交按钮右对齐或者根据 Form Item 布局
    return (
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>{defaultDom}</div>
      </Form.Item>
    );
  };

  return (
    <Form form={form} onFinish={handleFinish} {...rest}>
      {children as any}
      {renderSubmitter()}
    </Form>
  );
};

ProForm.useForm = Form.useForm;
ProForm.Item = Form.Item;

export interface ProFormDependencyProps {
  name: any[];
  children: (values: any) => React.ReactNode;
}

export default ProForm;
