import type { MenuProps } from 'antd';
import { Drawer, Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/icon';
import { cn } from '@/utils';
import CollapseIcon from '~icons/internal/collapse.svg?react';
import MenuHeader from './menu-header';

interface SidebarProps {
  collapsed: boolean;
  handleCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  isMobile: boolean;
}
type MenuItem = Required<MenuProps>['items'][number];

export default function Sidebar({
  collapsed,
  mobileOpen,
  setMobileOpen,
  isMobile,
  handleCollapsed,
}: SidebarProps) {
  const { t } = useTranslation();

  // const handleMenuClick: MenuProps['onClick'] = (info) => {
  //   navigate(info.key)
  //   if (isMobile) {
  //     setMobileOpen(false)
  //   }
  // }

  // const menuItems = generateMenu(routeConfig)

  const menu = (
    <Menu
      inlineIndent={12}
      mode="inline"
      inlineCollapsed={!isMobile && collapsed}
      items={[]}
      classNames={{ root: 'pp-sidebar-menu' }}
    />
  );

  if (isMobile) {
    return (
      <Drawer
        placement="left"
        onClose={() => setMobileOpen(false)}
        open={mobileOpen}
        styles={{ body: { padding: 0 } }}
        size={256}
        closable={false}
      >
        <div className="h-full flex flex-col">
          <MenuHeader collapsed={collapsed} isMobile={isMobile} />
          <div className="flex-1 overflow-y-auto">{menu}</div>
        </div>
      </Drawer>
    );
  }

  return (
    <>
      <div
        className={cn(
          'pp-sidebar transition-width duration-200 ease-in-out h-full flex flex-col fixed inset-y-0',
          'bg-[var(--ant-color-bg-container)]',
          collapsed ? 'w-[80px]' : 'w-[256px]',
        )}
      >
        <MenuHeader collapsed={collapsed} isMobile={isMobile} />
        <div className="pp-sidebar-menu-wrapper min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          {menu}
        </div>
        <button
          type="button"
          onClick={() => handleCollapsed(!collapsed)}
          className={cn(
            'group h-44px flex text-assist hover:text-primary cursor-pointer items-center bd-disable-t relative',
            collapsed ? 'justify-center px-0!' : '',
          )}
        >
          <Icon
            className={cn(
              'absolute left-30px top-50% -translate-y-1/2 size-5',
              collapsed ? '' : 'rotate-180',
            )}
            name={CollapseIcon}
          />
        </button>
      </div>
      <div
        className={cn(
          'transition-width duration-200 ease-in-out',
          collapsed ? 'w-[80px]' : 'w-[256px]',
        )}
      ></div>
    </>
  );
}
