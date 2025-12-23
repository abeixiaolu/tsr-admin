import { getRouteApi, Navigate, useNavigate } from '@tanstack/react-router';
import { Button, Form, Input } from 'antd';
import { useState } from 'react';
import { AUTH_API } from '@/apis/auth';
import loginHero from '@/assets/login-hero.png';
import logoTextDark from '@/assets/logo/dark-text.svg';
import logoIcon from '@/assets/logo/icon.svg';
import ConfigureApp from '@/components/layout/config';
import { useAuthStore } from '@/stores/auth';
import styles from '@/styles/sign-in.module.scss';
import { cn } from '@/utils';
import { encrypt } from '@/utils/encrypt';
import { message } from '@/utils/toast';

interface LoginFormData {
  account: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const redirectUrl = getRouteApi('/(auth)/sign-in').useSearch().redirectUrl;
  const { setUserInfo, setToken, token } = useAuthStore();
  const [form] = Form.useForm<LoginFormData>();
  const [loading, setLoading] = useState(false);
  const handleLogin = async ({ account, password }: LoginFormData) => {
    setLoading(true);
    AUTH_API.login({
      account,
      password: encrypt(password),
      accountType: 1,
      appCode: 'fx',
      deviceType: 'WEB',
    })
      .then((data) => {
        message().success('Login success');
        setUserInfo(data);
        setToken(data.token);
        navigate({ to: redirectUrl || '/' });
      })
      .finally(() => setLoading(false));
  };

  if (token) {
    return <Navigate replace to={redirectUrl || '/'} />;
  }

  const logo = (
    <div className="flex items-center gap-2">
      <img src={logoIcon} alt="Logo Icon" className="size-30px" />
      <img src={logoTextDark} alt="Logo Text" className="h-18px" />
    </div>
  );

  // clamp 计算公式
  // 视口范围: 800px → 2560px
  // 字体范围: 32px → 80px
  // 斜率: (80 - 32) / (2560 - 800) = 48 / 1760 ≈ 2.73vw (100-36) / (2560-800) = 0.0363636364
  // 基准值: 32 - 800 × 0.0273 ≈ 10.18px      36-800 × 0.0363636364 ≈ 6.90909088

  const footer = <div className="op-40">© 2025 ONELOOP. ALL RIGHTS RESERVED</div>;

  return (
    <ConfigureApp onlyDark>
      <div className="h-100dvh flex flex-col md:flex-row items-center justify-center bg-#020101 text-white of-hidden font-sx-pro">
        <div
          className={cn(
            'hidden md:block flex-[1.5] px-[clamp(48px,calc(-21px+8.6vw),200px)] py-[clamp(56px,calc(28px+3.6vw),120px)] h-full relative',
            styles.leftPanel,
          )}
        >
          <div className="relative z-2 h-full flex flex-col gap-[clamp(48px,calc(15px+4vw),120px)] left-content">
            <div>{logo}</div>
            <div>
              <div className="text-[clamp(32px,calc(10.18px+2.73vw),80px)] font-bold op-90 font-sx-pro-display">FX Manage System</div>
              <div className="op-60 mb-8 mt-4 text-[clamp(12px,calc(5.63px+0.8vw),20px)] max-w-[clamp(280px,calc(38px+35vw),700px)]">
                Efficient exchange and cross-border payment service capabilities to help your business development
              </div>
              <div className="max-w-[clamp(260px,calc(50px+26vw),720px)] hero-img">
                <img src={loginHero} alt="Login Hero" className={cn('w-full h-full object-contain', styles.floating)} />
              </div>
            </div>
          </div>
          <div className="absolute left-[clamp(48px,calc(-21px+8.6vw),200px)] bottom-[clamp(36px,calc(7px+3.6vw),100px)]">{footer}</div>
          <div className="absolute bottom-[clamp(36px,calc(7px+3.6vw),100px)] right-8% op-40 size-4">
            <span className="absolute w-full h-1px op-60 bg-white bottom-4px left-0"></span>
            <span className="absolute h-full w-1px op-60 bg-white top-0 right-4px"></span>
          </div>
          <div className="absolute top-0 left-0 translate-[-50%] size-[clamp(235px,calc(33px+25vw),680px)]">
            <div className={cn('w-full h-full blur-[calc(clamp(235px,calc(33px+25vw),680px)/2)] op-60 bg-#40E252 rounded-full')}></div>
          </div>
          <div className="absolute bottom-0 right-0 translate-y-[50%] size-[clamp(235px,calc(33px+25vw),680px)]">
            <div
              className={cn('w-full h-full blur-[clamp(188px,calc(27px+21vw),560px)] op-60 bg-#40E252 rounded-full')}
              style={{ animationDelay: '-4s' }}
            ></div>
          </div>
        </div>

        <div className="w-full md:w-[clamp(376px,calc(41vw+46px),1100px)] md:rounded-[48px_0_0_48px] h-full flex flex-col px-[clamp(32px,calc(-58px+11vw),230px)] items-center md:justify-center  bg-#151515 backdrop-blur-25px">
          <div className="w-full pt-[8%] md:pt-0">
            <div className="mb-48px block md:hidden">{logo}</div>
            <h1 className="mb-1 text-#40E252 text-[clamp(32px,calc(10.18px+2.73vw),80px)] font-bold font-sx-pro-display">Welcome Back !</h1>
            <p className="mb-10 text-[clamp(12px,calc(5.63px+0.8vw),26px)] op-90">Please enter your details to signin your account</p>
            <p className="mb-6 text-[clamp(20px,calc(5.63px+0.8vw),24px)] font-bold text-#40E252 font-sx-pro-display">Sign In</p>
          </div>
          <Form
            size="large"
            requiredMark={false}
            layout="vertical"
            classNames={{ label: 'font-medium' }}
            className={cn(styles.loginForm, 'w-full')}
            form={form}
            onFinish={handleLogin}
          >
            <Form.Item label={'Email'} name={'account'} rules={[{ required: true, message: 'Account is required' }]}>
              <Input className="border-transparent" placeholder="Please enter your account" />
            </Form.Item>
            <Form.Item label={'Password'} name={'password'} rules={[{ required: true, message: 'Password is required' }]}>
              <Input.Password className="border-transparent" placeholder="Please enter your password" />
            </Form.Item>
            <Form.Item>
              <Button className="h-48px rounded-3 font-bold text-16px" type="primary" htmlType="submit" size="large" block loading={loading}>
                Sign In
              </Button>
            </Form.Item>
          </Form>
          <div className="block md:hidden w-full text-center absolute bottom-4% left-1/2 -translate-x-1/2">{footer}</div>
        </div>
      </div>
    </ConfigureApp>
  );
}
