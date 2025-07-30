// scripts/dev-helper.js
/**
 * Script d'aide au développement pour améliorer l'expérience HMR
 */

import chokidar from 'chokidar'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🚀 Starting development helper...')

// Surveiller les fichiers de documentation
const watcher = chokidar.watch([
  path.join(__dirname, '../registry/**/*.docs.tsx'),
  path.join(__dirname, '../registry/**/*.preview.tsx')
], {
  ignored: /(^|[/\\])\../, // ignore dotfiles
  persistent: true
})

watcher
  .on('change', (filePath) => {
    console.log(`📝 Documentation file changed: ${path.relative(process.cwd(), filePath)}`)

    // Envoyer un signal WebSocket ou autre mécanisme pour notifier le navigateur
    // Pour l'instant, on log juste pour debugging
    console.log('💡 Tip: Use Ctrl+R in browser or click the Reload button to refresh documentation')
  })
  .on('error', error => {
    console.error('❌ Watcher error:', error)
  })

console.log('👀 Watching documentation files for changes...')
console.log('🔧 In development mode, documentation files will be watched for better HMR experience')

// Garder le processus en vie
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping development helper...')
  watcher.close()
  process.exit(0)
})
