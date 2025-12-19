import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/order')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="bg-gray-500 p-4 sticky top-50 z-100">
        Hello "/_dashboard/order"!
        <Link to="/order-detail/$id" params={{ id: '123' }}>
          Test Link
        </Link>
      </div>
      {Array.from({ length: 100 }).map((_, idx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: to be remove
        <p key={idx}>Order List {idx}</p>
      ))}
    </div>
  );
}
