import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
  return {
    ssr: {
      noExternal: [/^(?!cloudflare:)/],
      external: ["cloudflare:workers"],
    },
    build: {
      rollupOptions: { external: [/^cloudflare:/] },
    },
    plugins: [
      svgr({
        svgrOptions: {
          icon: true,
          svgProps: { fill: "currentColor" },
          svgoConfig: {
            plugins: [
              { name: "preset-default", params: { overrides: { removeViewBox: false } } },
            ],
          },
        },
      }),
      tanstackStart({
        server: { entry: "server" },
      }),
      react(),
      tailwindcss(),
      tsconfigPaths(),
    ],
  };
});