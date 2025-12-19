import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useSettingStore } from '~/stores/settings';
import enUS from './en-US.json';
import zhCN from './zh-CN.json';

i18n.use(initReactI18next).init({
  lng: useSettingStore.getState().settings.lang || 'en-US',
  fallbackLng: 'en-US',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    'zh-CN': {
      translation: zhCN,
    },
    'en-US': {
      translation: enUS,
    },
  },
});

export default i18n;
