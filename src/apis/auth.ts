import { makeRequest } from '@/utils/request';
import type {
  ChangePasswordPayload,
  LoginPayload,
  LoginResponse,
  LogoutPayload,
  SendOtpWithUserPayload,
} from './apis';

export const AUTH_API = {
  resetPasswordByEmail: makeRequest<boolean, ResetPasswordByEmailPayload>({
    method: 'post',
    url: '/fx/user/login/resetPassword',
  }),
  sendOtpWithUser: makeRequest<any, SendOtpWithUserPayload>({
    method: 'post',
    url: '/fx/otp/sendWithUser',
  }),
  login: makeRequest<LoginResponse, LoginPayload>({
    method: 'post',
    url: '/fx/user/login/password',
  }),
  logout: makeRequest<any, LogoutPayload>({
    method: 'post',
    url: '/fx/user/login/logout',
  }),
  changePassword: makeRequest<any, ChangePasswordPayload>({
    method: 'post',
    url: '/fx/user/info/changePassword',
  }),
  /** 第一次设置merchant支付密码和邮箱 */
  firstSetPaymentPinAndEmail: makeRequest<
    boolean,
    FirstSetPaymentPinAndEmailPayload
  >({
    method: 'post',
    url: '/fx/payment/setting',
  }),
  /** 获取支付密码二次加密的salt */
  getPaymentPasswordSalt: makeRequest<string>({
    method: 'post',
    url: '/fx/payment/getPaymentPasswordSalt',
  }),
};

export interface ResetPasswordByEmailPayload {
  /** 账号（手机号、邮箱） */
  account: string;
  /** 账号类型 */
  accountType: number;
  /** 加密 密码 */
  password: string;
  /** 原始密码 -前端不传 */
  originalPassword?: string;
  /** 一次性密码（动态口令验证）otp */
  otp: string;
}

export interface FirstSetPaymentPinAndEmailPayload {
  /** 支付邮箱 */
  email: string;
  /** 加密后的密码 */
  passwordHash: string;
  /** 一次性密码（动态口令验证）otp */
  otp: string;
}
