import type { ModalProps } from 'antd';
import { Form, Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SchemaFormProps } from './schema-form';
import SchemaForm from './schema-form';

export interface ModalFormProps<T extends Record<string, any> = any> extends Omit<SchemaFormProps<T>, 'title' | 'onFinish'> {
  title?: React.ReactNode;
  trigger?: React.ReactNode;
  modalProps?: ModalProps;
  onFinish?: (values: T) => Promise<boolean | undefined>;
  width?: number | string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  renderTop?: () => React.ReactNode;
}

export default function ModalForm<T extends Record<string, any>>({
  trigger,
  onFinish,
  title,
  width,
  modalProps,
  open: propOpen,
  onOpenChange,
  form: propForm,
  renderTop,
  ...schemaFormProps
}: ModalFormProps<T>) {
  const { t } = useTranslation();
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
      <Modal
        title={title}
        width={width}
        open={open}
        centered
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        okText={t('global.confirm')}
        onOk={() => form.submit()}
        destroyOnHidden
        {...modalProps}
      >
        {renderTop?.()}
        <SchemaForm form={form} onFinish={handleFinish} {...schemaFormProps} />
      </Modal>
    </>
  );
}
