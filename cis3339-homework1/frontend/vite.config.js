import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // During "npm run dev", send API requests to the Express server
  server: {
    proxy: {
      '^/(list-students|find-student|add-student|delete-student|list-courses|add-course|delete-course|enroll-student|course-students)$': 'http://localhost:3000',
    },
  },
})
