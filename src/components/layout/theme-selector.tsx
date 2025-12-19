import { Dropdown } from 'antd';
import Icon from '@/components/icon';
import type { ThemeKey } from '@/themes';
import { themeOptions } from '@/themes';
import { useSettingStore } from '~/stores/settings';
import HeaderBtn from './header-btn';

export default function ThemeSelector() {
  const theme = useSettingStore((state) => state.settings.theme);
  const setSettings = useSettingStore((state) => state.setSettings);
  return (
    <Dropdown
      menu={{
        items: themeOptions,
        selectedKeys: [theme],
        onClick: (e) => setSettings({ theme: e.key as ThemeKey }),
      }}
    >
      <HeaderBtn>
        <Icon className="text-main" name="i-solar-pallete-2-linear" />
      </HeaderBtn>
    </Dropdown>
  );
}
