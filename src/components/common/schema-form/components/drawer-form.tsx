import type { DrawerProps } from 'antd';
import { Button, Drawer, Flex, Form } from 'antd';
import { useState } from 'react';
import type { SchemaFormProps } from './schema-form';
import SchemaForm from './schema-form';

export interface DrawerFormProps<T extends Record<string, any> = any> extends Omit<SchemaFormProps<T>, 'title' | 'onFinish'> {
  title?: React.ReactNode;
  trigger?: React.ReactNode;
  drawerProps?: DrawerProps;
  onFinish?: (values: T) => Promise<boolean | undefined>;
  width?: number | string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function DrawerForm<T extends Record<string, any>>({
  trigger,
  onFinish,
  title,
  width,
  drawerProps,
  open: propOpen,
  onOpenChange,
  form: propForm,
  ...schemaFormProps
}: DrawerFormProps<T>) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalForm] = Form.useForm<T>();
  const form = propForm || internalForm;

  const open = propOpen !== undefined ? propOpen : internalOpen;

  const setOpen = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  const handleFinish = async (values: T) => {
    if (onFinish) {
      const res = await onFinish(values);
      if (res !== false) {
        setOpen(false);
        form.resetFields();
      }
    } else {
      setOpen(false);
    }
  };

  return (
    <>
      <button type="button" className="inline-block" onClick={() => setOpen(true)}>
        {trigger}
      </button>
      <Drawer
        title={title}
        size={+(width || 468)}
        open={open}
        onClose={() => {
          setOpen(false);
          form.resetFields();
        }}
        extra={
          <Flex gap="small">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={() => handleFinish(form.getFieldsValue())}>
              Submit
            </Button>
          </Flex>
        }
        {...drawerProps}
      >
        <SchemaForm form={form} onFinish={handleFinish} {...schemaFormProps} />
      </Drawer>
    </>
  );
}
