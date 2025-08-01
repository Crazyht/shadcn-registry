import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react'
import path from 'path'
import { copyFileSync, mkdirSync, existsSync, readFileSync } from 'fs'

// Plugin to copy registry files to dist
function copyRegistryPlugin() {
  return {
    name: 'copy-registry',
    writeBundle() {
      const registryPath = path.resolve(__dirname, 'registry')
      const distRegistryPath = path.resolve(__dirname, 'dist/registry')
      const registryJsonPath = path.join(registryPath, 'registry.json')

      // Create dist/registry directory
      if (!existsSync(distRegistryPath)) {
        mkdirSync(distRegistryPath, { recursive: true })
      }

      try {
        // Read and parse registry.json
        const registryContent = JSON.parse(readFileSync(registryJsonPath, 'utf-8'))

        // Copy registry.json first
        copyFileSync(registryJsonPath, path.join(distRegistryPath, 'registry.json'))
        let fileCount = 1

        // Extract all file paths from registry items
        const filesToCopy = new Set<string>()

        if (registryContent.items) {
          for (const item of registryContent.items) {
            if (item.files) {
              for (const file of item.files) {
                // Handle both old string format and new object format
                const filePath = typeof file === 'string' ? file : file.path
                if (filePath) {
                  filesToCopy.add(filePath)
                }
              }
            }
          }
        }

        // Copy only the referenced files
        for (const relativeFilePath of filesToCopy) {
          const srcPath = path.resolve(__dirname, relativeFilePath)
          const destPath = path.join(distRegistryPath, relativeFilePath.replace('registry/', ''))

          // Create directory structure if needed
          const destDir = path.dirname(destPath)
          if (!existsSync(destDir)) {
            mkdirSync(destDir, { recursive: true })
          }

          // Copy file if it exists
          if (existsSync(srcPath)) {
            copyFileSync(srcPath, destPath)
            fileCount++
          } else {
            console.warn(`⚠️  Referenced file not found: ${srcPath}`)
          }
        }

        console.log(`✓ Copied registry.json and ${fileCount - 1} referenced files to dist/registry`)
        console.log(`📦 Total files in production registry: ${fileCount}`)

      } catch (error) {
        console.error('❌ Error copying registry files:', error)
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), copyRegistryPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@registry': path.resolve(__dirname, './registry')
    }
  },
  base: process.env.NODE_ENV === 'production' ? '/shadcn-registry/' : '/',
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-select'],
          'vendor-utils': ['clsx', 'tailwind-merge', 'zod', 'zustand'],
          'vendor-icons': ['lucide-react'],

          // Separate Shiki syntax highlighting into smaller chunks
          'syntax-core': ['shiki/core'],
          'syntax-langs-web': ['shiki/langs'],
          'syntax-themes': ['shiki/themes'],
        },
        // Optimize chunk size
        chunkFileNames: (chunkInfo) => {
          // Create separate chunks for different language groups
          if (chunkInfo.name?.includes('lang')) {
            return 'assets/langs/[name]-[hash].js'
          }
          if (chunkInfo.name?.includes('theme')) {
            return 'assets/themes/[name]-[hash].js'
          }
          return 'assets/[name]-[hash].js'
        }
      }
    },
    // Increase chunk size warning limit to 1MB for syntax highlighting
    chunkSizeWarningLimit: 1000,
    // Enable source maps for better debugging
    sourcemap: false
  },
  server: {
    fs: {
      allow: ['..', '.']
    },
    watch: {
      usePolling: true,
      interval: 100
    }
  },
  optimizeDeps: {
    exclude: ['@registry'],
    include: ['react', 'react-dom']
  }
})
