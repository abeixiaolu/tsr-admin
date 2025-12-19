import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/"!
      {Array.from({ length: 100 }).map((_, idx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: to be remove
        <p key={idx}>Lorem {idx}</p>
      ))}
    </div>
  );
}
