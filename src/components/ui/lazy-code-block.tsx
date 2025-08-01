import { Suspense, lazy } from 'react'
import { type BundledLanguage } from 'shiki'

interface LazyCodeBlockProps {
  code: string
  language?: BundledLanguage
  className?: string
}

// Lazy load the CodeBlock component to avoid loading Shiki immediately
const CodeBlock = lazy(() => import('./code-block').then(module => ({ default: module.CodeBlock })))

const CodeBlockFallback = ({ code, className }: { code: string; className?: string }) => (
  <div className={`bg-muted border rounded-lg p-4 overflow-x-auto ${className}`}>
    <pre className="text-sm">
      <code>{code}</code>
    </pre>
  </div>
)

export const LazyCodeBlock = ({ code, language, className }: LazyCodeBlockProps) => {
  return (
    <Suspense fallback={<CodeBlockFallback code={code} className={className} />}>
      <CodeBlock code={code} language={language} className={className} />
    </Suspense>
  )
}

export default LazyCodeBlock
