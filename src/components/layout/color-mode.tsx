import MoonIcon from '@icons/internal/moon.svg?react';
import SunIcon from '@icons/internal/sun.svg?react';
import Icon from '@/components/common/icon';
import { useDark } from '@/themes/hook';
import HeaderBtn from './header-btn';

export default function ColorMode() {
  const { isDark, toggleDark } = useDark();
  return (
    <HeaderBtn onClick={(e) => toggleDark(e)}>
      <Icon className="text-main" name={isDark ? MoonIcon : SunIcon} />
    </HeaderBtn>
  );
}
