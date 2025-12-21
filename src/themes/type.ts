import type { ThemeConfig } from 'antd';

export interface CustomTheme {
  common?: ThemeConfig;
  light?: ThemeConfig;
  dark?: ThemeConfig;
  css?: string;
}
