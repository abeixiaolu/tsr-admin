import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import { useAuthStore } from '~/stores/auth';
import getEnv from './get-env';
import { message } from './toast';

const SUCCESS_CODE = '00000000';
const AUTH_ERROR_CODES = ['60001122', '60001123', '60001118'];

function createRequestInstance(baseURL = getEnv().VITE_APP_API_URL) {
  const http = axios.create({
    baseURL,
    timeout: 60 * 1000,
  });

  http.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['fx-token'] = token;
    }
    return config;
  });

  http.interceptors.response.use(
    (response) => {
      const { respCode, respMsg } = response.data;
      if (AUTH_ERROR_CODES.includes(respCode)) {
        return Promise.reject(new Error(respMsg || 'Unauthorized'));
      }
      if (respCode !== SUCCESS_CODE) {
        message().error(respMsg || 'System Error');
        return Promise.reject(new Error(respMsg || 'Business Error'));
      }
      return response.data;
    },
    (error: AxiosError) => {
      message().error(error.message);
      return Promise.reject(error);
    },
  );
  /**
   * 定义一个 GET 请求
   * @param url 接口地址
   */
  function defineGet<Res, Params = unknown>(url: string, defineConfig?: AxiosRequestConfig) {
    return (params?: Params, config?: AxiosRequestConfig) => {
      return http.get<any, Res>(url, { ...defineConfig, params, ...config });
    };
  }

  /**
   * 定义一个 POST 请求
   * @param url 接口地址
   */
  function definePost<Res, Body = unknown>(url: string, defineConfig?: AxiosRequestConfig) {
    return (data?: Body, config?: AxiosRequestConfig) => {
      return http.post<any, Res>(url, data, { ...defineConfig, ...config });
    };
  }

  return { defineGet, definePost };
}

const { defineGet, definePost } = createRequestInstance();

export { defineGet, definePost };
