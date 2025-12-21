import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { RouteInfoItem } from '@/router/type';

export const LocaleMenuItem = ({ item }: { item: RouteInfoItem }) => {
  const { key, label, itemType: type } = item;
  const { t } = useTranslation();
  if (type !== 'menu') {
    return (
      <Link preload={'intent'} to={key}>
        {t(label)}
      </Link>
    );
  }
  return t(label);
};
