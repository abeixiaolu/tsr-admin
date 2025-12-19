import { debounce } from 'lodash-es';
import { messageApi } from '@/utils/toast';
import getEnv from '../get-env';
import { AUTH_ERROR_CODES, SUCCESS_CODE } from './enum';
import { createRequest } from './factory';

let getToken: () => string;
let onUnauthorized: () => void;

export function setupRequest(
  tokenFactory: () => string,
  unauthorizedHandler: () => void,
) {
  getToken = tokenFactory;
  onUnauthorized = unauthorizedHandler;
}

const { VITE_APP_API_URL } = getEnv();

export const { makeRequest, instance } = createRequest<APIResponse>({
  baseURL: VITE_APP_API_URL,
  authorize: async (config) => {
    const token = getToken();
    if (token) {
      (config.headers as any)['fx-token'] = token;
    }
    return config;
  },
  onUnauthorized: debounce(() => {
    return onUnauthorized();
  }, 500),
  onError: (msg) => {
    messageApi().error(msg);
  },
  transformData: (data) => data.data,
  validateResponse: (data) => {
    let authorized = true;
    let success = true;
    if (AUTH_ERROR_CODES.includes(data.respCode)) {
      authorized = false;
    }
    if (data.respCode !== SUCCESS_CODE) {
      success = false;
    }
    return { authorized, success };
  },
  getErrorMessage: (data) => data.respMsg,
});
