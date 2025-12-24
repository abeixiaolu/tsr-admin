import { Button } from 'antd';
import { useState } from 'react';
import { OTP_BIZ_TYPE_ENUM } from '@/apis/enum';
import EmailVerification from '@/components/biz/email-verification';

export default function EmailVerificationDemo() {
  const [openEmailVerification, setOpenEmailVerification] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpenEmailVerification(true)}>Open Email Verification</Button>
      <EmailVerification
        bizType={OTP_BIZ_TYPE_ENUM.FORGET_PAYMENT_PIN}
        open={openEmailVerification}
        onCancel={() => setOpenEmailVerification(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}
