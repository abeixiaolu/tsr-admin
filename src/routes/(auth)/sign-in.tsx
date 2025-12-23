import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import LoginPage from '@/pages/login';

export const Route = createFileRoute('/(auth)/sign-in')({
  component: LoginPage,
  validateSearch: z.object({ redirectUrl: z.string().optional() }),
});
