import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import devtoolsJson from 'vite-plugin-devtools-json'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  css: {
    devSourcemap: true, // cho phép xem sourcemap của CSS trong trình duyệt
  },
  server: {
    port: 3000, // cổng máy chủ phát triển
  },
  preview: {
    port: 3000,
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), devtoolsJson()],
})
