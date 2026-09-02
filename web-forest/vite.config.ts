import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Port claim: 4177 (forest Field Guide). Never 5173 / 8080 / 3000–3999.
 * web/ already holds 9500. strictPort so a collision fails loudly.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: "127.0.0.1", port: 4177, strictPort: true },
  preview: { host: "127.0.0.1", port: 4178, strictPort: true },
});
