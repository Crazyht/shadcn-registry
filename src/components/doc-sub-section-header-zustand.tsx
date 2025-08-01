import React from 'react'
import { cn } from '@/lib/utils'
import { useDocSection } from '../hooks/use-doc-navigation'
import { Hash } from 'lucide-react'

interface DocSubSectionHeaderProps {
  id: string
  title: string
  level?: 3 | 4 | 5 | 6
  className?: string
  children?: React.ReactNode
}

export function DocSubSectionHeader({
  id,
  title,
  level = 3,
  className,
  children
}: DocSubSectionHeaderProps) {
  useDocSection(id, title, level)

  const Tag = `h${level}` as 'h3' | 'h4' | 'h5' | 'h6'

  const levelClasses = {
    3: 'text-xl font-semibold text-blue-700 dark:text-blue-300',
    4: 'text-lg font-semibold text-blue-700 dark:text-blue-300',
    5: 'text-base font-semibold text-blue-700 dark:text-blue-300',
    6: 'text-sm font-semibold text-blue-700 dark:text-blue-300'
  }

  return (
    <div className={cn('scroll-mt-20 group mb-6', className)}>
      <Tag
        id={id}
        className={cn(
          'relative flex items-center gap-3 group/header hover:translate-x-2 transition-all duration-300 py-2',
          levelClasses[level]
        )}
      >
        <div className="flex items-center gap-3">
          {/* Icône avec effet de glow */}
          <div className="relative">
            <Hash className="h-5 w-5 text-blue-500 opacity-70 group-hover/header:opacity-100 group-hover/header:text-blue-600 transition-all duration-200 drop-shadow-sm" />
            <div className="absolute inset-0 h-5 w-5 text-blue-400 opacity-0 group-hover/header:opacity-30 transition-opacity duration-200">
              <Hash className="h-5 w-5 blur-sm" />
            </div>
          </div>

          {/* Lien avec animation de soulignement */}
          <a
            href={`#${id}`}
            className="relative text-inherit no-underline group-hover/header:text-purple-600 dark:group-hover/header:text-purple-400 transition-colors duration-200"
          >
            {children || title}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover/header:w-full transition-all duration-300 ease-out"></span>
          </a>
        </div>

        {/* Accent décoratif */}
        <div className="flex-1 h-px bg-gradient-to-r from-blue-200 via-purple-200 to-transparent dark:from-blue-800 dark:via-purple-800 dark:to-transparent opacity-0 group-hover/header:opacity-100 transition-opacity duration-300 ml-4"></div>
      </Tag>
    </div>
  )
}
