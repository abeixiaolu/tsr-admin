import { Link, useRouterState } from '@tanstack/react-router';
import { Breadcrumb } from 'antd';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '~/hooks/is-mobile';
import { flattenRouteData } from '~/router/data';
import { findRouteAncestors } from '~/router/utils';
import BackIcon from '~icons/internal/back.svg?react';
import Icon from '../icon';

export default function Breadcrumbs() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const path = useRouterState({
    select(state) {
      return state.matches.at(-1)?.fullPath;
    },
  });
  const ancestors = findRouteAncestors(flattenRouteData, path || '').reverse();
  const shouldShowBack = ancestors.slice(0, -1).some((item) => item.type !== 'menu');
  const title = isMobile ? null : <h2 className="mt-0 text-24px font-bold lh-32px">{t(ancestors.at(-1)?.label || '')}</h2>;
  if (ancestors.length === 1) {
    return title;
  }
  const breadcrumbs = ancestors.map((match) => {
    let title: React.ReactNode = t(match.label) || '';
    if (match.key !== path && match.type !== 'menu') {
      title = <Link to={match.key}>{title}</Link>;
    }
    return {
      title,
    };
  });
  return (
    <div className="flex flex-col">
      {isMobile ? null : <Breadcrumb items={breadcrumbs} />}
      <div className="flex items-center gap-2 ">
        {shouldShowBack && (
          <button className="bg-transparent fcc hover:op-80 cursor-pointer" type="button" onClick={() => history.back()}>
            <Icon name={BackIcon} className="size-5" />
          </button>
        )}
        {title}
      </div>
    </div>
  );
}
