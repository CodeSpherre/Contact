import { defineConfig } from 'astro/config';

// Static output for Cloudflare Pages (git integration, no adapter needed).
// Deploy: connect repo CodeSpherre/Contact, build `npm run build`, output `dist/`.
export default defineConfig({
  output: 'static',
  vite: {
    build: {
      rollupOptions: {
        output: {
          // Neutral hashed names: don't leak route names (e.g. /area51) via asset URLs.
          assetFileNames: '_astro/[hash][extname]',
          chunkFileNames: '_astro/[hash].js',
          entryFileNames: '_astro/[hash].js',
        },
      },
    },
  },
});
