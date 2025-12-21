import { Dropdown } from 'antd';
import Icon from '@/components/common/icon';
import { useSettingStore } from '@/stores/settings';
import type { ThemeKey } from '@/themes';
import { CUSTOM_THEME_MAP } from '@/themes';
import HeaderBtn from './header-btn';

export default function ThemeSelector() {
  const theme = useSettingStore((state) => state.settings.theme);
  const setSettings = useSettingStore((state) => state.setSettings);
  return (
    <Dropdown
      menu={{
        items: Object.keys(CUSTOM_THEME_MAP).map((key) => ({ label: key, key })),
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
