import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // 서울 열린데이터광장(HTTP 전용) 프록시 — 배포 환경의 Vercel rewrites와 동일한 경로
      '/seoul-api': {
        target: 'http://openapi.seoul.go.kr:8088',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/seoul-api/, ''),
      },
    },
  },
  build: {
    // Vite v8 기본 압축기(oxc)는 esbuild.drop 옵션을 그대로 이어받지 않아서
    // console/debugger 제거가 실제로 안 먹힘 → terser로 바꿔서 압축 시점에 확실히 제거한다.
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 프로덕션 빌드에서만 console.* 제거 (npm run dev는 영향 없음)
        drop_debugger: true,
      },
    },
  },
})
