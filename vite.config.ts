import { fileURLToPath } from 'node:url';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import unoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const envDir = fileURLToPath(new URL('env', import.meta.url));

export default defineConfig({
  envDir,
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      semicolons: false,
    }),
    react({ babel: { plugins: [['babel-plugin-react-compiler']] } }),
    tsconfigPaths({}),
    compression({ algorithms: ['brotli', 'gzip'] }),
    svgr(),
    unoCSS(),
  ],
});
