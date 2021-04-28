import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@/': `${resolve(__dirname, '/src')}/` // import HelloWorld from '@/components/HelloWorld.vue'
    }
  },
  css: {
    preprocessorOptions: { 
      scss: {
        additionalData: ''
      }
    }
  },
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          return 'vendor'
        }
      }
    }
  }
})
