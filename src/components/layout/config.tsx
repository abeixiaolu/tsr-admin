import { useProgress } from '@bprogress/react';
import { useRouterState } from '@tanstack/react-router';
import type { ThemeConfig } from 'antd';
import { App as AntdApp, theme as antdTheme, ConfigProvider, Modal, message, notification } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { merge } from 'lodash-es';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '~/hooks/is-mobile';
import { useSettingStore } from '~/stores/settings';
import { loadTheme } from '~/themes';
import { useDark } from '~/themes/hook';
import { setMessageApi, setModalApi, setNotificationApi } from '~/utils/toast';

export default function ConfigureApp({ children, onlyDark }: { children: React.ReactNode; onlyDark?: boolean }) {
  const isMobile = useIsMobile();
  const { i18n } = useTranslation();
  const antdLocale = i18n.language === 'en-US' ? enUS : zhCN;
  const { isDark } = useDark();
  const customThemeKey = useSettingStore((state) => state.settings.theme);
  const customTheme = loadTheme(customThemeKey);
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [modalApi, modalContextHolder] = Modal.useModal();
  setModalApi(modalApi);
  setMessageApi(messageApi);
  setNotificationApi(notificationApi);
  let theme: ThemeConfig = merge(
    {
      hashed: false,
      algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    } satisfies ThemeConfig,
    customTheme[isDark ? 'dark' : 'light'],
  );

  if (onlyDark) {
    theme = merge(
      {
        zeroRuntime: true,
        hashed: false,
        algorithm: antdTheme.darkAlgorithm,
      },
      customTheme.dark,
    );
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--bprogress-color', theme.token?.colorPrimary || '#000');
  }, [theme.token?.colorPrimary]);

  const progress = useProgress();
  const routerState = useRouterState();
  useEffect(() => {
    if (routerState.isLoading) {
      progress.start();
    } else {
      progress.stop();
    }
  }, [progress, routerState]);

  return (
    <ConfigProvider componentSize={isMobile ? 'middle' : 'large'} locale={antdLocale} theme={theme}>
      <AntdApp>
        {children}
        {contextHolder}
        {notificationContextHolder}
        {modalContextHolder}
      </AntdApp>
    </ConfigProvider>
  );
}
