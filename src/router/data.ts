import ExampleIcon from '~icons/example/example.svg?react';
import type { RouteInfoItem } from './type';
import { flatRouteData } from './utils';

export const routeData: RouteInfoItem[] = [
  {
    key: '/',
    label: 'menu.dashboard',
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
  {
    key: '/about',
    label: 'menu.about',
    icon: ExampleIcon,
  },
  {
    key: 'random-1',
    label: 'menu.payIn&PayOut',
    icon: ExampleIcon,
    type: 'menu',
    children: [
      {
        key: 'random-2',
        label: 'menu.payIn&PayOut',
        icon: ExampleIcon,
        type: 'menu',
        children: [
          {
            key: '/settings',
            label: 'menu.settings',
            icon: ExampleIcon,
          },
        ],
      },
    ],
  },
];

export const flattenRouteData = flatRouteData(routeData);
