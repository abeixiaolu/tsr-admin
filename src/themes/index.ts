import { oneloop } from './oneloop/theme';
import type { CustomTheme } from './type';

export const CUSTOM_THEME_MAP = {
  oneloop,
};

export type ThemeKey = keyof typeof CUSTOM_THEME_MAP;

const cssModules = import.meta.glob('./**/*.scss', {
  query: '?inline',
  eager: true,
});
export function loadTheme(themeName: keyof typeof CUSTOM_THEME_MAP): CustomTheme {
  const themeContent = CUSTOM_THEME_MAP[themeName];
  if (!themeContent) {
    return {};
  }
  const existingStyleElement = document.querySelector(`style[data-theme="custom"]`);
  if (existingStyleElement) {
    existingStyleElement.remove();
  }
  if (themeContent.css) {
    if (themeContent.css.startsWith('.')) {
      const styleElement = document.createElement('style');
      styleElement.setAttribute('data-theme', 'custom');
      const module = cssModules[themeContent.css] as any;
      styleElement.textContent = module.default;
      document.head.appendChild(styleElement);
    } else {
      const styleElement = document.createElement('style');
      styleElement.setAttribute('data-theme', 'custom');
      styleElement.textContent = themeContent.css;
      document.head.appendChild(styleElement);
    }
  }
  return themeContent;
}
