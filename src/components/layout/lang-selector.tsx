import { Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSettingStore } from '~/stores/settings';
import HeaderBtn from './header-btn';

const langOptions = [
  {
    key: 'zh-CN',
    label: '中文',
    display: 'ZH',
  },
  {
    key: 'en-US',
    label: 'English',
    display: 'EN',
  },
];

export default function LangSelector() {
  const { i18n } = useTranslation();
  const setSettings = useSettingStore((state) => state.setSettings);
  function handleChangeLanguage(key: string) {
    i18n.changeLanguage(key);
    setSettings({ lang: key as 'zh-CN' | 'en-US' });
  }
  return (
    <Dropdown
      menu={{
        items: langOptions,
        selectedKeys: [i18n.language],
        onClick: (e) => handleChangeLanguage(e.key),
      }}
    >
      <HeaderBtn className="font-medium text-16px!">
        {langOptions.find((item) => item.key === i18n.language)?.display}
      </HeaderBtn>
    </Dropdown>
  );
}
