/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string;
  readonly VITE_I18N_ENABLED: 'true' | 'false';
  readonly VITE_APP_STORAGE_PREFIX: string;
  readonly VITE_APP_ENV_TAG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
