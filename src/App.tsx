import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Layout } from '@/components/layout/layout'
import { REGISTRY_TYPES } from '@/types/registry'

// Lazy load pages for better code splitting
const HomePage = lazy(() => import('@/pages/home').then(module => ({ default: module.HomePage })))
const RegistryListPage = lazy(() => import('@/pages/registry-list').then(module => ({ default: module.RegistryListPage })))
const ComponentDocPage = lazy(() => import('@/pages/component-doc').then(module => ({ default: module.ComponentDocPage })))

// Loading fallback component
const PageFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
)

/**
 * Application principale avec routing dynamique
 * Les routes sont générées automatiquement selon les types de registry
 */
export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {REGISTRY_TYPES.map((config) => (
              <Route key={config.type} path={config.route}>
                <Route index element={
                  <RegistryListPage
                    type={config.type}
                    title={config.label}
                    icon={config.icon}
                  />
                } />
                <Route path=":componentName" element={
                  <ComponentDocPage type={config.type} />
                } />
              </Route>
            ))}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  )
}
