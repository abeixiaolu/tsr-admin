import { ProgressProvider } from '@bprogress/react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Modal, message, notification } from 'antd';
import ConfigureApp from '@/components/layout/config';
import { NotFoundError } from '@/components/layout/not-found-error';
import getEnv from '@/utils/get-env';
import { setMessageApi, setModalApi, setNotificationApi } from '@/utils/toast';

const RootLayout = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [modalApi, modalContextHolder] = Modal.useModal();
  setModalApi(modalApi);
  setMessageApi(messageApi);
  setNotificationApi(notificationApi);
  console.log('getEnv().DEV: ', getEnv().DEV);
  return (
    <ProgressProvider>
      <ConfigureApp>
        {contextHolder}
        {notificationContextHolder}
        {modalContextHolder}
        <Outlet />
        {getEnv().DEV && <TanStackRouterDevtools position="bottom-right" />}
      </ConfigureApp>
    </ProgressProvider>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundError,
});
