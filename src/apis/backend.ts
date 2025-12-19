import { makeRequest } from '@/utils/request';
import type {
  AcceptExchangePayload,
  AccountAmountPayload,
  AccountAmountResponse,
  AccountFlowPayload,
  AccountFlowResponse,
  AddBeyondBankCardPayload,
  AddBeyondBankCardResponse,
  BankListResponse,
  BeyondBankCardPagePayload,
  BeyondBankCardPageResponse,
  CommonResponse,
  CountryListItem,
  CreateMoneyOutOrderPayload,
  CreateMoneyOutOrderResponse,
  ExchangeDetailResponse,
  ExchangeOptLogPayload,
  ExchangeOptLogResponse,
  ExchangeOrderListPayload,
  ExchangeOrderListResponse,
  ExchangeStatisticResponse,
  FundHistoryPayload,
  FundHistoryResponse,
  FxEffectiveRateListResponse,
  FxRatePageResponse,
  GetBalanceListPayload,
  GetBalanceListResponse,
  GetPaymentPasswordSaltResponse,
  GlobalInfoResponse,
  PayeeAccountInfoResponse,
  PreCalculatePayload,
  PreCalculateResponse,
  RetrievePaymentPasswordPayload,
  SaveFxRatePayload,
  SetPaymentSettingPayload,
  TransferFlowExportSyncResponse,
  TransferPagePayload,
  TransferPageResponse,
  VerifyPayPayload,
  VerifyPayResponse,
} from './apis';

export const API = {
  getGlobalInfo: makeRequest<GlobalInfoResponse>({
    method: 'get',
    url: '/fx/globalInfo',
  }),
  /** 获取FX有效汇率列表 */
  getFxEffectiveRateList: makeRequest<FxEffectiveRateListResponse>({
    method: 'post',
    url: '/fx/channel/fxEffectiveRateList',
    dedupeStrategy: 'share',
  }),
  /** 获取FX交易历史 */
  getExchangeStatistic: makeRequest<ExchangeStatisticResponse>({
    method: 'get',
    url: '/fx/exchange/exchangeStatistic',
  }),
  /** 订单列表 */
  exchangeOrderList: makeRequest<
    ExchangeOrderListResponse,
    ExchangeOrderListPayload
  >({
    method: 'post',
    url: '/fx/exchange/page',
  }),
  /** 订单详情 */
  getExchangeDetail: makeRequest<
    ExchangeDetailResponse,
    { exchangeNo: string }
  >({
    method: 'post',
    url: '/fx/exchange/detail',
  }),
  acceptExchange: makeRequest<CommonResponse, AcceptExchangePayload>({
    method: 'post',
    url: '/fx/exchange/acceptExchange',
  }),
  /** 订单操作日志 */
  getExchangeOptLog: makeRequest<ExchangeOptLogResponse, ExchangeOptLogPayload>(
    {
      method: 'post',
      url: '/fx/exchange/optLog/page',
    },
  ),
  /** 查询账户余额 */
  getAccountAmount: makeRequest<AccountAmountResponse, AccountAmountPayload>({
    method: 'get',
    url: '/fx/account/detail',
  }),
  /** Get balance list */
  getBalanceList: makeRequest<GetBalanceListResponse, GetBalanceListPayload>({
    method: 'get',
    url: '/fx/account/balanceList',
  }),
  /** 查询收款账户信息 */
  getPayeeAccountInfo: makeRequest<
    PayeeAccountInfoResponse,
    AccountAmountPayload
  >({
    method: 'get',
    url: '/fx/account/getPayeeAccountInfo',
  }),
  /** 申请开通账户 */
  applyOpenAccount: makeRequest<CommonResponse, AccountAmountPayload>({
    method: 'post',
    url: '/fx/account/applyOpenAccount',
    showMessage: false,
  }),
  /** 获取资金历史 */
  getFundHistory: makeRequest<FundHistoryResponse, FundHistoryPayload>({
    method: 'post',
    url: '/fx/account/fundHistory',
    dedupeStrategy: 'share',
  }),
  /** 分页查询账务流水 */
  getAccountFlow: makeRequest<AccountFlowResponse, AccountFlowPayload>({
    method: 'post',
    url: '/fx/account/accountFlow',
  }),
  /** 获取汇率列表 */
  getFxRatePage: makeRequest<FxRatePageResponse>({
    method: 'post',
    url: '/fx/channel/fxRatePage',
    dedupeStrategy: 'share',
  }),
  /** 更改汇率 */
  saveFxRate: makeRequest<any, SaveFxRatePayload>({
    method: 'post',
    url: '/fx/channel/saveFxRate',
  }),
  /** 获取国家列表 */
  getCountryList: makeRequest<CountryListItem[]>({
    method: 'post',
    url: '/dict/area/country/list',
    // 获取境外银行开户国家列表
    data: { bizType: 2003 },
  }),
  /** 获取银行列表 */
  getBankList: makeRequest<BankListResponse, { countryCode: string }>({
    method: 'get',
    url: '/dict/bank/list',
  }),
  /** 第一次设置merchant支付密码和邮箱 */
  firstSetPayment: makeRequest<CommonResponse, SetPaymentSettingPayload>({
    method: 'post',
    url: '/fx/payment/setting',
  }),
  /** 找回支付密码 */
  retrievePaymentPassword: makeRequest<
    CommonResponse,
    RetrievePaymentPasswordPayload
  >({
    method: 'post',
    url: '/fx/payment/retrievePaymentPassword',
  }),
  /** 获取支付密码二次加密的salt */
  getPaymentPasswordSalt: makeRequest<GetPaymentPasswordSaltResponse>({
    method: 'get',
    url: '/fx/payment/getPaymentPasswordSalt',
  }),
  /** 添加国外银行卡信息 */
  addBeyondBankCard: makeRequest<
    AddBeyondBankCardResponse,
    AddBeyondBankCardPayload
  >({
    method: 'post',
    url: '/fx/bank/card/beyond/add',
  }),
  /** 分页查询国外银行卡 */
  getBeyondBankCardPage: makeRequest<
    BeyondBankCardPageResponse,
    BeyondBankCardPagePayload
  >({
    method: 'post',
    url: '/fx/bank/card/beyond/page',
  }),
  /** 出金试算 */
  preCalculate: makeRequest<PreCalculateResponse, PreCalculatePayload>({
    method: 'post',
    url: '/fx/trade/money/out/preCalculate',
  }),
  /** 出金创建订单 */
  createMoneyOutOrder: makeRequest<
    CreateMoneyOutOrderResponse,
    CreateMoneyOutOrderPayload
  >({
    method: 'post',
    url: '/fx/trade/money/out/order/create',
  }),
  /** 出金支付校验 */
  verifyPay: makeRequest<VerifyPayResponse, VerifyPayPayload>({
    method: 'post',
    url: '/fx/trade/money/out/order/verifyPay',
  }),
  /** 分页查询转账列表 */
  getTransferPage: makeRequest<TransferPageResponse, TransferPagePayload>({
    method: 'post',
    url: '/fx/transfer/page',
  }),
  /** 同步导出转账单流水 */
  transferFlowExportSync: makeRequest<
    TransferFlowExportSyncResponse,
    TransferPagePayload
  >({
    method: 'post',
    url: '/fx/transfer/flow/export/sync',
  }),
};
