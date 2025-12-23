import type { FileRoutePath, RouteInfoItem } from './type';
export function flatRouteData(routeData: RouteInfoItem[], parentKey?: FileRoutePath) {
  let data: RouteInfoItem[] = [];
  routeData.forEach((item) => {
    data.push({
      ...item,
      parentKey,
    });
    if (item.children && item.children.length > 0) {
      data = data.concat(flatRouteData(item.children, item.key));
    }
  });

  return data;
}

export function findRouteAncestors(flatRoutes: RouteInfoItem[], key: string): RouteInfoItem[] {
  const ancestors: RouteInfoItem[] = [];
  flatRoutes.forEach((route) => {
    if (route.key === key) {
      ancestors.push(route);
      if (route.parentKey) {
        ancestors.push(...findRouteAncestors(flatRoutes, route.parentKey));
      }
    }
  });
  return ancestors;
}
