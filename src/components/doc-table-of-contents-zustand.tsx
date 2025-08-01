import React from 'react'
import { cn } from '@/lib/utils'
import { useDocNavigationStore } from '@/stores/doc-navigation-store'
import { Hash } from 'lucide-react'

export interface DocTableOfContentsProps {
  className?: string
}

export function DocTableOfContents({ className }: DocTableOfContentsProps) {
  // Optimisations Zustand avec sélecteurs pour éviter les re-renders inutiles
  const sections = useDocNavigationStore(state => state.sections)
  const currentSection = useDocNavigationStore(state => state.currentSection)
  const scrollToSection = useDocNavigationStore(state => state.scrollToSection)

  // Memoisation pour éviter les recalculs
  const sortedSections = React.useMemo(() => {
    return [...sections].sort((a, b) => {
      // Trier par ordre d'apparition dans le DOM (ordre logique)
      const aElement = document.getElementById(a.id)
      const bElement = document.getElementById(b.id)
      if (aElement && bElement) {
        return aElement.offsetTop - bElement.offsetTop
      }
      return 0
    })
  }, [sections])

  if (sections.length === 0) {
    return (
      <div className="space-y-2">
        <h3 className="font-semibold text-sm text-muted-foreground">
          On this page
        </h3>
        <p className="text-sm text-muted-foreground">
          No sections available
        </p>
      </div>
    )
  }

  return (
    <nav className={cn("space-y-1", className)}>
      <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
        <Hash className="h-4 w-4" />
        On this page
      </div>

      <div className="space-y-1">
        {sortedSections.map((section) => (
          <div key={section.id}>
            <button
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "w-full text-left px-2 py-1 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                section.level === 1 && "font-medium",
                section.level === 2 && "ml-3 text-muted-foreground",
                section.level === 3 && "ml-6 text-muted-foreground text-xs",
                currentSection === section.id && "bg-accent text-accent-foreground font-medium"
              )}
            >
              {section.title}
            </button>

            {/* Render subsections */}
            {section.subsections && section.subsections.map((subsection) => (
              <button
                key={subsection.id}
                onClick={() => scrollToSection(subsection.id)}
                className={cn(
                  "w-full text-left px-2 py-1 text-xs rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ml-8 text-muted-foreground",
                  currentSection === subsection.id && "bg-accent text-accent-foreground font-medium"
                )}
              >
                {subsection.title}
              </button>
            ))}
          </div>
        ))}
      </div>
    </nav>
  )
}
