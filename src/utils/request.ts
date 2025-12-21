import axios, { type AxiosRequestConfig } from 'axios';
import { useAuthStore } from '~/stores/auth';
import getEnv from './get-env';
import { message } from './toast';

const SUCCESS_CODE = '00000000';
const AUTH_ERROR_CODES = ['60001122', '60001123', '60001118'];

function createRequest(baseURL = getEnv().VITE_APP_API_URL) {
  const http = axios.create({
    baseURL,
  });
  function request<Res, Body = unknown>(config: AxiosRequestConfig) {
    return async (data: Body) => {
      try {
        const token = useAuthStore.getState().token;
        const response = await http<APIResponse<Res>>({
          ...config,
          data: config.method === 'post' && data,
          params: config.method === 'get' && data,
          headers: {
            'fx-token': token,
          },
        });
        if (AUTH_ERROR_CODES.includes(response.data.respCode)) {
          throw new Error('Unauthorized');
        }
        if (response.data.respCode !== SUCCESS_CODE) {
          message().error(response.data.respMsg);
        }
        return response.data.data;
      } catch (error) {
        throw new Error('HTTP Error');
      }
    };
  }

  const makeRequest =
    (method: string) =>
    <Res, Body = unknown>(url: string) =>
      request<Res, Body>({ url, method });

  return {
    get: makeRequest('get'),
    post: makeRequest('post'),
  };
}

export default createRequest();
