import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/about')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/about"!</div>;
}
