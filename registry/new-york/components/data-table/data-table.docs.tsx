// Documentation DataTable - Restructuré avec exemples modulaires
import {
  DocSample,
  BasicExample,
  FilteringExample,
  GroupingExample,
  CustomSortIconsExample,
  PaginationModesExample
} from './samples'
import { getSampleSourceCode } from './samples/source-codes'

/**
 * Documentation pour DataTable
 * Fichier interne - Non inclus dans la registry
 */
export function DataTableDocumentation() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold">Data Table</h1>
          <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/50 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300">
            Table Component
          </span>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Un composant de tableau de données avancé avec validation Zod, tri multi-colonnes,
          rendu personnalisé et gestion de la sélection. Idéal pour afficher et manipuler des datasets complexes.
        </p>
      </div>

      {/* Basic Example */}
      <DocSample
        title="🎮 Exemple d'utilisation de base"
        description="DataTable avec tri, sélection et pagination. Clic simple = tri unique | Ctrl/Shift + Clic = tri multi-colonnes"
        sourceCode={getSampleSourceCode('basic-example')}
      >
        <BasicExample />
      </DocSample>

      {/* Installation */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <div className="rounded-lg bg-muted p-4">
          <code className="text-sm">npm install clsx tailwind-merge lucide-react zod</code>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Exemples d'utilisation</h2>

        {/* Basic Usage */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Utilisation de base</h3>
          <div className="rounded-lg bg-muted p-4">
            <pre className="text-sm overflow-x-auto"><code>{`import { DataTable, DataTableColumn } from './data-table'
import { z } from 'zod'

// Définir le schéma Zod
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
})

type User = z.infer<typeof UserSchema>

// Configuration des colonnes
const columns: DataTableColumn<User>[] = [
  { label: 'ID', path: 'id', isSortable: true },
  { label: 'Nom', path: 'name', isSortable: true },
  { label: 'Email', path: 'email', isSortable: true },
]

// Fonction pour récupérer les données
const getData = async (sortColumns, startRow, pageSize) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ sort: sortColumns, startRow, pageSize })
  })
  const result = await response.json()
  return {
    data: result.data,
    totalCount: result.totalCount,
    lastRow: startRow + result.data.length - 1
  }
}

// Utilisation
<DataTable
  schema={UserSchema}
  columns={columns}
  getData={getData}
/>`}</code></pre>
          </div>
        </div>

        {/* Pagination Usage */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Utilisation avec pagination</h3>
          <div className="rounded-lg bg-muted p-4">
            <pre className="text-sm overflow-x-auto"><code>{`// Pagination complète avec contrôle de taille (recommandé)
<DataTable
  schema={UserSchema}
  columns={columns}
  getData={getData}
  paginationMode="PaginationWithSize"
  pageSize={25}
  pageSizeOptions={[10, 25, 50, 100]}
/>

// Pagination simple sans contrôle de taille
<DataTable
  schema={UserSchema}
  columns={columns}
  getData={getData}
  paginationMode="Pagination"
  pageSize={20}
/>

// Sans pagination (charge toutes les données)
<DataTable
  schema={UserSchema}
  columns={columns}
  getData={getData}
  paginationMode="None"
/>

// Scroll infini
<DataTable
  schema={UserSchema}
  columns={columns}
  getData={getData}
  paginationMode="InfiniteScroll"
  pageSize={20}
  showLoadMoreButton={true}
/>

// Options de personnalisation de la pagination
<DataTable
  schema={UserSchema}
  columns={columns}
  getData={getData}
  paginationMode="PaginationWithSize"
  showPaginationInfo={false}        // Masquer "Affichage de X à Y"
  showSinglePagePagination={true}   // Toujours afficher la pagination
  pageSize={25}
/>

// Exemple de réponse serveur attendue
{
  "data": [
    { "id": 1, "name": "Alice", "email": "alice@example.com" },
    { "id": 2, "name": "Bob", "email": "bob@example.com" }
  ],
  "totalCount": 150,
  "lastRow": 49
}`}</code></pre>
          </div>
        </div>

        {/* Advanced Usage */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Colonnes avec rendu personnalisé</h3>
          <div className="rounded-lg bg-muted p-4">
            <pre className="text-sm overflow-x-auto"><code>{`const columns: DataTableColumn<Product>[] = [
  {
    label: 'Prix',
    path: 'price',
    isSortable: true,
    align: 'right',
    render: (value: number) => \`€\${value.toFixed(2)}\`,
  },
  {
    label: 'Statut',
    path: 'status',
    render: (value: string) => (
      <span className={\`badge \${value === 'active' ? 'success' : 'error'}\`}>
        {value}
      </span>
    ),
  },
]`}</code></pre>
          </div>
        </div>

        {/* Columns without path */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Colonnes d'actions et calculées</h3>
          <div className="rounded-lg bg-muted p-4">
            <pre className="text-sm overflow-x-auto"><code>{`const columns: DataTableColumn<User>[] = [
  // Colonne normale avec données
  {
    label: 'Nom',
    path: 'name',
    isSortable: true
  },

  // Colonne calculée (sans path, pas triable)
  {
    label: 'Initiales',
    type: 'computed',
    render: (_, row: User) => {
      const initials = row.name.split(' ')
        .map(n => n[0])
        .join('')
      return <span className="font-mono">{initials}</span>
    },
  },

  // Colonne d'actions (sans path, pas triable)
  {
    label: 'Actions',
    type: 'action',
    align: 'center',
    render: (_, row: User) => (
      <div className="flex gap-2">
        <button onClick={() => edit(row)}>Éditer</button>
        <button onClick={() => delete(row)}>Supprimer</button>
      </div>
    ),
  },
]`}</code></pre>
          </div>
        </div>
      </div>

      {/* API Reference */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Référence API</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">DataTable Props</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Prop</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">schema</td>
                    <td className="p-4 text-sm"><code>z.ZodSchema&lt;T&gt;</code></td>
                    <td className="p-4 text-sm">Schéma Zod pour valider les données</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">columns</td>
                    <td className="p-4 text-sm"><code>DataTableColumn&lt;T&gt;[]</code></td>
                    <td className="p-4 text-sm">Configuration des colonnes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">getData</td>
                    <td className="p-4 text-sm"><code>(sortColumns: SortColumn[], startRow: number, pageSize: number, grouping?: DataTableGrouping, filters?: ColumnFilter[]) =&gt; Promise&lt;DataTableResponse&lt;T&gt;&gt; | DataTableResponse&lt;T&gt;</code></td>
                    <td className="p-4 text-sm">Fonction pour récupérer les données avec tri, pagination, groupement et filtrage</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">pageSize</td>
                    <td className="p-4 text-sm"><code>number</code></td>
                    <td className="p-4 text-sm">Taille de page pour la pagination (défaut: 50)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">paginationMode</td>
                    <td className="p-4 text-sm"><code>'None' | 'InfiniteScroll' | 'Pagination' | 'PaginationWithSize'</code></td>
                    <td className="p-4 text-sm">Mode de pagination (défaut: 'PaginationWithSize')</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">showPaginationInfo</td>
                    <td className="p-4 text-sm"><code>boolean</code></td>
                    <td className="p-4 text-sm">Afficher les informations de pagination comme "Affichage de 1 à 10 sur 50 éléments" (défaut: true)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">showSinglePagePagination</td>
                    <td className="p-4 text-sm"><code>boolean</code></td>
                    <td className="p-4 text-sm">Afficher la pagination même s'il n'y a qu'une seule page (défaut: false)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">showLoadMoreButton</td>
                    <td className="p-4 text-sm"><code>boolean</code></td>
                    <td className="p-4 text-sm">Afficher un bouton "Charger plus" pour le mode InfiniteScroll (défaut: false)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">loadingMessage</td>
                    <td className="p-4 text-sm"><code>string</code></td>
                    <td className="p-4 text-sm">Message à afficher pendant le chargement des données (défaut: "Chargement des données...")</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">pageSizeOptions</td>
                    <td className="p-4 text-sm"><code>number[]</code></td>
                    <td className="p-4 text-sm">Options de taille de page pour PaginationWithSize (défaut: [10, 25, 50, 100])</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">filterIcons</td>
                    <td className="p-4 text-sm"><code>FilterIcons</code></td>
                    <td className="p-4 text-sm">Configuration des icônes de filtrage personnalisées (optionnel)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">sortIcons</td>
                    <td className="p-4 text-sm"><code>SortIcons</code></td>
                    <td className="p-4 text-sm">Configuration des icônes de tri personnalisées (optionnel)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">onRowSelect</td>
                    <td className="p-4 text-sm"><code>(row: T) =&gt; void</code></td>
                    <td className="p-4 text-sm">Callback de sélection de ligne</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">selectedRow</td>
                    <td className="p-4 text-sm"><code>T</code></td>
                    <td className="p-4 text-sm">Ligne actuellement sélectionnée</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">grouping</td>
                    <td className="p-4 text-sm"><code>DataTableGrouping</code></td>
                    <td className="p-4 text-sm">Configuration du groupement de données (optionnel)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">DataTableResponse Interface</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Propriété</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">data</td>
                    <td className="p-4 text-sm"><code>T[]</code></td>
                    <td className="p-4 text-sm">Les données de la page actuelle</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">totalCount</td>
                    <td className="p-4 text-sm"><code>number</code></td>
                    <td className="p-4 text-sm">Nombre total d'éléments dans le dataset</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">lastRow</td>
                    <td className="p-4 text-sm"><code>number</code></td>
                    <td className="p-4 text-sm">Index de la dernière ligne retournée</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">groups</td>
                    <td className="p-4 text-sm"><code>DataGroup&lt;T&gt;[]?</code></td>
                    <td className="p-4 text-sm">Groupes pré-calculés par le serveur (optionnel)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">DataTableColumn Interface</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Propriété</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">label</td>
                    <td className="p-4 text-sm"><code>string</code></td>
                    <td className="p-4 text-sm">Libellé affiché dans l'en-tête</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">path</td>
                    <td className="p-4 text-sm"><code>string?</code></td>
                    <td className="p-4 text-sm">Chemin vers la propriété (optionnel pour colonnes d'actions)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">isSortable</td>
                    <td className="p-4 text-sm"><code>boolean</code></td>
                    <td className="p-4 text-sm">Si la colonne peut être triée (auto false si pas de path)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">render</td>
                    <td className="p-4 text-sm"><code>(value: unknown, row: T) =&gt; ReactNode</code></td>
                    <td className="p-4 text-sm">Fonction de rendu personnalisée</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">type</td>
                    <td className="p-4 text-sm"><code>'data' | 'action' | 'computed'</code></td>
                    <td className="p-4 text-sm">Type de colonne pour clarifier l'usage</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">align</td>
                    <td className="p-4 text-sm"><code>'left' | 'center' | 'right'</code></td>
                    <td className="p-4 text-sm">Alignement du contenu</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">isFilterable</td>
                    <td className="p-4 text-sm"><code>boolean</code></td>
                    <td className="p-4 text-sm">Si la colonne peut être filtrée (défaut: false)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">filterControl</td>
                    <td className="p-4 text-sm"><code>React.ComponentType&lt;FilterControlProps&gt;</code></td>
                    <td className="p-4 text-sm">Composant de contrôle de filtre personnalisé</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">width</td>
                    <td className="p-4 text-sm"><code>string</code></td>
                    <td className="p-4 text-sm">Largeur de la colonne (optionnel)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">DataTableGrouping Interface</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Propriété</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">path</td>
                    <td className="p-4 text-sm"><code>string</code></td>
                    <td className="p-4 text-sm">Chemin de la colonne à grouper (ex: 'status', 'department')</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">renderGroupHeader</td>
                    <td className="p-4 text-sm"><code>(groupValue: unknown, count: number, isExpanded: boolean) =&gt; ReactNode</code></td>
                    <td className="p-4 text-sm">Fonction de rendu personnalisée pour l'en-tête de groupe</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">expandable</td>
                    <td className="p-4 text-sm"><code>boolean</code></td>
                    <td className="p-4 text-sm">Si le groupe est expandable/collapsible (défaut: true)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">defaultExpanded</td>
                    <td className="p-4 text-sm"><code>boolean</code></td>
                    <td className="p-4 text-sm">État initial des groupes (défaut: true = tous expandés)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">accordion</td>
                    <td className="p-4 text-sm"><code>boolean</code></td>
                    <td className="p-4 text-sm">Mode accordéon - un seul groupe ouvert à la fois (défaut: false)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">DataGroup Interface</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Propriété</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">groupValue</td>
                    <td className="p-4 text-sm"><code>unknown</code></td>
                    <td className="p-4 text-sm">Valeur de groupement (ex: "Engineering", "Active")</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">count</td>
                    <td className="p-4 text-sm"><code>number</code></td>
                    <td className="p-4 text-sm">Nombre d'éléments dans le groupe</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">items</td>
                    <td className="p-4 text-sm"><code>T[]</code></td>
                    <td className="p-4 text-sm">Les données du groupe</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">isExpanded</td>
                    <td className="p-4 text-sm"><code>boolean</code></td>
                    <td className="p-4 text-sm">Si le groupe est actuellement expandé</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">SortIcons Interface</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Propriété</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">default</td>
                    <td className="p-4 text-sm"><code>ComponentType?</code></td>
                    <td className="p-4 text-sm">Icône affichée quand aucun tri n'est appliqué</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">asc</td>
                    <td className="p-4 text-sm"><code>ComponentType?</code></td>
                    <td className="p-4 text-sm">Icône affichée pour le tri croissant</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">desc</td>
                    <td className="p-4 text-sm"><code>ComponentType?</code></td>
                    <td className="p-4 text-sm">Icône affichée pour le tri décroissant</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">classNames</td>
                    <td className="p-4 text-sm"><code>object?</code></td>
                    <td className="p-4 text-sm">Classes CSS personnalisées pour chaque état de tri</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">FilterIcons Interface</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Propriété</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">default</td>
                    <td className="p-4 text-sm"><code>ComponentType?</code></td>
                    <td className="p-4 text-sm">Icône affichée pour ouvrir le filtre (défaut: Filter)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">active</td>
                    <td className="p-4 text-sm"><code>ComponentType?</code></td>
                    <td className="p-4 text-sm">Icône affichée quand un filtre est actif (défaut: FilterX)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">classNames</td>
                    <td className="p-4 text-sm"><code>object?</code></td>
                    <td className="p-4 text-sm">Classes CSS personnalisées pour les états default et active</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">ColumnFilter Interface</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Propriété</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">path</td>
                    <td className="p-4 text-sm"><code>string</code></td>
                    <td className="p-4 text-sm">Chemin de la colonne filtrée (ex: 'name', 'user.email')</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">value</td>
                    <td className="p-4 text-sm"><code>unknown</code></td>
                    <td className="p-4 text-sm">Valeur du filtre (string, object avec opérateur, etc.)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">FilterControlProps Interface</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Propriété</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">value</td>
                    <td className="p-4 text-sm"><code>unknown</code></td>
                    <td className="p-4 text-sm">Valeur actuelle du filtre</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">onChange</td>
                    <td className="p-4 text-sm"><code>(value: unknown) =&gt; void</code></td>
                    <td className="p-4 text-sm">Callback appelé quand la valeur change</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">onClose</td>
                    <td className="p-4 text-sm"><code>() =&gt; void</code></td>
                    <td className="p-4 text-sm">Callback pour fermer la popover</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Contrôles de filtre prédéfinis</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Contrôle</th>
                    <th className="text-left p-4 font-medium">Usage</th>
                    <th className="text-left p-4 font-medium">Valeur retournée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">TextFilterControl</td>
                    <td className="p-4 text-sm">Recherche textuelle simple</td>
                    <td className="p-4 text-sm"><code>string</code> - Texte de recherche</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">NumberFilterControl</td>
                    <td className="p-4 text-sm">Filtrage numérique avec opérateurs</td>
                    <td className="p-4 text-sm"><code>{`{ operator: string, value: string }`}</code></td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">SelectFilterControl</td>
                    <td className="p-4 text-sm">Sélection dans une liste d'options</td>
                    <td className="p-4 text-sm"><code>string</code> - Valeur sélectionnée</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Sorting Behavior */}
          <div>
            <h3 className="text-lg font-medium mb-4">Comportement du tri</h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Action</th>
                    <th className="text-left p-4 font-medium">Comportement</th>
                    <th className="text-left p-4 font-medium">Indicateur visuel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">Clic simple</td>
                    <td className="p-4 text-sm">Tri unique - remplace les autres tris</td>
                    <td className="p-4 text-sm">Flèche haut/bas sans numéro</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">Ctrl + Clic</td>
                    <td className="p-4 text-sm">Ajoute un tri multi-colonnes</td>
                    <td className="p-4 text-sm">Flèche + numéro d'ordre</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-mono text-sm">Shift + Clic</td>
                    <td className="p-4 text-sm">Ajoute un tri multi-colonnes</td>
                    <td className="p-4 text-sm">Flèche + numéro d'ordre</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-sm">3 clics consécutifs</td>
                    <td className="p-4 text-sm">Asc → Desc → Aucun tri</td>
                    <td className="p-4 text-sm">↑ → ↓ → ⇅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Demos */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Démos des modes de pagination</h2>
          <p className="text-muted-foreground mb-6">
            Explorez les différents modes de pagination et leurs options de personnalisation.
          </p>
        </div>

        <DocSample
          title="Modes de pagination"
          description="Comparaison complète des 4 modes de pagination avec options de personnalisation"
          sourceCode={getSampleSourceCode('pagination-modes-example')}
        >
          <PaginationModesExample />
        </DocSample>
      </div>

      {/* Pagination Modes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Modes de Pagination</h2>
        <p className="text-muted-foreground">
          DataTable supporte 4 modes de pagination différents pour s'adapter à vos besoins :
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">None</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Aucune pagination automatique. Toutes les données sont affichées en une fois.
              </p>
              <div className="bg-muted rounded-md p-3">
                <code className="text-sm">
                  {`<DataTable
  paginationMode="None"
  getData={getData}
  // ...autres props
/>`}
                </code>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">InfiniteScroll</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Scroll infini avec chargement automatique. Idéal pour les flux de données ou les grandes listes.
              </p>
              <div className="bg-muted rounded-md p-3">
                <code className="text-sm">
                  {`<DataTable
  paginationMode="InfiniteScroll"
  showLoadMoreButton={true}
  getData={getData}
  // ...autres props
/>`}
                </code>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">Pagination</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Pagination classique avec navigation par pages. Interface simple et épurée.
              </p>
              <div className="bg-muted rounded-md p-3">
                <code className="text-sm">
                  {`<DataTable
  paginationMode="Pagination"
  pageSize={20}
  getData={getData}
  // ...autres props
/>`}
                </code>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">PaginationWithSize</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Pagination complète avec contrôle de la taille de page. Recommandé pour la plupart des cas.
              </p>
              <div className="bg-muted rounded-md p-3">
                <code className="text-sm">
                  {`<DataTable
  paginationMode="PaginationWithSize"
  pageSize={25}
  pageSizeOptions={[10, 25, 50, 100]}
  getData={getData}
  // ...autres props
/>`}
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Conseil</h4>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            La fonction <code>getData</code> reçoit les paramètres <code>startRow</code> et <code>pageSize</code> pour tous les modes.
            En mode <code>None</code>, <code>pageSize</code> sera très élevé pour récupérer toutes les données.
            En mode <code>InfiniteScroll</code>, <code>startRow</code> augmente à chaque chargement.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Fonctionnalités</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">Validation Zod</h4>
              <p className="text-sm text-muted-foreground">Validation automatique des données avec messages d'erreur</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">Tri intelligent</h4>
              <p className="text-sm text-muted-foreground">Tri simple (clic) ou multi-colonnes (Ctrl/Shift + clic) avec indicateurs visuels</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">Rendu personnalisé</h4>
              <p className="text-sm text-muted-foreground">Fonctions de rendu pour personnaliser l'affichage des cellules</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">Pagination flexible</h4>
              <p className="text-sm text-muted-foreground">4 modes de pagination : Aucune, Scroll infini, Simple, ou Complète avec shadcn/ui</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">Sélection de lignes</h4>
              <p className="text-sm text-muted-foreground">Gestion de la sélection avec callbacks</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">Groupement de données</h4>
              <p className="text-sm text-muted-foreground">Groupement par colonne avec expansion/collapse et rendu personnalisé</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 border rounded-lg">
            <span className="text-green-500 text-xl">✅</span>
            <div>
              <h4 className="font-medium">Icônes de tri personnalisées</h4>
              <p className="text-sm text-muted-foreground">Configuration d'icônes et de styles personnalisés pour le tri des colonnes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Column Filtering */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Filtrage des colonnes</h3>
        <p className="text-sm text-muted-foreground">
          Ajoutez des fonctionnalités de filtrage interactives avec des popovers personnalisables et des contrôles de filtre adaptés à chaque type de données.
        </p>

        <DocSample
          title="Filtrage des colonnes"
          description="Exemple complet avec filtres texte, nombre, et sélection + icônes personnalisées"
          sourceCode={getSampleSourceCode('filtering-example')}
        >
          <FilteringExample />
        </DocSample>
      </div>

      {/* Custom Sort Icons */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Icônes de tri personnalisées</h3>
        <p className="text-sm text-muted-foreground">
          Personnalisez les icônes et styles de tri pour chaque colonne avec des icônes Lucide personnalisées et des classes CSS.
        </p>

        <DocSample
          title="Icônes de tri personnalisées"
          description="Exemple avec icônes TrendingUp/TrendingDown et couleurs personnalisées"
          sourceCode={getSampleSourceCode('custom-sort-icons-example')}
        >
          <CustomSortIconsExample />
        </DocSample>
      </div>

      {/* Grouping Usage */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Groupement de données</h3>
        <p className="text-sm text-muted-foreground">
          Le DataTable supporte le groupement des données par une colonne spécifique avec expansion/collapse.
        </p>

        <DocSample
          title="Groupement par département"
          description="Exemple avec employés groupés par département avec mode accordéon optionnel"
          sourceCode={getSampleSourceCode('grouping-example')}
        >
          <GroupingExample />
        </DocSample>

        <div className="rounded-lg bg-muted p-4">
          <pre className="text-sm overflow-x-auto"><code>{`// Configuration basique du grouping
<DataTable
  schema={EmployeeSchema}
  columns={columns}
  getData={getData}
  grouping={{
    path: 'department' // Grouper par département
  }}
/>

// Configuration avancée du grouping
<DataTable
  schema={EmployeeSchema}
  columns={columns}
  getData={getData}
  grouping={{
    path: 'department',
    expandable: true,              // Permet expansion/collapse (défaut: true)
    defaultExpanded: false,        // Groupes repliés par défaut (défaut: true)
    renderGroupHeader: (groupValue, count, isExpanded) => (
      <div className="flex items-center gap-2">
        <span className="font-semibold">{String(groupValue)}</span>
        <span className="text-muted-foreground">
          ({count} employé{count > 1 ? 's' : ''})
        </span>
      </div>
    )
  }}
/>

// La fonction getData reçoit maintenant le paramètre grouping
const getData = async (sortColumns, startRow, pageSize, grouping) => {
  const response = await fetch('/api/employees', {
    method: 'POST',
    body: JSON.stringify({
      sort: sortColumns,
      startRow,
      pageSize,
      grouping // Informations de groupement
    })
  })

  const result = await response.json()

  // Retour avec groupes (optionnel - peut être géré côté client)
  return {
    data: result.data,
    totalCount: result.totalCount,
    lastRow: startRow + result.data.length - 1,
    groups: result.groups // Optionnel: groupes pré-calculés par le serveur
  }
}

// Structure des groupes si fournie par le serveur
interface DataGroup<T> {
  groupValue: unknown      // Valeur de groupement (ex: "Engineering")
  count: number           // Nombre d'éléments dans le groupe
  items: T[]             // Les données du groupe
  isExpanded: boolean    // État d'expansion initial
}`}</code></pre>
        </div>
      </div>
    </div>
  )
}
