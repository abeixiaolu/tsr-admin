import { Alert } from 'antd';
import OverflowMarquee from '@/components/common/overflow-marquee';

export default function OverflowMarqueeDemo() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="resize-x max-w-500px of-hidden bd-normal p-2">
        <OverflowMarquee>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium asperiores nam blanditiis quo</OverflowMarquee>
      </div>
      <div className="max-w-300px">
        <Alert
          type="warning"
          showIcon
          title={
            <OverflowMarquee>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium asperiores nam blanditiis quo</OverflowMarquee>
          }
        />
      </div>
    </div>
  );
}
