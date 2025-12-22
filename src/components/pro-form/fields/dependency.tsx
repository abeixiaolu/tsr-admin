import { Form, type FormInstance } from 'antd';
import type { ReactNode } from 'react';

const RecursiveWatcher: React.FC<{
  names: any[];
  values: Record<string, any>;
  children: (values: any) => React.ReactNode;
  form: FormInstance;
}> = ({ names, values, children, form }) => {
  const [currentName, ...restNames] = names;
  const currentValue = Form.useWatch(currentName, form);

  if (names.length === 0) {
    return <>{children(values)}</>;
  }

  // 合并当前值。注意：这里每次渲染都会创建一个新对象。
  // 但因为 useWatch 只有在真正变化时才触发重渲染，所以是可以接受的。
  const newValues = { ...values, [currentName]: currentValue };

  return (
    <RecursiveWatcher names={restNames} values={newValues} form={form}>
      {children}
    </RecursiveWatcher>
  );
};

export default function ProFormDependency({ name, children }: { name: any[]; children: (values: any) => ReactNode }) {
  // 获取 form 实例
  // 注意：Form.useWatch 如果不在 Form Context 下使用需要显式传递 form 实例
  // 虽然通常都在 Context 下，但显式传递更安全，也支持多表单场景
  const form = Form.useFormInstance();

  return (
    <RecursiveWatcher names={name} values={{}} form={form}>
      {children}
    </RecursiveWatcher>
  );
}
