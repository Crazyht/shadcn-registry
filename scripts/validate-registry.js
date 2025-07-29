// scripts/validate-registry.js
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Types de registry valides
 */
const VALID_TYPES = [
  'registry:block',
  'registry:component',
  'registry:lib',
  'registry:hook',
  'registry:ui',
  'registry:page',
  'registry:file',
  'registry:style',
  'registry:theme',
  'registry:item'
]

/**
 * Valide la structure d'un item de registry
 * @param {Object} item - Item à valider
 * @throws {Error} Si l'item est invalide
 */
function validateItem(item) {
  // Vérifier les champs requis
  if (!item.name || typeof item.name !== 'string') {
    throw new Error(`Invalid item name: ${JSON.stringify(item.name)}`)
  }

  if (!item.type || !VALID_TYPES.includes(item.type)) {
    throw new Error(`Invalid type "${item.type}" for item "${item.name}"`)
  }

  if (!Array.isArray(item.files) || item.files.length === 0) {
    throw new Error(`Item "${item.name}" must have at least one file`)
  }

  // Vérifier que les fichiers ne contiennent pas de fichiers internes
  const internalFiles = ['.docs.tsx', '.preview.tsx', '.test.tsx']
  item.files.forEach(file => {
    // Handle both string and object format
    const filePath = typeof file === 'string' ? file : file.path
    internalFiles.forEach(suffix => {
      if (filePath.endsWith(suffix)) {
        throw new Error(`Item "${item.name}" contains internal file "${filePath}". Only runtime files should be included.`)
      }
    })
  })
}

/**
 * Valide le fichier registry.json
 */
async function validateRegistry() {
  const registryPath = path.join(__dirname, '..', 'registry', 'registry.json')

  try {
    // Créer le fichier s'il n'existe pas
    try {
      await fs.access(registryPath)
    } catch {
      const defaultRegistry = {
        name: 'shadcn-registry',
        version: '1.0.0',
        items: []
      }
      await fs.mkdir(path.dirname(registryPath), { recursive: true })
      await fs.writeFile(registryPath, JSON.stringify(defaultRegistry, null, 2))
      console.log('✅ Created default registry.json')
      return
    }

    // Lire et parser le fichier
    const content = await fs.readFile(registryPath, 'utf-8')
    const registry = JSON.parse(content)

    // Valider la structure principale
    if (!registry.name || !registry.version || !Array.isArray(registry.items)) {
      throw new Error('Invalid registry structure: missing name, version, or items array')
    }

    // Valider chaque item
    for (const item of registry.items) {
      validateItem(item)
    }

    console.log(`✅ Registry validation passed (${registry.items.length} items)`)
  } catch (error) {
    console.error('❌ Registry validation failed:', error.message)
    process.exit(1)
  }
}

// Exécuter la validation
validateRegistry()
