import axios from 'axios';
import i18n from '@/locales';
import type {
  CreateRequestOptions,
  MakeRequestFn,
  RequestConfig,
} from './types';
import { generateRequestKey, handleFileDownload } from './util';

export function createRequest<T>(options: CreateRequestOptions<T>) {
  const {
    baseURL,
    timeout,
    authorize,
    onUnauthorized,
    onError,
    getErrorMessage,
    transformData,
    validateResponse,
  } = options;

  const instance = axios.create({
    baseURL,
    timeout: timeout || 1000 * 60 * 3,
  });

  // 1. 处理路径参数
  instance.interceptors.request.use((config) => {
    const { args } = config as RequestConfig;
    if (args) {
      let url = config.url || '';
      Object.keys(args as any).forEach((key) => {
        url = url.replace(`{${key}}`, (args as any)[key]);
      });
      config.url = url;
    }
    return config;
  });

  // 2. 添加授权信息
  instance.interceptors.request.use(authorize);

  // 3. 处理响应
  instance.interceptors.response.use(
    (response): any => {
      const requestConfig = response.config as RequestConfig;
      const data = transformData(response.data);
      let err: any = null;

      // 处理 Blob 下载
      if (data instanceof Blob) {
        if (requestConfig.autoDownloadBlob ?? true) {
          handleFileDownload(data, response.headers).catch((err) => {
            console.error('文件下载处理失败:', err);
            onError(i18n.t('global.fileDownloadFailed'));
          });
        }
        return { data, err: null, response };
      }

      // 处理业务错误
      const { authorized, success } = validateResponse(response.data);

      if (!authorized) {
        onUnauthorized();
        err = data;
      } else if (!success) {
        onError(getErrorMessage(response.data));
        err = response.data;
      }
      return { response, data, err };
    },
    (err: any) => {
      if (err.code === 'ERR_NETWORK') {
        onError(i18n.t('global.networkError'));
      } else if (err.code !== 'ERR_CANCELED') {
        onError(i18n.t('global.serverError'));
      }
      // eslint-disable-next-line no-console
      else {
        console.log(
          `%c[PP-Request] 已取消请求: ${err.config?.url}`,
          'color: #2d7ffb',
        );
      }

      return { err, data: undefined, response: undefined } as any;
    },
  );

  const pendingPromises = new Map<string, Promise<any>>();
  const controllerMap = new Map<string, AbortController>();

  const makeRequest: MakeRequestFn = <TPayload extends APIResponse>(
    config: any,
  ) => {
    return (payload?: any, userConfig?: any) => {
      const finalConfig: any = {
        showMessage: true,
        ...config,
        ...userConfig,
      };

      // 根据HTTP方法处理参数
      if (payload) {
        if (config.method === 'get') {
          if (payload.params !== undefined) finalConfig.params = payload.params;
          if (payload.args !== undefined) finalConfig.args = payload.args;
        } else {
          if (payload.data !== undefined) finalConfig.data = payload.data;
          if (payload.args !== undefined) finalConfig.args = payload.args;
        }
      }

      const requestKey = generateRequestKey(finalConfig);

      // 策略判定
      let strategy = finalConfig.dedupeStrategy;
      if (!strategy) {
        // 默认策略：GET -> share, 其他 -> abort
        strategy = finalConfig.method === 'get' ? 'share' : 'abort';
      }

      // 1. Share 策略：复用 Promise
      if (strategy === 'share') {
        if (pendingPromises.has(requestKey)) {
          return pendingPromises.get(requestKey);
        }
      }

      // 2. Abort 策略：取消前一个
      if (strategy === 'abort') {
        if (controllerMap.has(requestKey)) {
          controllerMap.get(requestKey)?.abort();
          controllerMap.delete(requestKey);
        }
      }

      const controller = new AbortController();
      controllerMap.set(requestKey, controller);

      const promise: any = instance.request<TPayload>({
        ...finalConfig,
        signal: controller.signal,
      });

      pendingPromises.set(requestKey, promise);

      promise.finally(() => {
        pendingPromises.delete(requestKey);
        controllerMap.delete(requestKey);
      });

      promise.cancel = () => {
        controller?.abort();
        controllerMap.delete(requestKey);
        pendingPromises.delete(requestKey);
      };
      promise.key = requestKey;

      return promise;
    };
  };

  return { makeRequest, instance };
}
