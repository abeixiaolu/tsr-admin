/** 验证码业务类型 */
export const OTP_BIZ_TYPE_ENUM = {
  REGISTER: 1001,
  LOGIN: 1002,
  CHANGE_PASSWORD: 1003,
  PALM_PAY_REGISTER: 1008,
  PALM_PAY_BIND: 1009,
  PALM_PAY_UPDATE_EMAIL: 1010,
  SET_PAYMENT_PIN: 5000,
  USE_PAYMENT_PIN: 5001,
  FORGET_PAYMENT_PIN: 5002,
  UPDATE_PAYMENT_EMAIL: 5004,
  FORGET_PAYMENT_EMAIL: 5005,
  USD_OPEN_ACCOUNT: 5009,
  RISK_OTP: 1011,
} as const;
export type OtpBizType =
  (typeof OTP_BIZ_TYPE_ENUM)[keyof typeof OTP_BIZ_TYPE_ENUM];

/** 银行账户类型 */
export const BANK_ACCOUNT_TYPE_ENUM = {
  PUBLIC: 1,
  PRIVATE: 2,
} as const;
export type BankAccountType =
  (typeof BANK_ACCOUNT_TYPE_ENUM)[keyof typeof BANK_ACCOUNT_TYPE_ENUM];

/** 货币类型 */
export const CURRENCY_TYPE_ENUM = {
  USD: 'USD',
  NGN: 'NGN',
  GHS: 'GHS',
  KES: 'KES',
  TZS: 'TZS',
  ZAR: 'ZAR',
  PKR: 'PKR',
} as const;
export type CurrencyType =
  (typeof CURRENCY_TYPE_ENUM)[keyof typeof CURRENCY_TYPE_ENUM];

/** 创建源 */
export const CREATION_SOURCE_ENUM = {
  MERCHANT_PLATFORM: 0,
  OPEN_API: 1,
  PALM_PAY: 1001,
  NEXUS_PLATFORM: 2,
} as const;
export type CreationSource =
  (typeof CREATION_SOURCE_ENUM)[keyof typeof CREATION_SOURCE_ENUM];

/** 访问资源的终端类型 */
export const ACCESS_TERM_ENUM = {
  FRONTEND: 1,
  BACKEND: 2,
} as const;
export type AccessTerm =
  (typeof ACCESS_TERM_ENUM)[keyof typeof ACCESS_TERM_ENUM];

/** 银行卡状态 */
export const CARD_STATUS_ENUM = {
  PENDING: 0,
  NORMAL: 1,
  NORMAL_ADMIN_MODIFY: 101,
  FAIL: 2,
  FREEZE: 3,
  CHANNEL_APPROVE_PENDING: 4,
  CHANNEL_FAIL: 5,
} as const;
export type CardStatus =
  (typeof CARD_STATUS_ENUM)[keyof typeof CARD_STATUS_ENUM];

/** 账户渠道类型 */
export const CHANNEL_TYPE_ENUM = {
  NONE: -1,
  ONELOOP: 0,
  PALMPAY: 1,
  PYVIO: 2,
  FX: 3,
  BAOFU: 4,
  PINGAN: 5,
  VERTO: 6,
  FINCRA: 7,
} as const;

export type ChannelType =
  (typeof CHANNEL_TYPE_ENUM)[keyof typeof CHANNEL_TYPE_ENUM];

/** Channel KYB status */
export const CHANNEL_KYB_STATUS_ENUM = {
  /** Pending submit */
  WAIT_SUBMIT: 0,
  WAIT_COMMUNICATE: 1,
  AML_APPROVE_PENDING: 9,
  PRE_APPROVE_PENDING: 10,
  APPROVE_PENDING: 20,
  CHANNEL_APPROVE_PENDING: 21,
  /** Available */
  AVAILABLE: 30,
  NORMAL_ADMIN_MODIFY: 31,
  NORMAL_ADMIN_APPROVE_PENDING: 32,
  NORMAL_ADMIN_APPROVE_REFUSE: 33,
  NORMAL_SUPPLEMENTARY_INFO_MODIFY: 34,
  NORMAL_SUPPLEMENTARY_INFO_PENDING: 35,
  NORMAL_CHANNEL_APPROVE_PENDING: 36,
  NORMAL_CHANNEL_APPROVE_REFUSE: 37,
  NORMAL_AML_APPROVE_PENDING: 38,
  /** Rejected */
  APPROVE_REFUSE: 40,
  CHANNEL_APPROVE_REFUSE: 41,
} as const;
export type ChannelKybStatus =
  (typeof CHANNEL_KYB_STATUS_ENUM)[keyof typeof CHANNEL_KYB_STATUS_ENUM];

