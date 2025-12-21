import { createFileRoute } from '@tanstack/react-router';
import { Button } from 'antd';
import { IconButton } from '@/components/common/button';

export const Route = createFileRoute('/_dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="fcc gap-4 pt-4">
        <Button type="primary">Hello World</Button>
        <Button type="primary">Hello React</Button>
        <IconButton icon="i-solar-accumulator-bold" type="primary">
          Hello
        </IconButton>
      </div>
      {Array.from({ length: 100 }).map((_, idx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: to be remove
        <p key={idx}>Home {idx}</p>
      ))}
    </div>
  );
}
