import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import Icon from '@/components/common/icon';

export const Route = createFileRoute('/_dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Button type="primary">Hello '/'!</Button>
      <Icon name={'i-solar-archive-up-minimlistic-bold-duotone'} />
      {Array.from({ length: 100 }).map((_, idx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: to be remove
        <p key={idx}>Home {idx}</p>
      ))}
    </div>
  );
}
