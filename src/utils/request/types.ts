import type {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

/** 请求配置 */
export interface RequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  /**
   * 是否显示业务错误的弹窗
   * @default true
   */
  showMessage?: boolean;
  /**
   * 路径参数方式
   * @default undefined
   */
  args?: unknown;
  /**
   * 是否自动下载 blob
   * @default true
   */
  autoDownloadBlob?: boolean;
  /**
   * 请求去重策略
   * 'share' - 共享请求结果 (推荐用于GET)
   * 'abort' - 取消前一个请求 (现有逻辑)
   * 'ignore' - 允许重复请求
   * @default 'share' (GET) | 'abort' (Others) | 'ignore'
   */
  dedupeStrategy?: 'share' | 'abort' | 'ignore';
}

export interface CreateRequestOptions<TRawResponse = APIResponse> {
  baseURL: string;
  timeout?: number;
  /** 添加授权信息 */
  authorize: (
    config: InternalAxiosRequestConfig,
  ) => Promise<InternalAxiosRequestConfig>;
  /** 未授权处理 */
  onUnauthorized: () => void;
  /** 错误信息处理 */
  onError: (msg: string) => void;
  /** 校验响应是否成功 */
  validateResponse: (data: TRawResponse) => {
    authorized: boolean;
    success: boolean;
  };
  /** 获取错误信息 */
  getErrorMessage: (data: TRawResponse) => string;
  /** 提取响应数据 */
  transformData: (data: TRawResponse) => any;
}

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

/** 根据HTTP方法推导参数类型 */
type InferRequestParams<
  TMethod extends HttpMethod,
  TParams = unknown,
  TData = unknown,
  TArgs = unknown,
> = TMethod extends 'get'
  ? { params?: TParams; args?: TArgs }
  : { data?: TData; args?: TArgs };

type BaseRequestConfig<TMethod extends HttpMethod = HttpMethod> = Omit<
  RequestConfig,
  'method' | 'params' | 'data' | 'args'
> & {
  method: TMethod;
  url: string;
};

export interface CancellablePromise<T> extends Promise<T> {
  cancel: () => void;
  key: string;
}

/**
 * makeRequest 函数返回的最终结果
 * @param data 接口结果
 * @param err 如果有就说明接口报错了
 */
export interface MakeRequestRes<D = unknown, E = any> {
  data: D;
  err?: E;
  response?: AxiosResponse<D>;
}

/** 请求函数返回类型 */
type RequestFunction<
  TPayload,
  TMethod extends HttpMethod,
  TParams = unknown,
  TData = unknown,
  TArgs = unknown,
> = (
  payload?: InferRequestParams<TMethod, TParams, TData, TArgs>,
  config?: Partial<BaseRequestConfig<TMethod>>,
) => CancellablePromise<MakeRequestRes<TPayload>>;

/** 统一请求配置类型 */
type UnifiedConfig<M extends HttpMethod, Input, Args> = M extends any
  ? BaseRequestConfig<M> & { args?: Args } & (M extends 'get'
        ? { params?: Input }
        : { data?: Input })
  : never;

export interface MakeRequestFn {
  <
    TPayload,
    Input = unknown,
    Args = unknown,
    TMethod extends HttpMethod = HttpMethod,
  >(
    config: UnifiedConfig<TMethod, Input, Args>,
  ): RequestFunction<
    TPayload,
    TMethod,
    TMethod extends 'get' ? Input : never,
    TMethod extends 'get' ? never : Input,
    Args
  >;
  <TPayload>(
    config: RequestConfig,
  ): (
    payload?: any,
    config?: Partial<RequestConfig>,
  ) => Promise<MakeRequestRes<TPayload>>;
}

/** 自动计算路径参数 */
type GetUnionArgs<T extends string | undefined> =
  T extends `${infer _L}{${infer M}}${infer R}` ? M | GetUnionArgs<R> : never;
export type GetArgs<T extends string | undefined> = {
  [P in GetUnionArgs<T>]?: string | number;
};
