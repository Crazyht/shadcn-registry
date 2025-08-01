import React from 'react'
import { cn } from '@/lib/utils'
import { useDocSection } from '@/hooks/use-doc-navigation'
import { Sparkles } from 'lucide-react'

export interface DocSectionHeaderProps {
  id: string
  title: string
  level?: 1 | 2 | 3
  children: React.ReactNode
  className?: string
}

export function DocSectionHeader({
  id,
  title,
  level = 2,
  children,
  className
}: DocSectionHeaderProps) {
  // Automatically register this section with Zustand
  useDocSection(id, title, level)

  const levelStyles = {
    1: "text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent",
    2: "text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent",
    3: "text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
  }

  return (
    <div id={id} className={cn("scroll-mt-16 group mb-10", className)}>
      {level === 1 && (
        <div className="relative group/header">
          <div className="absolute -inset-6 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-indigo-950/20 rounded-2xl opacity-60 group-hover/header:opacity-80 transition-opacity duration-300"></div>
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-100/30 via-purple-100/30 to-indigo-100/30 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-indigo-900/10 rounded-xl opacity-50 group-hover/header:opacity-70 transition-opacity duration-300"></div>
          <h1 className={cn("relative flex items-center gap-4 py-6", levelStyles[1])}>
            <div className="relative">
              <Sparkles className="h-10 w-10 text-blue-500 drop-shadow-sm" />
              <div className="absolute inset-0 h-10 w-10 text-blue-500 animate-pulse opacity-30">
                <Sparkles className="h-10 w-10" />
              </div>
            </div>
            {children}
          </h1>
        </div>
      )}
      {level === 2 && (
        <div className="relative group/header">
          <div className="absolute -inset-3 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-950/15 dark:via-purple-950/15 dark:to-indigo-950/15 rounded-xl opacity-50 group-hover/header:opacity-70 transition-opacity duration-300"></div>
          <h2 className={cn("relative flex items-center gap-4 py-4", levelStyles[2])}>
            <div className="relative">
              <div className="w-3 h-10 bg-gradient-to-b from-blue-500 via-purple-500 to-indigo-500 rounded-full shadow-sm"></div>
              <div className="absolute inset-0 w-3 h-10 bg-gradient-to-b from-blue-400 via-purple-400 to-indigo-400 rounded-full blur-sm opacity-60"></div>
            </div>
            {children}
          </h2>
        </div>
      )}
      {level === 3 && (
        <div className="relative group/header">
          <h3 className={cn("flex items-center gap-3 py-3 hover:translate-x-1 transition-transform duration-200", levelStyles[3])}>
            <div className="relative">
              <div className="w-2 h-7 bg-gradient-to-b from-blue-500 via-purple-500 to-indigo-500 rounded-full shadow-sm"></div>
              <div className="absolute inset-0 w-2 h-7 bg-gradient-to-b from-blue-400 via-purple-400 to-indigo-400 rounded-full blur-sm opacity-50"></div>
            </div>
            {children}
          </h3>
        </div>
      )}
    </div>
  )
}
