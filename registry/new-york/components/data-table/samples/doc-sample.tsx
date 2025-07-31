import { useState, ReactNode } from 'react'
import { Button } from '../../../../../src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../src/components/ui/card'

interface DocSampleProps {
  title: string
  description?: string
  children: ReactNode
  sourceCode: string
  className?: string
}

export function DocSample({ title, description, children, sourceCode, className }: DocSampleProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        <div className="flex gap-2 border-b">
          <Button
            variant={activeTab === 'preview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('preview')}
            className="rounded-b-none"
          >
            📋 Aperçu
          </Button>
          <Button
            variant={activeTab === 'code' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('code')}
            className="rounded-b-none"
          >
            💻 Code
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {activeTab === 'preview' ? (
          <div className="p-6">
            {children}
          </div>
        ) : (
          <div className="relative">
            <pre className="bg-muted/50 p-4 text-sm overflow-x-auto border-none rounded-none">
              <code>{sourceCode}</code>
            </pre>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={() => navigator.clipboard.writeText(sourceCode)}
            >
              📋 Copier
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
