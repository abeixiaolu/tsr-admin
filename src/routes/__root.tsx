import { ProgressProvider } from '@bprogress/react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Modal, message, notification } from 'antd';
import ConfigureApp from '~/components/layout/config';
import { setMessageApi, setModalApi, setNotificationApi } from '~/utils/toast';

const RootLayout = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [modalApi, modalContextHolder] = Modal.useModal();
  setModalApi(modalApi);
  setMessageApi(messageApi);
  setNotificationApi(notificationApi);
  return (
    <ProgressProvider>
      <ConfigureApp>
        {contextHolder}
        {notificationContextHolder}
        {modalContextHolder}
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
      </ConfigureApp>
    </ProgressProvider>
  );
};

export const Route = createRootRoute({ component: RootLayout });
