import { Form, type FormInstance } from 'antd';

interface RecursiveWatcherProps {
  names: string[];
  values: Record<string, any>;
  children: (values: any) => React.ReactNode;
  form: FormInstance;
}

export default function RecursiveWatcher({ names, values, children, form }: RecursiveWatcherProps) {
  const [currentName, ...restNames] = names;
  const currentValue = Form.useWatch(currentName, form);
  const newValues = { ...values, [currentName]: currentValue };
  if (restNames.length === 0) {
    return <>{children(newValues)}</>;
  }
  return (
    <RecursiveWatcher names={restNames} values={newValues} form={form}>
      {children}
    </RecursiveWatcher>
  );
}
