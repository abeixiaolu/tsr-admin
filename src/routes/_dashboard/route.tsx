import { createFileRoute } from '@tanstack/react-router';
import Layout from '@/components/layout';

export const Route = createFileRoute('/_dashboard')({
  component: Layout,
});
