import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/layout'
import { HomePage } from '@/pages/home'
import { RegistryListPage } from '@/pages/registry-list'
import { ComponentDocPage } from '@/pages/component-doc'
import { REGISTRY_TYPES } from '@/types/registry'

/**
 * Application principale avec routing dynamique
 * Les routes sont générées automatiquement selon les types de registry
 */
export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
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
      </Layout>
    </BrowserRouter>
  )
}
