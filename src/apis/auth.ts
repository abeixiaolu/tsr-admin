import { definePost } from '~/utils/request';
import type { CommonResData } from './apis';

export const AUTH_API = {
  login: definePost<LoginResponse, LoginPayload>('/fx/user/login/password'),
  logout: definePost<CommonResData, LogoutPayload>('/fx/user/login/logout'),
};

export interface LogoutPayload {
  appCode: string;
  deviceType: string;
}

export interface LoginPayload {
  account: string;
  password: string;
  accountType: number;
  appCode: string;
  deviceType: string;
}

export interface LoginResponse {
  verifyMethod: null;
  transId: null;
  userId: number;
  userStatus: null;
  account: null;
  accountType: null;
  firstName: string;
  lastName: string;
  gender: number;
  email: string;
  phoneNumber: null;
  headImgUrl: null;
  userFrom: null;
  birthday: null;
  countryCode: string;
  token: string;
  agreementVersion: null;
  gmtCreated: string;
  gmtModified: string;
  curMerchantId: null;
  roleType: null;
}
