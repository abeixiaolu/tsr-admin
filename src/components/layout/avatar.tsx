import { useProgress } from '@bprogress/react';
import { useNavigate } from '@tanstack/react-router';
import { Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';
import { AUTH_API } from '@/apis/auth';
import Icon from '@/components/icon';
import { useAuthStore } from '@/stores/auth';
import { useIsMobile } from '~/hooks/is-mobile';
import AvatarIcon from '~icons/internal/avatar.svg?react';
import HeaderBtn from './header-btn';

export default function AvatarActions() {
  const userInfo = useAuthStore((state) => state.userInfo);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const progress = useProgress();

  const handleLogout = async () => {
    progress.start();
    const res = await AUTH_API.logout({
      data: {
        appCode: 'fx',
        deviceType: 'WEB',
      },
    });
    progress.stop();
    if (res.err) return;
    clearAuth();
    navigate({ to: '/', replace: true });
  };

  const menuItems = [
    isMobile
      ? {
          key: 'header',
          label: (
            <span className="text-16px font-medium text-main">
              {userInfo?.email}
            </span>
          ),
          disabled: true,
        }
      : null,
    {
      key: 'logout',
      icon: <Icon name="i-solar-logout-linear" className="anticon" />,
      label: t('global.logout'),
    },
  ];

  return (
    <Dropdown
      menu={{
        items: menuItems,
        onClick: (e) => {
          if (e.key === 'logout') {
            handleLogout();
          }
        },
      }}
    >
      <HeaderBtn className="w-auto gap-3 px-3">
        <Icon name={AvatarIcon} className="size-6" />
        <span className="hidden text-16px font-medium md:block">
          {userInfo?.email || 'unknown'}
        </span>
        <Icon
          className="text-assist size-4"
          name="i-solar-alt-arrow-down-linear"
        />
      </HeaderBtn>
    </Dropdown>
  );
}
