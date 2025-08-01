import { useState, ReactNode } from 'react'
import { Button } from '../ui/button'
import { CodeBlock } from '../ui/code-block'
import { DocSubSectionHeader } from '../doc-sub-section-header-zustand'
import { Copy, Eye, Code2, Check, Maximize2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DocSampleProps {
  children: ReactNode
  sourceCode: string
  className?: string

  // Props pour créer automatiquement une sous-section (fusion DocExample)
  id?: string // Si fourni, crée une sous-section navigable
  title?: string // Titre à afficher (si id fourni = sous-section, sinon = titre simple)
  description?: React.ReactNode // Description/notes à afficher au-dessus
}

export function DocSample({
  children,
  sourceCode,
  className,
  id,
  title,
  description
}: DocSampleProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Si id et title sont fournis, on crée une sous-section complète
  const isSubSection = id && title

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sourceCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (isSubSection) {
    return (
      <div className={className}>
        {/* Titre comme sous-section navigable */}
        <DocSubSectionHeader id={id} title={title} />

        {/* Zone de description/notes si fournie */}
        {description && (
          <div className="mb-8">
            <div className="relative group overflow-hidden rounded-xl border border-blue-200/60 dark:border-blue-800/60 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-purple-950/10">
              {/* Border gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />

              {/* Content */}
              <div className="relative p-6">
                {/* Accent stripe */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 rounded-l-xl" />

                {/* Text content */}
                <div className="pl-4 space-y-3 text-blue-900 dark:text-blue-100">
                  <div className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-200">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Description
                  </div>
                  <div className="text-sm leading-relaxed">
                    {description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contrôle demo/code */}
        <DocSample sourceCode={sourceCode}>
          {children}
        </DocSample>
      </div>
    )
  }

  // Mode normal : juste le contrôle demo/code
  return (
    <div className={cn("group relative overflow-hidden rounded-xl border border-gray-200/60 dark:border-gray-800/60 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300", className)}>
      {/* Titre simple si fourni (sans navigation) */}
      {title && !id && (
        <div className="px-6 pt-4 pb-2">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {title}
          </h3>
        </div>
      )}

      {/* Header avec onglets redessinés */}
      <div className="relative bg-gradient-to-r from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/20 border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="flex items-center justify-between p-4">
          {/* Onglets avec design moderne */}
          <div className="relative flex bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-1.5 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
            <div
              className={cn(
                "absolute top-1.5 bottom-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md shadow-md transition-all duration-300 ease-out",
                activeTab === 'preview' ? "left-1.5 w-[calc(50%-6px)]" : "left-[calc(50%+1.5px)] w-[calc(50%-6px)]"
              )}
            />
            <button
              onClick={() => setActiveTab('preview')}
              className={cn(
                "relative z-10 flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200",
                activeTab === 'preview'
                  ? "text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              <Eye className="h-4 w-4" />
              Aperçu
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={cn(
                "relative z-10 flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200",
                activeTab === 'code'
                  ? "text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              <Code2 className="h-4 w-4" />
              Code
            </button>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center gap-2">
            {/* Bouton plein écran pour l'aperçu */}
            {activeTab === 'preview' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsFullscreen(true)}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/60 dark:border-gray-700/60 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="relative">
        {activeTab === 'preview' ? (
          <div className="p-8 bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20 dark:from-gray-900 dark:via-slate-900/50 dark:to-blue-950/10 min-h-[240px]">
            {/* Pattern décoratif subtil */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            </div>
            <div className="relative w-full flex items-center justify-center">
              <div className="w-full max-w-full">
                {children}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 dark:from-black dark:via-gray-950 dark:to-slate-950">
            {/* Barre de fenêtre macOS redessinée */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-700 dark:from-gray-950 dark:to-black border-b border-slate-700 dark:border-gray-900">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm" />
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                  component.tsx
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  TSX
                </div>
                {/* Bouton copier superposé */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopy}
                  className="h-7 px-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 text-gray-300 hover:text-white transition-all duration-200"
                >
                  {copied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>

            {/* Code avec syntax highlighting amélioré */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5" />
              <div className="relative p-6 overflow-x-auto">
                <CodeBlock
                  code={sourceCode}
                  language="tsx"
                  className="!bg-transparent !m-0 !p-0"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal plein écran */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-7xl h-full max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header de la modal */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {title || 'Aperçu plein écran'}
                </h3>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsFullscreen(false)}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Contenu de la modal */}
            <div className="flex-1 p-8 overflow-auto bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20 dark:from-gray-900 dark:via-slate-900/50 dark:to-blue-950/10">
              <div className="relative w-full min-h-full">
                {/* Pattern décoratif subtil */}
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
                </div>
                <div className="relative w-full max-w-full">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
