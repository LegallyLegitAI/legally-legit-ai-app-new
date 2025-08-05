/// <reference types="vite/client" />

// Markdown imports
declare module '*.md?raw' {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_APP_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_GOOGLE_ANALYTICS_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// CSS modules
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

// Bootstrap CSS
declare module 'bootstrap/dist/css/bootstrap.min.css';