/** Account form type */
export const ACCOUNT_FORM_TYPE_ENUM = {
  /** Oneloop account */
  ONELOOP: 1,
  /** Virtual account (1:1 mapped to external) */
  VIRTUAL: 2,
} as const;
export type AccountFormType =
  (typeof ACCOUNT_FORM_TYPE_ENUM)[keyof typeof ACCOUNT_FORM_TYPE_ENUM];

/** 用途 1:往来结算款, 2:GOODS_PAYMENT, 3:Travel_Expenses, 4:INVESTMENT_FUNDS, 5:OFFICE_EXPENSES, 6:PROJECT_PAYMENT, 7:LABOR_CHARGES_SALARY, 8:OTHERS */
export const PURPOSE_ENUM = {
  SETTLEMENT: 1,
  GOODS_PAYMENT: 2,
  TRAVEL_EXPENSES: 3,
  INVESTMENT_FUNDS: 4,
  OFFICE_EXPENSES: 5,
  PROJECT_PAYMENT: 6,
  LABOR_CHARGES_SALARY: 7,
  OTHERS: 8,
} as const;

export type Purpose = (typeof PURPOSE_ENUM)[keyof typeof PURPOSE_ENUM];

/** 转账状态 */
export const TRANSFER_STATUS_ENUM = {
  TRANSFER_PROCESSING: 2,
  TRANSFER_SUCCESS: 3,
  TRANSFER_FAILED: 4,
} as const;

export type TransferStatus =
  (typeof TRANSFER_STATUS_ENUM)[keyof typeof TRANSFER_STATUS_ENUM];

/** 校验模式 */
export const VERIFY_METHOD_ENUM = {
  /** 支付PIN码 */
  PAYMENT_PIN: 1,
  /** 登陆邮件OTP */
  LOGIN_EMAIL_OTP: 2,
  /** 支付邮件OTP */
  PAYMENT_EMAIL_OTP: 3,
} as const;

export type VerifyMethod =
  (typeof VERIFY_METHOD_ENUM)[keyof typeof VERIFY_METHOD_ENUM];

/** 转账类型 */
export const TRANSFER_TYPE_ENUM = {
  WITHDRAW: 5,
  TRANSFER: 7,
} as const;
export type TransferType =
  (typeof TRANSFER_TYPE_ENUM)[keyof typeof TRANSFER_TYPE_ENUM];

/** 交易类型 */
export const TRADE_TYPE_ENUM = {
  PAY_ORDER: 1,
  EXCHANGE: 2,
  REFUND: 3,
  RECHARGE: 4,
  WITHDRAW: 5,
  DISBURSE: 6,
  TRANSFER: 7,
  UNION_BANK_MONEY_IN: 8,
  REFUND_MONEY_IN: 9,
  EXCHANGE_MONEY_OUT: 10,
  EARNEST_MONEY_IN: 11,
} as const;
export type TradeType = (typeof TRADE_TYPE_ENUM)[keyof typeof TRADE_TYPE_ENUM];

/** 扣费类型 */
export const DEDUCTION_TYPE_ENUM = {
  INNER: 1,
  OUTER: 2,
} as const;
export type DeductionType =
  (typeof DEDUCTION_TYPE_ENUM)[keyof typeof DEDUCTION_TYPE_ENUM];

/** 申报状态 */
export const DECLARE_STATUS_ENUM = {
  PENDING: 0,
  WAIT_DECLARE: 1,
  DECLARE_DOING: 2,
  DECLARE_SUCCESS: 3,
  DECLARE_FAIL: 4,
  CANCEL: 5,
} as const;
export type DeclareStatus =
  (typeof DECLARE_STATUS_ENUM)[keyof typeof DECLARE_STATUS_ENUM];

/** 用户类型 */
export const USER_TYPE_ENUM = {
  ADMIN: 1,
  MERCHANT: 2,
  C_USER: 3,
  FX_BACKEND: 4,
} as const;
export type UserType = (typeof USER_TYPE_ENUM)[keyof typeof USER_TYPE_ENUM];
