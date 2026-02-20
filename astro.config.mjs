// @ts-check
import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx()],
  vite: {
    ssr: {
      noExternal: ['bootstrap'],
    },
  },
  adapter: node({
    mode: 'standalone',
  }),
  env: {
    schema: {
      SONGS_STATS_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
      }),
      SONGS_STATS_USER: envField.string({
        context: 'server',
        access: 'secret',
      }),
      SONGS_STATS_ENDPOINT: envField.string({
        context: 'server',
        access: 'secret',
      }),
    },
  },
});
