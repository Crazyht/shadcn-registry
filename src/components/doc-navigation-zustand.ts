// Navigation components with Zustand
export { DocTableOfContents } from './doc-table-of-contents-zustand'
export { DocSectionHeader } from './doc-section-header-zustand'
export { DocSubSectionHeader } from './doc-sub-section-header-zustand'

// Navigation hooks
export { useDocSection, useDocPageDetection } from '../hooks/use-doc-navigation'

// Store
export { useDocNavigationStore } from '../stores/doc-navigation-store'
export type { DocSection } from '../stores/doc-navigation-store'
