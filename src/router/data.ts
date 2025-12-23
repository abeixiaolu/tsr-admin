import ExampleIcon from '@icons/example/example.svg?react';
import type { RouteInfoItem } from './type';
import { flatRouteData } from './utils';

export const routeData: RouteInfoItem[] = [
  {
    key: '/',
    label: 'menu.dashboard',
    icon: ExampleIcon,
  },
  {
    key: '/demo',
    label: 'menu.demo',
    icon: ExampleIcon,
  },
  {
    key: '/order',
    label: 'menu.order',
    icon: ExampleIcon,
    children: [
      {
        key: '/order-detail/$id',
        label: 'menu.order.detail',
        icon: ExampleIcon,
        hide: true,
      },
    ],
  },
];

export const flattenRouteData = flatRouteData(routeData);
