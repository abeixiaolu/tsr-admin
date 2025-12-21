import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ThemeKey } from '@/themes';
import type { ColorMode } from '@/themes/hook';
import getEnv from '@/utils/get-env';
import unifiedStorage from '@/utils/storage';

interface Settings {
  lang: 'zh-CN' | 'en-US';
  theme: ThemeKey;
  business?: boolean;
  localeButton?: boolean;
  serviceButton?: boolean;
  notificationsButton?: boolean;
  colorMode: ColorMode;
}
interface SettingState {
  settings: Settings;
  navigation: {
    from: string;
    to: string;
  };
  setSettings: (newSettings: Partial<Settings>) => void;
  setNavigation: (from: string, to: string) => void;
}
export const useSettingStore = create<SettingState>()(
  persist(
    (set, get) => ({
      settings: {
        lang: 'en-US',
        theme: 'oneloop',
        business: false,
        themeButton: false,
        localeButton: getEnv().VITE_I18N_ENABLED,
        serviceButton: true,
        notificationsButton: false,
        colorMode: 'auto',
      },
      navigation: {
        from: '',
        to: '',
      },
      setNavigation: (from: string, to: string) => set({ navigation: { from, to } }),
      setSettings: (newSettings: Partial<Settings>) => set({ settings: { ...get().settings, ...newSettings } }),
    }),
    {
      name: 'global',
      storage: createJSONStorage<any>(() => unifiedStorage),
    },
  ),
);
