import type { MessageInstance } from 'antd/es/message/interface';
import type { HookAPI } from 'antd/es/modal/useModal';
import type { NotificationInstance } from 'antd/es/notification/interface';

let _messageApi: MessageInstance;
let _notificationApi: NotificationInstance;
let _modalApi: HookAPI;
export function setMessageApi(api: MessageInstance) {
  _messageApi = api;
}

export function messageApi() {
  return _messageApi;
}

export function setNotificationApi(api: NotificationInstance) {
  _notificationApi = api;
}

export function notificationApi() {
  return _notificationApi;
}

export function setModalApi(api: HookAPI) {
  _modalApi = api;
}

export function modalApi() {
  return _modalApi;
}
