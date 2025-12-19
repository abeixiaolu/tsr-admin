import {
  defineConfig,
  presetIcons,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';
import { presetFunctionCompletion } from 'unocss-preset-completion';

export default defineConfig({
  presets: [
    presetWind3(),
    presetFunctionCompletion({ autocompleteFunctions: ['cn'] }),
    presetIcons({ autoInstall: true }),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives({
      applyVariable: ['--at-apply', '--uno-apply', '--uno'],
    }),
  ],
  theme: {
    colors: {
      primary: 'var(--ant-color-primary)',
      warning: 'var(--ant-color-warning)',
      success: 'var(--ant-color-success)',
      'primary-hover': 'var(--ant-color-primary-hover)',
      'primary-active': 'var(--ant-color-primary-active)',
      error: 'var(--ant-color-error)',
      border: 'var(--ant-color-border)',
    },
    fontFamily: {
      palm: ['PalmPayNumber', 'system-ui', 'sans-serif'],
    },
  },
  extendTheme: (theme: any) => {
    return {
      ...theme,
      breakpoints: {
        ...theme.breakpoints,
        '3xl': '1920px',
        '4xl': '2560px',
      },
    };
  },
  shortcuts: [
    [
      /^bd-normal(-[blrt])?$/,
      ([, c]) =>
        `border-[var(--ant-color-border)] ${c ? `border${c}-1 border${c}-solid` : `border-1 border-solid`} `,
    ],
    [
      /^bd-disable(-[blrt])?$/,
      ([, c]) =>
        `border-[var(--ant-color-border-secondary)] ${c ? `border${c}-1 border${c}-solid` : `border-1 border-solid`} `,
    ],
    ['text-main', 'text-[var(--ant-color-text)]'],
    ['text-normal', 'text-[var(--ant-color-text-secondary)]'],
    ['text-assist', 'text-[var(--ant-color-text-tertiary)]'],
    ['text-disable', 'text-[var(--ant-color-text-quaternary)]'],
    ['bg-secondary', 'dark:bg-#1e1e1e bg-#ffffff'],
    ['bg-layout', 'bg-[var(--ant-color-bg-layout)]'],
    ['bg-container', 'bg-[var(--ant-color-bg-container)]'],
    ['bg-fill', 'bg-[var(--ant-color-fill)] dark:bg-#121212'],
    ['bg-success-bg', 'bg-[var(--ant-color-primary-bg)]'],
    ['animate-blink', 'animate-[blink_2s_ease-in-out_infinite]'],
    ['fcc', 'flex items-center justify-center'],
  ],
});
