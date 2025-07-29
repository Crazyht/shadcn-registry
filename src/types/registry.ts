// src/types/registry.ts

/**
 * Types de composants supportés par la registry
 */
export type RegistryType =
  | 'registry:block'
  | 'registry:component'
  | 'registry:lib'
  | 'registry:hook'
  | 'registry:ui'
  | 'registry:page'
  | 'registry:file'
  | 'registry:style'
  | 'registry:theme'
  | 'registry:item'

/**
 * Définition d'un fichier de registry
 */
export interface RegistryFile {
  /** Chemin du fichier */
  path: string
  /** Type du fichier */
  type: RegistryType
}

/**
 * Définition d'un élément de la registry
 */
export interface RegistryItem {
  /** Nom unique du composant */
  name: string
  /** Type du composant */
  type: RegistryType
  /** Description optionnelle */
  description?: string
  /** Liste des fichiers runtime nécessaires - support des anciens et nouveaux formats */
  files: (string | RegistryFile)[]
  /** Dépendances npm requises */
  dependencies?: string[]
  /** Dépendances de développement */
  devDependencies?: string[]
}

/**
 * Structure principale de la registry
 */
export interface Registry {
  /** Nom de la registry */
  name: string
  /** Version de la registry */
  version: string
  /** Liste des composants */
  items: RegistryItem[]
}

/**
 * Configuration pour chaque type de registry
 */
export interface RegistryTypeConfig {
  type: RegistryType
  route: string
  icon: string
  label: string
}

/**
 * Configuration des types de registry avec leurs métadonnées
 */
export const REGISTRY_TYPES: RegistryTypeConfig[] = [
  { type: 'registry:block', route: '/blocks', icon: 'blocks', label: 'Blocks' },
  { type: 'registry:component', route: '/components', icon: 'package', label: 'Components' },
  { type: 'registry:lib', route: '/lib', icon: 'library', label: 'Libraries' },
  { type: 'registry:hook', route: '/hooks', icon: 'zap', label: 'Hooks' },
  { type: 'registry:ui', route: '/ui', icon: 'layers', label: 'UI' },
  { type: 'registry:page', route: '/pages', icon: 'file-image', label: 'Pages' },
  { type: 'registry:file', route: '/files', icon: 'file', label: 'Files' },
  { type: 'registry:style', route: '/styles', icon: 'brush', label: 'Styles' },
  { type: 'registry:theme', route: '/themes', icon: 'palette', label: 'Themes' },
  { type: 'registry:item', route: '/items', icon: 'grid-3x3', label: 'Items' }
]
