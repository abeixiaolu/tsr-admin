import type { ElementType } from 'react';
import type { FileRoutesByFullPath } from '~/routeTree.gen';

export type FileRoutePath = LiteralUnion<keyof FileRoutesByFullPath>;

export interface RouteInfoItem {
  key: FileRoutePath;
  label: string;
  icon?: ElementType;
  children?: RouteInfoItem[];
  /** 菜单中隐藏 */
  hide?: boolean;
  parentKey?: FileRoutePath;
  type?: 'menu';
}
