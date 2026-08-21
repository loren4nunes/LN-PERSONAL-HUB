// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
// - TanStack devtools, tanstackStart, viteReact, tailwindcss, tsConfigPaths,
// nitro, VITE_* env injection, @ path alias, React/TanStack dedupe,
// error logger plugins, and sandbox detection.

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isGitHubActions = process.env.GITHUB_ACTIONS === "true";

export default defineConfig({
  // GitHub Pages precisa de arquivos estáticos.
  // No Lovable, Nitro continua funcionando normalmente.
  nitro: isGitHubActions ? false : undefined,

  tanstackStart: {
    server: { entry: "server" },

    ...(isGitHubActions
      ? {
          prerender: {
            enabled: true,
            crawlLinks: true,
          },
          pages: [{ path: "/" }],
        }
      : {}),
  },

  vite: {
    base: isGitHubActions ? "/LN-PERSONAL-HUB/" : "/",
  },
});
