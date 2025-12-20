import { useRouterState } from '@tanstack/react-router';
import { Drawer, Menu } from 'antd';
import type { MenuItemType } from 'antd/es/menu/interface';
import { useEffect, useState } from 'react';
import Icon from '@/components/icon';
import { cn } from '@/utils';
import { flattenRouteData, routeData } from '~/router/data';
import type { RouteInfoItem } from '~/router/type';
import { findRouteAncestors } from '~/router/utils';
import CollapseIcon from '~icons/internal/collapse.svg?react';
import MenuHeader from './menu-header';
import { LocaleMenuItem } from './menu-label';

interface SidebarProps {
  collapsed: boolean;
  handleCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  isMobile: boolean;
}

const generateMenus = (routes: RouteInfoItem[]): MenuItemType[] => {
  return routes
    .filter((item) => !item.hide)
    .map((item) => {
      const children = item.children?.filter((item) => !item.hide);
      return {
        ...item,
        label: <LocaleMenuItem item={item} />,
        icon: item.icon && <Icon name={item.icon} />,
        children: children?.length ? generateMenus(children) : undefined,
      };
    });
};

const menus = generateMenus(routeData);

export default function Sidebar({ collapsed, mobileOpen, setMobileOpen, isMobile, handleCollapsed }: SidebarProps) {
  const routerState = useRouterState();
  const ancestors = findRouteAncestors(flattenRouteData, routerState.matches.at(-1)?.fullPath || '');
  const selectedKeys = ancestors.map((item) => item.key);
  const defaultOpenKeys: string[] = ancestors.map((item) => item.parentKey!).filter(Boolean);
  const [openKeys, setOpenKeys] = useState(() => (collapsed ? [] : defaultOpenKeys));
  // biome-ignore lint/correctness/useExhaustiveDependencies: 点击其他项的时候会重新计算defaultOpenKeys，但是我不需要把其他的收起来。
  useEffect(() => {
    if (collapsed && !mobileOpen) {
      setOpenKeys([]);
      return;
    }
    setOpenKeys(defaultOpenKeys);
  }, [collapsed, mobileOpen]);
  const menu = (
    <Menu
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      onOpenChange={setOpenKeys}
      inlineIndent={12}
      mode="inline"
      onClick={(info: any) => {
        if (info.itemType !== 'menu') {
          setMobileOpen(false);
        }
      }}
      inlineCollapsed={!isMobile && collapsed}
      items={menus}
      classNames={{ root: 'pp-sidebar-menu' }}
    />
  );

  if (isMobile) {
    return (
      <Drawer placement="left" onClose={() => setMobileOpen(false)} open={mobileOpen} styles={{ body: { padding: 0 } }} size={256} closable={false}>
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
        <div className="pp-sidebar-menu-wrapper min-h-0 flex-1 overflow-x-hidden overflow-y-auto">{menu}</div>
        <button
          type="button"
          onClick={() => handleCollapsed(!collapsed)}
          className={cn(
            'group h-44px flex text-assist hover:text-primary cursor-pointer items-center bd-disable-t relative',
            collapsed ? 'justify-center px-0!' : '',
          )}
        >
          <Icon className={cn('absolute left-30px top-50% -translate-y-1/2 size-5', collapsed ? '' : 'rotate-180')} name={CollapseIcon} />
        </button>
      </div>
      <div className={cn('transition-width duration-200 ease-in-out', collapsed ? 'w-[80px]' : 'w-[256px]')}></div>
    </>
  );
}
