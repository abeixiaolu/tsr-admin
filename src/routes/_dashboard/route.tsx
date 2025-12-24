import { createFileRoute, redirect } from '@tanstack/react-router';
import Layout from '@/components/layout';
import { useAuthStore } from '@/stores/auth';

export const Route = createFileRoute('/_dashboard')({
  component: Layout,
  beforeLoad(ctx) {
    const token = useAuthStore.getState().token;
    if (!token) {
      throw redirect({ to: '/sign-in', search: { redirectUrl: ctx.location.pathname }, replace: true });
    }
  },
});
