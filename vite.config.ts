import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  build: {
    lib: {
      entry: "src/index.tsx",
      fileName: fmt => `speed.${fmt}.js`,
      name: "easy-speed-control",
    },
  },
})
