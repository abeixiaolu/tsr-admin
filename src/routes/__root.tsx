import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import Icon from '~/components/icon';
import Confounded from '~icons/example/confounded-circle-bold.svg?react';

const RootLayout = () => (
  <>
    <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:text-red">
        Home <Icon name={Confounded} />
      </Link>{' '}
      <Link to="/about" className="[&.active]:text-red">
        About
      </Link>
    </div>
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
