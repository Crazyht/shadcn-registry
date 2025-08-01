import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export interface DocSection {
  id: string
  title: string
  level: number
  subsections?: DocSection[]
}

interface DocNavigationState {
  sections: DocSection[]
  currentSection: string | null
  isDocPage: boolean
}

interface DocNavigationActions {
  registerSection: (section: DocSection) => void
  unregisterSection: (id: string) => void
  setCurrentSection: (id: string | null) => void
  clearSections: () => void
  setIsDocPage: (isDocPage: boolean) => void
  scrollToSection: (id: string) => void
}

type DocNavigationStore = DocNavigationState & DocNavigationActions

export const useDocNavigationStore = create<DocNavigationStore>()(
  subscribeWithSelector((set, get) => ({
    // State
    sections: [],
    currentSection: null,
    isDocPage: false,

    // Actions
    registerSection: (section: DocSection) => {
      set((state) => {
        // Check if section already exists
        const existingIndex = state.sections.findIndex(s => s.id === section.id)

        if (existingIndex >= 0) {
          // Update existing section
          const newSections = [...state.sections]
          newSections[existingIndex] = section
          return { sections: newSections }
        } else {
          // Add new section
          const newSections = [...state.sections, section]
          return { sections: newSections }
        }
      })
    },

    unregisterSection: (id: string) => {
      set((state) => {
        const newSections = state.sections.filter(s => s.id !== id)
        return { sections: newSections }
      })
    },

    setCurrentSection: (id: string | null) => {
      set({ currentSection: id })
    },

    clearSections: () => {
      set({ sections: [], currentSection: null })
    },

    setIsDocPage: (isDocPage: boolean) => {
      set({ isDocPage })
      // Clear sections when leaving doc pages
      if (!isDocPage) {
        get().clearSections()
      }
    },

    scrollToSection: (id: string) => {
      const element = document.getElementById(id)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          })

          // Update current section after scroll
          setTimeout(() => {
            get().setCurrentSection(id)
          }, 100)
        }, 50)
      }
    }
  }))
)
