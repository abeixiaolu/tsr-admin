import { ProgressProvider } from '@bprogress/react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

const RootLayout = () => (
  <ProgressProvider>
    <Outlet />
    <TanStackRouterDevtools position="bottom-right" />
  </ProgressProvider>
);

export const Route = createRootRoute({ component: RootLayout });
