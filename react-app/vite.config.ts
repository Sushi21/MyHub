import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Custom plugin to serve /output and /images from parent/public directory during dev
function serveOutputPlugin() {
  return {
    name: 'serve-output',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    configureServer(server: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      server.middlewares.use((req: any, res: any, next: () => void) => {
        let filePath: string | null = null

        // Serve /output from parent directory
        if (req.url?.startsWith('/output/')) {
          filePath = path.join(__dirname, '..', req.url)
        }
        // Serve /images from public/images directory
        else if (req.url?.startsWith('/images/')) {
          filePath = path.join(__dirname, 'public', req.url)
        }

        if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
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
        next()
      })
    }
  }
}

// Custom plugin to copy public/images to dist/images during build
function copyImagesPlugin() {
  return {
    name: 'copy-images',
    closeBundle() {
      const publicImagesDir = path.join(__dirname, 'public', 'images')
      const distImagesDir = path.join(__dirname, '..', 'dist', 'images')

      if (fs.existsSync(publicImagesDir)) {
        // Create dist/images directory if it doesn't exist
        if (!fs.existsSync(distImagesDir)) {
          fs.mkdirSync(distImagesDir, { recursive: true })
        }

        // Copy all files from public/images to dist/images
        const files = fs.readdirSync(publicImagesDir)
        files.forEach((file) => {
          const srcFile = path.join(publicImagesDir, file)
          const destFile = path.join(distImagesDir, file)
          if (fs.statSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, destFile)
          }
        })
        console.log('✓ Copied images to dist/images')
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), serveOutputPlugin(), copyImagesPlugin()],
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
  publicDir: false, // Disable automatic public directory copying (we handle it manually)
  preview: {
    port: 4173,
    open: true,
  },
})
