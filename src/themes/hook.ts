import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useSettingStore } from '~/stores/settings';

export type ColorMode = 'light' | 'dark' | 'auto';
export type Theme = 'light' | 'dark';
const mediaQuery = '(prefers-color-scheme: dark)';

export function useColorMode() {
  const getSystem = () => {
    return window.matchMedia(mediaQuery).matches ? 'dark' : 'light';
  };
  const setSettings = useSettingStore((state) => state.setSettings);
  const colorMode = useSettingStore((state) => state.settings.colorMode);
  const [system, setSystem] = useState<Theme>(getSystem);

  const handleChangeColorMode = (mode: ColorMode) => {
    setSettings({ colorMode: mode });
  };

  useEffect(() => {
    const mediaQueryList = window.matchMedia(mediaQuery);
    const handleChange = (e: MediaQueryListEvent) => {
      setSystem(e.matches ? 'dark' : 'light');
    };
    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, []);
  return { system, colorMode, handleChangeColorMode };
}

export function useDark() {
  const { system, colorMode, handleChangeColorMode } = useColorMode();
  const isDark =
    colorMode === 'dark' || (colorMode === 'auto' && system === 'dark');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);
  const toggleDark = async (event: MouseEvent<HTMLElement>) => {
    const setTheme = () => {
      if (colorMode === 'auto') {
        handleChangeColorMode(system === 'dark' ? 'light' : 'dark');
      } else {
        handleChangeColorMode('auto');
      }
    };
    const isAppearanceTransition = !window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (!isAppearanceTransition) {
      setTheme();
      return;
    }
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    );
    await document.startViewTransition(async () => {
      // eslint-disable-next-line react-dom/no-flush-sync
      flushSync(() => {
        setTheme();
      });
    }).ready;
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];
    // isDark is the old theme here
    document.documentElement.animate(
      {
        clipPath: !isDark ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 400,
        easing: 'ease-out',
        fill: 'forwards',
        pseudoElement: !isDark
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    );
  };
  return { isDark, toggleDark, colorMode };
}
