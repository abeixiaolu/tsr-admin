import type {
  AccessTerm,
  AccountFormType,
  BankAccountType,
  CardStatus,
  ChannelKybStatus,
  ChannelType,
  CreationSource,
  CurrencyType,
  DeclareStatus,
  DeductionType,
  OtpBizType,
  Purpose,
  PURPOSE_ENUM,
  TradeType,
  TransferStatus,
  UserType,
  VerifyMethod,
} from './enum';

export interface CommonResponse {
  result: boolean;
}

export interface PageListResponse<T> {
  totalCount: number;
  pageSize: number;
  pageIndex: number;
  list: T[];
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

export interface GlobalInfoResponse {
  fxUserId: number;
  openUsdAccount: boolean;
  havePaymentPassword: boolean;
}

export interface LogoutPayload {
  appCode: string;
  deviceType: string;
}

export interface ChangePasswordPayload {
  password: string;
  oldPassword: string;
}

export type FxEffectiveRateListResponse = FxEffectiveRateListItem[];
export interface FxEffectiveRateListItem {
  fxUserId: number;
  currencyFrom: string;
  currencyTo: string;
  rateDirection: number;
  exchangeRate: number;
  rateStatus: string;
  creatorEmail: string;
  createdTime: string;
}

export type ExchangeStatisticResponse = ExchangeStatisticItem[];
interface ExchangeStatisticItem {
  channelName: string;
  channelType: null;
  deductedOrderNum: number;
  deductedPayeeAmount: number;
}
export type ExchangeOrderListResponse = PageListResponse<ExchangeOrderListItem>;
export interface ExchangeOrderListItem {
  exchangeNo: string;
  merchantId: number;
  channelType: number;
  channelFxUserId: number;
  buyAmount: number;
  buyCurrency: string;
  sellAmount: number;
  sellCurrency: string;
  sellChannelType: number;
  smallFee: number;
  smallCurrency: string;
  deductedAmount: number;
  channelRate: number;
  exchangeStatus: number;
  moneyOutNo: string;
  moneyOutAccount: null;
  doneTime: null;
  failReason: null;
  gmtCreated: string;
  gmtModified: string;
}

export interface PageListPayload {
  pageIndex: number;
  page: number;
  pageSize: number;
}

export interface ExchangeOrderListPayload extends PageListPayload {
  exchangeNo?: string;
  buyCurrency?: string;
  exchangeStatusList?: number[];
  createStartTime?: number;
  createEndTime?: number;
}

export interface ExchangeDetailResponse {
  exchangeNo: string;
  merchantId: number;
  channelType: number;
  channelFxUserId: number;
  buyAmount: number;
  buyCurrency: CurrencyType;
  sellAmount: number;
  sellCurrency: string;
  sellChannelType: ChannelType;
  smallFee: number;
  smallCurrency: string;
  deductedAmount: number;
  channelRate: number;
  exchangeStatus: number;
  moneyOutNo: string;
  moneyOutAccount: null;
  doneTime: null;
  failReason: string;
  gmtCreated: string;
  gmtModified: string;
}

export interface ExchangeOptLogPayload extends PageListPayload {
  exchangeNo: string;
}

export type ExchangeOptLogResponse = PageListResponse<ExchangeOptLogItem>;
export interface ExchangeOptLogItem {
  optTime: number;
  beforeStatus: number;
  afterStatus: number;
  exchangeNode: number;
  optContent: string;
  detail: string;
  reason: string;
  creator: string;
}

export interface AccountAmountPayload {
  /**
   * 0 :ONELOOP
   * 1 :PALMPAY
   * 2 :PYVIO
   * 3 :FX
   * 4 :BAOFU
   * 5 :PINGAN
   */
  channelType: number;
  currencyType?: string;
}
export interface AccountAmountResponse {
  isOnline: boolean;
  isOpenMerchant: boolean;
  isOpenAccount: boolean;
  isAuthorization: boolean;
  channelKybStatus: null;
  channelKybRemark: null;
  currencyType: string;
  totalAvailable: number;
  available: number;
  unavailable: number;
  unSettledBalance: number;
  earnest: number;
  accountNo: null;
  accountId: null;
  channelAccountNo: null;
  businessName: string;
  accountEmail: string;
  provideChannel: number;
  accountForm: null;
}

export interface GetBalanceListPayload {
  /**
   * 1-palmpay
   * 4-Baofu
   * 5-PingAn
   * -1 :NONE
   * 0 :ONELOOP
   * 1 :PALMPAY
   * 2 :PYVIO
   * 3 :FX
   * 4 :BAOFU
   * 5 :PINGAN
   * 6 :VERTO
   * 7 :FINCRA
   */
  channelType?: ChannelType;
  /** Currency */
  currencyType: CurrencyType;
}

export type GetBalanceListResponse = BalanceListItem[];
export interface BalanceListItem {
  /** Whether online */
  isOnline: boolean;
  /** Whether merchant enabled */
  isOpenMerchant: boolean;
  /** Whether account enabled */
  isOpenAccount: boolean;
  /** Whether verified (non-virtual) user */
  isAuthorization: boolean;
  /** Channel KYB status */
  channelKybStatus: ChannelKybStatus;
  /** Channel KYB remark / reason */
  channelKybRemark: string;
  /** Currency */
  currencyType: CurrencyType;
  /** Total available */
  totalAvailable: number;
  /** Available balance */
  available: number;
  /** Unavailable balance */
  unavailable: number;
  /** Unsettled balance */
  unSettledBalance: number;
  /** Earnest */
  earnest: number;
  /** Account number */
  accountNo: string;
  /** Account id */
  accountId: string;
  /** Channel account number */
  channelAccountNo: string;
  /** Account name */
  businessName: string;
  /** Contact email */
  accountEmail: string;
  /** Provider channel */
  provideChannel: ChannelType;
  /** Account form */
  accountForm: AccountFormType;
}

export interface PayeeAccountInfoResponse {
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankAddress: string;
  branchCode: string;
  accountType: string;
  channelType: number;
  bankCode: string;
  swiftCode: string;
  routingNumber: string;
  rechargeNote: string;
}

export interface FundHistoryPayload extends PageListPayload {
  currencyType: string;
}
export type FundHistoryResponse = PageListResponse<FundHistoryItem>;
export interface FundHistoryItem {
  fxUserId: number;
  remitterName: string;
  remitterAccount: string;
  remitterBank: string;
  currency: string;
  amount: string;
  completionTime: string;
  note: string;
}

export interface AccountFlowPayload {
  ccy?: string;
  pageSize?: number;
  pageIndex?: number;
  /** 开始时间 */
  createStartTime?: number;
  /** 结束时间 */
  createEndTime?: number;
}
export type AccountFlowResponse = PageListResponse<AccountFlowItem>;
export interface AccountFlowItem {
  /** 账户ID */
  accountId: string;
  /** 币种 */
  ccy: string;
  /** 主流水号 */
  orgFlowNo: string;
  /** 子流水号 */
  orgSubFlowNo: string;
  /** 交易类型 */
  transTypeName: string;
  /** 交易金额 */
  amount: number;
  /** 创建时间 */
  gmtCreated: string;
  /** 修改时间 */
  gmtModified: string;
  /** 备注 */
  remark: string;
  /** 商户号 */
  merchantNo: string;
  /** 交易类型 */
  txType: string;
  /** 交易类型 */
  transType: string;
  /** 业务订单号 */
  orderNo: string;
  dcFlag: 'C' | 'D';
}

export interface AcceptExchangePayload {
  exchangeNo: string;
  accept: boolean;
  reason?: string;
  confirmInfo?: {
    sellAmount: number;
  };
}

export type FxRatePageResponse = PageListResponse<FxRatePageItem>;
export interface FxRatePageItem {
  fxUserId: number;
  currencyFrom: string;
  currencyTo: string;
  rateDirection: number;
  exchangeRate: number;
  rateStatus: string;
  creatorEmail: string;
  createdTime: string;
}

export interface SaveFxRatePayload {
  currencyFrom: string;
  currencyTo: string;
  exchangeRate: number;
  /** 1-买 2-卖 */
  rateDirection: number;
}

export interface SendOtpWithUserPayload {
  bizType: OtpBizType;
}

export interface CountryListItem {
  id: number;
  name: string;
  code: string;
  enName: string;
}

export type BankListResponse = BankListItem[];
export interface BankListItem {
  bankCode: string;
  bankName: string;
}

export interface SetPaymentSettingPayload {
  /** 支付邮箱 */
  email: string;
  /** 经过哈希加密的支付密码哈希值 */
  passwordHash: string;
  /** 验证码 */
  otp: string;
}

export interface RetrievePaymentPasswordPayload {
  /** 新密码(经过哈希加密的支付密码哈希值) */
  newPasswordHash: string;
  /** 验证码 */
  otp: string;
  email?: string;
}

export interface GetPaymentPasswordSaltResponse {
  result: string;
}

export interface AddBeyondBankCardPayload {
  id?: number;
  /** 银行卡编号-系统生成 */
  bankCardNo?: string;
  bankAccountType?: BankAccountType;
  /** 账户币种 */
  currencyType: CurrencyType;
  /** 账户名称 */
  accountName: string;
  /** 银行swift */
  bankSwift?: string;
  /** 银行地址 */
  bankAddress?: string;
  /** 欧洲国家必填，包括英国 */
  iban?: string;
  /** bsb_number */
  bsbNumber?: string;
  /** 美国银行账户必填 */
  routingNumber?: string;
  /** 银行账户号 */
  cardNo: string;
  /** 银行名称 */
  bankName: string;
  /** 常驻国家 */
  permanentCountry?: string;
  /** 账户地址国家 US、HK、NG */
  accAddrCountry: string;
  /** 收款国家 */
  payeeCountry?: string;
  /** 收款省 */
  payeeProvince?: string;
  /** 收款市 */
  payeeCity?: string;
  /** 收款邮政编码 */
  payeePostCode?: string;
  /** 账户地址详情 */
  accAddrDetail?: string;
  /** 是否同名账户 */
  isSameName?: boolean;
  /** 业务描述 */
  businessDesc?: string;
  /** 银行流水 */
  bankFlowFile?: string[];
  /** 开户信息 */
  openInfoFile?: string[];
  /** 服务协议 */
  serviceAgreementFile?: string[];
  /** 创建源 */
  creationSource?: CreationSource;
  /** 创建源userId */
  sourceUserId?: string;
  /** 创建源userName */
  sourceUserName?: string;
}

export interface AddBeyondBankCardResponse {
  result: number;
}

export interface GetOssFilePayload {
  /** 资源ID eg:1255046484550774785 */
  resourceId: string;
  /** 访问资源的终端类型 */
  accessTerm: AccessTerm;
  /** oss媒体资源处理字符串（视频截图、图片处理） */
  processString?: string;
}

export interface GetOssFileResponse {
  /** 资源id */
  resourceId: string;
  /** 资源url */
  url: string;
  /** 资源名 */
  resourceName: string;
}

export interface BeyondBankCardPagePayload {
  pageSize?: number;
  pageIndex?: number;
  id?: number;
  /** 银行卡编号 */
  bankCardNo?: string;
  cardStatusList?: CardStatus[];
  /** 银行卡状态 */
  cardStatus?: CardStatus;
  /** 账户币种 */
  currencyType?: CurrencyType;
  /** 账户名称 */
  accountName?: string;
  /** 银行swift */
  bankSwift?: string;
  /** 欧洲国家必填，包括英国 */
  iban?: string;
  /** bsb_number */
  bsbNumber?: string;
  /** 美国银行账户必填 */
  routingNumber?: string;
  /** 银行卡 */
  cardNo?: string;
  /** 银行名称 */
  bankName?: string;
  /** 是否同名账户 */
  isSameName?: boolean;
  /** 开始时间 */
  createStartTime?: number;
  /** 结束时间 */
  createEndTime?: number;
  /** 是否包含删除 */
  includeDelete?: boolean;
}

export type BeyondBankCardPageResponse = PageListResponse<BeyondBankCardItem>;

export interface BeyondBankCardItem {
  id: number;
  /** 银行卡编号 */
  bankCardNo: string;
  merchantId: number;
  /** 账户渠道类型 */
  channelType: ChannelType;
  /** 账户币种 */
  currencyType: CurrencyType;
  /** 银行账户类型 */
  bankAccountType: BankAccountType;
  /** 账户名称 */
  accountName: string;
  /** 银行swift */
  bankSwift: string;
  /** 银行地址 */
  bankAddress: string;
  /** 欧洲国家必填，包括英国 */
  iban: string;
  /** bsb_number */
  bsbNumber: string;
  /** 美国银行账户必填 */
  routingNumber: string;
  /** 银行卡 */
  cardNo: string;
  /** 银行名称 */
  bankName: string;
  /** 常驻国家 */
  permanentCountry: string;
  /** 账户地址 */
  accountAddress: string;
  /** 银行卡状态 */
  cardStatus: CardStatus;
  /** 失败原因 */
  failReason: string;
  /** 账户地址国家 */
  accAddrCountry: string;
  /** 收款国家 */
  payeeCountry: string;
  /** 收款省 */
  payeeProvince: string;
  /** 收款市 */
  payeeCity: string;
  /** 收款邮政编码 */
  payeePostCode: string;
  /** 账户地址详情 */
  accAddrDetail: string;
  /** 是否同名账户 */
  isSameName: boolean;
  /** 业务描述 */
  businessDesc: string;
  /** 银行流水 */
  bankFlowFile: string[];
  /** 开户信息 */
  openInfoFile: string[];
  /** 服务协议 */
  serviceAgreementFile: string[];
  /** 创建源 */
  creationSource: CreationSource;
  /** 创建源userId */
  sourceUserId: string;
  /** 创建源userName */
  sourceUserName: string;
  gmtCreated: string;
  isDeleted: number;
}

export interface PreCalculatePayload {
  /** 币种 */
  currencyType: string;
  /** 出款账户ID */
  accountId: number;
  /** 支付金额 */
  payAmount: number;
  /** 是否使用主体名 */
  useMainBodyName: boolean;
}

export interface PreCalculateResponse {
  /** 付款人支付金额 */
  payAmount: number;
  /** 付款人手续费 */
  fee: number;
  /** 付款人税费 */
  vat: number;
  /** 渠道服务费 */
  channelServiceFee: number;
  /** 使用主体名称fee */
  useMainBodyNameFee: number;
  /** 收款人手续费 */
  payeeFee: number;
  /** 扣款类型 DeductionTypeEnum */
  feeDeductionType: number;
  /** 收款人税费 */
  payeeVat: number;
  /** 收款人收款金额(不含fee) */
  payeeAmount: number;
}

export interface CreateMoneyOutOrderPayload {
  /** 转账类型 5-提现 7-转帐 */
  transferType: TransferType;
  /** 币种 */
  currencyType: string;
  /** 出款账户ID */
  accountId: number;
  /** 支付金额（分） */
  payAmount: number;
  /** 到账银行账户id（主键id） */
  cardId: number;
  /** 备注 */
  remark?: string;
  /** pin码 */
  pin?: string;
  /** 是否使用主体名 */
  useMainBodyName?: boolean;
  /** 用途 */
  purpose?: PURPOSE_ENUM;
  /** 合同列表 */
  contractList?: string[];
  /** 商户订单号 */
  merchantOrderNo?: string;
  /** 批量转账单号 */
  batchOrderNo?: string;
}

export interface CreateMoneyOutOrderResponse {
  /** 校验模式（1:支付PIN码  2:登陆邮件OTP 3:支付邮件OTP） */
  verifyMethod: VerifyMethod;
  /** 操作流水id */
  transId: string;
  /** 订单号 */
  transferNo: string;
  /** 交易状态（1:待支付 2:进行中 3:成功 4:失败 5:关单） */
  transferStatus: TransferStatus;
  /** 失败原因 */
  failedReason?: string;
}

export interface VerifyPayPayload {
  /** 校验模式（1:支付PIN码  2:登陆邮件OTP 3:支付邮件OTP） */
  verifyMethod: VerifyMethod;
  /** 验证码（需要加密） */
  verifyCode: string;
  /** 操作流水id */
  transId: string;
}

export interface VerifyPayResponse {
  /** 校验模式（1:支付PIN码  2:登陆邮件OTP 3:支付邮件OTP） */
  verifyMethod: VerifyMethod;
  /** 操作流水id */
  transId: string;
  /** 订单号 */
  transferNo: string;
  /** 交易状态（1:待支付 2:进行中 3:成功 4:失败 5:关单） */
  transferStatus: TransferStatus;
  /** 失败原因 */
  failedReason?: string;
}

export interface TransferPagePayload {
  pageSize?: number;
  pageIndex?: number;
  merchantIdList?: number[];
  transferNo?: string;
  transferNoList?: string[];
  thirdTransferNo?: string;
  tradeType?: TradeType;
  tradeTypeList?: TradeType[];
  currencyType?: CurrencyType;
  deductionType?: DeductionType;
  transferStatus?: TransferStatus;
  transferStatusList?: TransferStatus[];
  excludeStatusList?: TransferStatus[];
  payerAccountId?: string;
  payeeAccountNo?: string;
  bankAccountCode?: string;
  bankAccountName?: string;
  bankCode?: string;
  bankName?: string;
  createStartTime?: number;
  createEndTime?: number;
  declareStatus?: DeclareStatus;
  openMerchantOrderNo?: string;
  batchOrderNo?: string;
}

export type TransferPageResponse = PageListResponse<TransferPageItem>;

export interface TransferPageItem {
  /** 用户类型:2-商户, 4-fx\n决定MerchantId */
  userType: UserType;
  /** 商户编号 */
  merchantId: number;
  /** 商户英文名 */
  merchantEnName: string;
  /** 转账编号 */
  transferNo: string;
  /** 交易类型(1:支付  2:汇出  3:退款  4:充值  5:提现  6:代付  7:转账  8:收款入金  9:退款入金  10:换汇出金  11:保证金) */
  tradeType: TradeType;
  /** 币种（NGN、USD...） */
  currencyType: CurrencyType;
  /** 转账金额（分） */
  transferAmount: number;
  /** 手续费（分） */
  fee: number;
  /** 渠道服务费（分） */
  channelServiceFee: number;
  /** 使用主体名称费用 */
  useMainBodyNameFee: number;
  /** 税费（分） */
  vat: number;
  /** 到账金额（分） */
  receiveAmount: number;
  /** 预估到账金额（分） */
  estimatedReceiveAmount: number;
  /** 扣费类型（1:内扣  2:外扣） */
  deductionType: DeductionType;
  /** 交易状态 */
  transferStatus: TransferStatus;
  /** 转账发起时间 */
  transferStartTime: number;
  /** 转账结束时间 */
  transferDoneTime: number;
  /** 付款留言备注 */
  memo: string;
  /** 创建时间 */
  createTime: number;
  /** 更新时间 */
  updateTime: number;
  /** 用途 */
  purpose: Purpose;
  /** 关联的账户名（收款取付款方名/出金取bankCardNo） */
  relativeAccount: string;
}

export interface TransferFlowExportSyncResponse {
  /** 任务id */
  taskId: number;
  /** 文件名 */
  fileName: string;
  /** 文件url */
  fileUrl: string;
}
