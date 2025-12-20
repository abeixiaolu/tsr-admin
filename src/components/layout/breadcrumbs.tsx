import { Link, useRouterState } from '@tanstack/react-router';
import { Breadcrumb } from 'antd';
import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useResizeObserver } from 'usehooks-ts';
import { useIsMobile } from '~/hooks/is-mobile';
import { flattenRouteData } from '~/router/data';
import type { RouteInfoItem } from '~/router/type';
import { findRouteAncestors } from '~/router/utils';
import BackIcon from '~icons/internal/back.svg?react';
import Icon from '../icon';

export default function Breadcrumbs() {
  const probeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const path = useRouterState({
    select(state) {
      return state.matches.at(-1)?.fullPath;
    },
  });
  const ancestors = findRouteAncestors(flattenRouteData, path || '').reverse();
  const totalCount = ancestors.length;
  const [showCount, setShowCount] = useState(() => totalCount);
  const isSingle = totalCount <= 1;
  const shouldShowBack = ancestors.slice(0, -1).some((item) => item.itemType !== 'menu');
  const title = isMobile ? null : <h2 className="mt-0 text-24px font-bold lh-32px flex-1 min-w-0 truncate">{t(ancestors.at(-1)?.label || '')}</h2>;
  const generateItem = (match: RouteInfoItem) => {
    let title: React.ReactNode = t(match.label) || '';
    if (match.key !== path && match.itemType !== 'menu') {
      title = <Link to={match.key}>{title}</Link>;
    }
    return {
      title,
    };
  };
  const visibleItems = ancestors.slice(0, showCount).map(generateItem);
  const allItems = ancestors.slice(0, showCount + 1).map(generateItem);
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useResizeObserver({
    ref: containerRef as any,
    box: 'border-box',
  });
  useLayoutEffect(() => {
    setShowCount(totalCount);
  }, [totalCount]);
  useLayoutEffect(() => {
    if (isSingle) return;
    if (!containerRef.current || !contentRef.current || !probeRef.current) return;
    if (!containerWidth || containerWidth === 0) return;
    const probeWidth = probeRef.current.scrollWidth;
    const contentWidth = contentRef.current.scrollWidth;
    // 场景 A: 缩水 (Shrink)
    // 当前内容比容器大 -> 必须减
    // 这里的 buffer (比如 5px) 是为了防止边界计算误差导致的死循环闪烁
    if (contentWidth - containerWidth >= 0) {
      if (showCount > 1) {
        setShowCount((prev) => prev - 1);
      }
      return;
    }
    // 场景 B: 展开 (Expand)
    // 探针(当前+1) 的宽度小于容器 -> 说明可以加
    if (showCount < totalCount && probeWidth + 5 <= containerWidth) {
      setShowCount((prev) => prev + 1);
    }
  }, [containerWidth, totalCount, showCount, isSingle]);
  const backButtonDom = (
    <button className="fcc hover:op-80 cursor-pointer mr-2" type="button" onClick={() => history.back()}>
      <Icon name={BackIcon} className="size-4" />
    </button>
  );
  const breadcrumbDom = (
    <div className="max-w-fit" ref={contentRef}>
      <Breadcrumb items={visibleItems} classNames={{ root: '[&>ol]:flex-nowrap', item: 'truncate' }} />
    </div>
  );
  return (
    <div className="flex-1 min-w-0" ref={containerRef}>
      {isSingle ? (
        title
      ) : (
        <>
          {breadcrumbDom}
          {!isMobile && (
            <div className="flex items-center">
              {shouldShowBack && backButtonDom}
              {title}
            </div>
          )}
        </>
      )}
      <div ref={probeRef} className="fixed pointer-events-none invisible">
        <Breadcrumb items={allItems} />
      </div>
    </div>
  );
}
