import { createFileRoute } from '@tanstack/react-router';
import ProFormDemoPage from '@/pages/pro-form';

export const Route = createFileRoute('/_dashboard/order')({
  component: ProFormDemoPage,
});
