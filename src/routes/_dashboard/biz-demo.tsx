import { createFileRoute } from '@tanstack/react-router';
import BizDemoPage from '@/pages/biz-demo';

export const Route = createFileRoute('/_dashboard/biz-demo')({
  component: BizDemoPage,
});
