import type { ModalProps } from 'antd';
import { Button, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import ErrorIcon from '@/icons/internal/error.svg?react';
import SuccessIcon from '@/icons/internal/success.svg?react';
import { cn } from '@/utils';
import Icon from '../common/icon';

export interface SuccessModalProps extends ModalProps {
  onOk: () => void;
  isSuccess?: boolean;
  reason?: string;
}
export default function SuccessModal(props: SuccessModalProps) {
  const { t } = useTranslation();
  const { onOk, isSuccess = true, reason } = props;
  const icon = isSuccess ? SuccessIcon : ErrorIcon;
  const title = isSuccess ? t('biz.successModal.successTitle') : t('biz.successModal.failureTitle');
  const description = isSuccess ? t('biz.successModal.description') : t('biz.successModal.failureDescription', { reason });
  return (
    <Modal
      centered
      width={448}
      title={t('biz.successModal.title')}
      footer={
        <Button type="primary" onClick={onOk}>
          {t('global.confirm')}
        </Button>
      }
      {...props}
    >
      <div className="flex flex-col items-center justify-center">
        <Icon name={icon} className={cn(isSuccess ? 'text-success!' : 'text-error!', 'size-56px')} />
        <h2 className="font-bold text-16px mt-3">{title}</h2>
        <p className="text-normal">{description}</p>
      </div>
    </Modal>
  );
}
