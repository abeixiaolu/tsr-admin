import { Badge, Popover } from 'antd';
import Icon from '@/components/common/icon';
import { useSettingStore } from '@/stores/settings';
import CollapseIcon from '~icons/internal/collapse.svg?react';
import Notification from '~icons/internal/notification.svg?react';
import Avatar from './avatar';
import Breadcrumbs from './breadcrumbs';
import ColorMode from './color-mode';
import CustomerService from './customer-service';
import HeaderBtn from './header-btn';
import LangSelector from './lang-selector';
import ThemeSelector from './theme-selector';

interface HeaderProps {
  collapsed: boolean;
  onCollapse: () => void;
}
export default function Header({ onCollapse }: HeaderProps) {
  const settings = useSettingStore((state) => state.settings);
  return (
    <div className="h-80px flex items-center justify-between bg-layout px-6 py-4 sticky top-0 z-100 inset-x-0">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button type="button" className="sm:hidden" onClick={onCollapse}>
          <Icon className="block text-20px hover:op-80 size-5" name={CollapseIcon} />
        </button>
        <Breadcrumbs />
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-4 md:flex">
          <ColorMode />
          {<ThemeSelector />}
          {settings.localeButton && <LangSelector />}
          {settings.serviceButton && <CustomerService />}
        </div>
        <div className="flex items-center md:hidden">
          <Popover
            trigger="click"
            placement="bottomRight"
            content={
              <div className="flex items-center gap-4">
                <ColorMode />
                {<ThemeSelector />}
                {settings.localeButton && <LangSelector />}
                {settings.serviceButton && <CustomerService />}
              </div>
            }
          >
            <HeaderBtn>
              <Icon name="i-lucide-more-horizontal" />
            </HeaderBtn>
          </Popover>
        </div>
        {settings.notificationsButton && (
          <HeaderBtn>
            <Badge dot offset={[-2, 3]}>
              <Icon className="size-6" name={Notification} />
            </Badge>
          </HeaderBtn>
        )}
        <Avatar />
      </div>
    </div>
  );
}
