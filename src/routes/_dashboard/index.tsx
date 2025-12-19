import { createFileRoute } from '@tanstack/react-router';
import Icon from '~/components/icon';

export const Route = createFileRoute('/_dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello '/'!
      <Icon name={'i-solar-archive-up-minimlistic-bold-duotone'} />
      {Array.from({ length: 100 }).map((_, idx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: to be remove
        <p key={idx}>Lorem {idx}</p>
      ))}
    </div>
  );
}
