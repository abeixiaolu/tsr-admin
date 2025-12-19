import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/order')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/_dashboard/order"!
      <Link to="/order-detail/$id" params={{ id: '123' }}>
        Test Link
      </Link>
    </div>
  );
}
