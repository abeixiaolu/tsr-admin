import { Space } from 'antd';
import { IconButton, LinkButton } from '@/components/common/button';

export default function ButtonDemo() {
  return (
    <Space size={'large'} className="flex-wrap">
      <IconButton type="primary" icon="i-solar-4k-broken">
        Icon Button
      </IconButton>
      <IconButton variant="solid" color="cyan" iconPlacement="end" icon="i-line-md-loading-twotone-loop">
        Icon Button
      </IconButton>
      <LinkButton>Link Button</LinkButton>
      <LinkButton icon="i-solar-4k-broken">Link Button</LinkButton>
    </Space>
  );
}
