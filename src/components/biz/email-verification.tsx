import { useMutation } from '@tanstack/react-query';
import type { ModalProps } from 'antd';
import { Form, Input, Modal } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { COMMON_API } from '@/apis/common';
import type { OtpBizTypeEnum } from '@/apis/enum';
import { OTP_BIZ_TYPE_ENUM } from '@/apis/enum';
import { useAuthStore } from '@/stores/auth';
import storage from '@/utils/storage';
import { message } from '@/utils/toast';
import { LinkButton } from '../common/button';

interface EmailVerificationProps extends ModalProps {
  bizType?: OtpBizTypeEnum;
  onSuccess: (values: { otp: string }) => void;
}

const OTP_COUNTDOWN_SECONDS = 60;
const OTP_STORAGE_PREFIX = 'email-verification:last-sent';

function buildCountdownStorageKey(bizType: OtpBizTypeEnum, email?: string | null) {
  return `${OTP_STORAGE_PREFIX}:${bizType}:${email ?? 'unknown'}`;
}

function getRemainingCountdown(key: string) {
  if (typeof window === 'undefined') return 0;
  const lastSent = storage.getItem(key);
  if (!lastSent) return 0;
  const elapsedSeconds = Math.floor((Date.now() - Number(lastSent)) / 1000);
  if (Number.isNaN(elapsedSeconds) || elapsedSeconds >= OTP_COUNTDOWN_SECONDS) return 0;
  return OTP_COUNTDOWN_SECONDS - elapsedSeconds;
}

export default function EmailVerification({ onSuccess, bizType = OTP_BIZ_TYPE_ENUM.CHANGE_PASSWORD, ...modalProps }: EmailVerificationProps) {
  const { t } = useTranslation();
  const userInfo = useAuthStore((state) => state.userInfo);
  const countdownStorageKey = useMemo(() => buildCountdownStorageKey(bizType, userInfo?.email), [bizType, userInfo?.email]);
  const [countdown, setCountdown] = useState(() => getRemainingCountdown(countdownStorageKey));
  const [form] = Form.useForm<{ otp: string }>();
  const params = useMemo(() => ({ bizType }), [bizType]);
  const { mutateAsync: sendOtpWithUser, isPending: loading } = useMutation({
    mutationFn: COMMON_API.sendOtpWithUser,
    onSuccess: () => {
      message().success(t('biz.emailVerification.otpSent'));
      if (typeof window !== 'undefined') storage.setItem(countdownStorageKey, `${Date.now()}`);
      setCountdown(OTP_COUNTDOWN_SECONDS);
    },
  });

  useEffect(() => {
    if (!modalProps.open || countdown > 0) return;
    sendOtpWithUser(params);
  }, [modalProps.open, countdown, sendOtpWithUser, params]);

  useEffect(() => {
    const restoredCountdown = getRemainingCountdown(countdownStorageKey);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCountdown((current) => (current === restoredCountdown ? current : restoredCountdown));
  }, [countdownStorageKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  async function handleSubmit() {
    await form.validateFields();
    onSuccess({ otp: form.getFieldValue('otp') });
  }
  return (
    <Modal centered title={t('biz.emailVerification.title')} width={448} {...modalProps} onOk={handleSubmit} okText={t('global.confirm')}>
      <div className="mb-6">
        {t('biz.emailVerification.description')} {userInfo?.email}
      </div>
      <Form layout="vertical" form={form}>
        <Form.Item
          name="otp"
          rules={[
            {
              validator: (_, value) => {
                if (value && value.length === 6) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('biz.emailVerification.otpInvalid')));
              },
            },
          ]}
          label={<span className="font-medium">{t('biz.emailVerification.otpLabel')}</span>}
        >
          <Input placeholder={t('biz.emailVerification.otpPlaceholder')} />
        </Form.Item>
      </Form>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-2">
          <span>{t('biz.emailVerification.otpExpiresIn')}</span>
          {countdown > 0 ? (
            <span className="font-medium text-primary">
              {countdown}
              {t('biz.emailVerification.seconds')}
            </span>
          ) : (
            <LinkButton
              onClick={() => {
                if (loading) return;
                sendOtpWithUser(params);
                setCountdown(OTP_COUNTDOWN_SECONDS);
              }}
            >
              <span>{t('biz.emailVerification.refreshOtp')}</span>
            </LinkButton>
          )}
        </span>
      </div>
    </Modal>
  );
}
