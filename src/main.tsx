import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'virtual:uno.css';
import '@/styles/global.scss';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import '@/locales';

// biome-ignore lint/style/noNonNullAssertion: always have
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
