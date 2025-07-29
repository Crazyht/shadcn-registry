// src/lib/registry-parser.ts
import { Registry, RegistryType, REGISTRY_TYPES, RegistryFile } from '@/types/registry'

/**
 * Charge la registry depuis le fichier JSON
 * @returns La registry ou null si non disponible
 */
export async function loadRegistry(): Promise<Registry | null> {
  try {
    const response = await fetch('/registry/registry.json')
    if (!response.ok) {
      throw new Error('Registry not found')
    }
    return await response.json()
  } catch (error) {
    console.error('Failed to load registry:', error)
    return null
  }
}

/**
 * Récupère les types disponibles dans la registry
 * @param registry - La registry à analyser
 * @returns Liste des types présents
 */
export function getAvailableTypes(registry: Registry | null): RegistryType[] {
  if (!registry || !registry.items) return []

  const types = new Set<RegistryType>()
  registry.items.forEach(item => {
    if (item.type) {
      types.add(item.type)
    }
  })

  return Array.from(types)
}

/**
 * Génère les éléments de navigation basés sur la registry
 * @param registry - La registry à analyser
 * @returns Configuration de navigation filtrée
 */
export function getNavigationItems(registry: Registry | null) {
  const availableTypes = getAvailableTypes(registry)

  return REGISTRY_TYPES.filter(config =>
    availableTypes.includes(config.type)
  )
}

/**
 * Récupère les items d'un type spécifique
 * @param registry - La registry à filtrer
 * @param type - Le type recherché
 * @returns Liste des items du type
 */
export function getItemsByType(registry: Registry | null, type: RegistryType) {
  if (!registry || !registry.items) return []

  return registry.items.filter(item => item.type === type)
}

/**
 * Extrait le chemin d'un fichier depuis l'ancien ou nouveau format
 * @param file - Fichier (string ou objet)
 * @returns Chemin du fichier
 */
export function getFilePath(file: string | RegistryFile): string {
  return typeof file === 'string' ? file : file.path
}

/**
 * Extrait tous les chemins de fichiers d'un item
 * @param files - Liste des fichiers
 * @returns Liste des chemins
 */
export function getFilePaths(files: (string | RegistryFile)[]): string[] {
  return files.map(getFilePath)
}
