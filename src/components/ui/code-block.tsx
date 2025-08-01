import { useEffect, useState } from 'react'
import { createHighlighter, type Highlighter, type BundledLanguage } from 'shiki'
import { useTheme } from '@/hooks/use-theme'
import '../../styles/shiki-custom.css'

interface CodeBlockProps {
  code: string
  language?: BundledLanguage
  className?: string
}

// Cache global pour le highlighter
let highlighterInstance: Highlighter | null = null

const getShikiHighlighter = async (): Promise<Highlighter> => {
  if (highlighterInstance) {
    return highlighterInstance
  }

  try {
    highlighterInstance = await createHighlighter({
      themes: ['vitesse-dark', 'vitesse-light', 'github-light', 'github-dark'],
      langs: ['typescript', 'tsx', 'javascript', 'jsx', 'json', 'css', 'html']
    })

    return highlighterInstance
  } catch (error) {
    console.error('Failed to initialize Shiki highlighter:', error)
    throw error
  }
}

export function CodeBlock({ code, language = 'tsx', className = '' }: CodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const theme = useTheme()

  useEffect(() => {
    const highlightCode = async () => {
      setIsLoading(true)
      try {
        const highlighter = await getShikiHighlighter()

        // Choisir le thème en fonction du thème actuel
        const shikiTheme = theme === 'dark' ? 'vitesse-dark' : 'vitesse-light'

        const highlighted = highlighter.codeToHtml(code, {
          lang: language,
          theme: shikiTheme,
        })

        setHighlightedCode(highlighted)
      } catch (error) {
        console.warn('Failed to highlight code with Shiki:', error)
        // Fallback: code brut dans un <pre>
        setHighlightedCode(`<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`)
      } finally {
        setIsLoading(false)
      }
    }

    highlightCode()
  }, [code, language, theme]) // Ajouter theme comme dépendance

  if (isLoading) {
    return (
      <pre className={`${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} p-4 rounded-lg overflow-x-auto ${className}`}>
        <code
          style={{
            fontFamily: '"Fira Code", "JetBrains Mono", "SF Mono", Monaco, Inconsolata, "Roboto Mono", monospace',
            fontSize: '13px',
            lineHeight: '1.5',
          }}
        >
          Loading syntax highlighting...
        </code>
      </pre>
    )
  }

  return (
    <div
      className={`shiki-container overflow-x-auto rounded-lg ${className}`}
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
      style={{
        fontSize: '13px',
        lineHeight: '1.5',
      }}
    />
  )
}
