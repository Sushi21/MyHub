import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Custom plugin to serve /output from parent directory during dev
function serveOutputPlugin() {
  return {
    name: 'serve-output',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    configureServer(server: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      server.middlewares.use((req: any, res: any, next: () => void) => {
        if (req.url?.startsWith('/output/')) {
          const filePath = path.join(__dirname, '..', req.url)

          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            // Determine content type
            const ext = path.extname(filePath).toLowerCase()
            const contentTypes: Record<string, string> = {
              '.json': 'application/json',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.png': 'image/png',
              '.gif': 'image/gif',
              '.svg': 'image/svg+xml',
            }

            const contentType = contentTypes[ext] || 'application/octet-stream'
            res.setHeader('Content-Type', contentType)

            const stream = fs.createReadStream(filePath)
            stream.pipe(res)
            return
          }
        }
        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), serveOutputPlugin()],
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    fs: {
      // Allow serving files from the parent directory (for /output)
      allow: ['..'],
    },
  },
  publicDir: false, // Disable automatic public directory copying
  preview: {
    port: 4173,
    open: true,
  },
})
