import businessTheme from './business/theme.json';
import oneloopTheme from './oneloop/theme.json';

export const CUSTOM_THEME_MAP = {
  oneloop: oneloopTheme,
  business: businessTheme,
};

export const themeOptions = [
  { label: 'Business', key: 'business' },
  { label: 'OneLoop', key: 'oneloop' },
];

export type ThemeKey = keyof typeof CUSTOM_THEME_MAP;

const cssModules = import.meta.glob('./**/*.scss', {
  query: '?inline',
  eager: true,
});
export function loadTheme(themeName: keyof typeof CUSTOM_THEME_MAP) {
  const themeContent: any = CUSTOM_THEME_MAP[themeName];
  console.log('themeContent: ', themeContent);
  if (!themeContent) {
    return {};
  }
  const existingStyleElement = document.querySelector(
    `style[data-theme="custom"]`,
  );
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
