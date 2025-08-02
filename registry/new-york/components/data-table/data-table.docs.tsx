// Documentation DataTable - Restructuré avec exemples modulaires
import { DocSample, InstallationCommand } from '../../../../src/components/registry'
import { DocSectionHeader, DocSubSectionHeader } from '../../../../src/components/doc-navigation-zustand'
import {
  BasicExample,
  FilteringExample,
  GroupingExample,
  CustomSortIconsExample,
  PaginationModesExample,
  ResponsiveDataTableExample,
  I18nExample
} from './samples'
import { getSampleSourceCode } from './samples/source-codes'

/**
 * Documentation pour DataTable
 * Fichier interne - Non inclus dans la registry
 */
export function DataTableDocumentation() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold">Data Table</h1>
          <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/50 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300">
            Table Component
          </span>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Un composant de tableau de données avancé avec validation Zod, tri multi-colonnes, filtrage uniforme,
          rendu personnalisé et gestion de la sélection. Idéal pour afficher et manipuler des datasets complexes.
        </p>
      </div>

      {/* Fonctionnalités */}
      <DocSectionHeader id="features" title="Fonctionnalités">
        🚀 Fonctionnalités
      </DocSectionHeader>
      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400">📊 Données et Validation</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Validation des données avec schémas Zod</li>
              <li>• Support des types TypeScript complets</li>
              <li>• Gestion d'erreurs intégrée</li>
              <li>• Rendu conditionnel des cellules</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-green-600 dark:text-green-400">🔍 Tri et Filtrage</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Tri multi-colonnes (Ctrl/Shift + clic)</li>
              <li>• Filtres uniformes avec opérateurs</li>
              <li>• Filtres personnalisés par colonne</li>
              <li>• Icônes de tri configurables</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-purple-600 dark:text-purple-400">📄 Pagination et Navigation</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 4 modes de pagination disponibles</li>
              <li>• Scroll infini avec chargement auto</li>
              <li>• Contrôle de taille de page</li>
              <li>• Informations de pagination</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-orange-600 dark:text-orange-400">🎨 Interface et UX</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Groupement des données</li>
              <li>• Sélection de lignes</li>
              <li>• Messages personnalisables</li>
              <li>• Responsive design</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section Responsive */}
      <DocSectionHeader id="responsive" title="Système Responsive">
        📱 Système Responsive
      </DocSectionHeader>
      <section className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <DocSubSectionHeader id="responsive-breakpoints" title="Breakpoints Prédéfinis" />
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded text-sm font-mono">Mobile</span>
                <span className="text-sm text-muted-foreground">max: 639px</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 rounded text-sm font-mono">Tablet</span>
                <span className="text-sm text-muted-foreground">640px - 1023px</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded text-sm font-mono">Desktop</span>
                <span className="text-sm text-muted-foreground">min: 1024px</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <DocSubSectionHeader id="responsive-width-modes" title="Modes de Largeur" />
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 rounded text-sm font-mono">content</span>
                <span className="text-sm text-muted-foreground">Largeur fixe</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded text-sm font-mono">range</span>
                <span className="text-sm text-muted-foreground">Entre min et max</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="px-2 py-1 bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 rounded text-sm font-mono">fill</span>
                <span className="text-sm text-muted-foreground">Prend l'espace restant</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">💡 Configuration</h4>
          <p className="text-sm text-muted-foreground">
            Utilisez la propriété <code className="px-1 py-0.5 bg-background rounded">responsive</code> sur chaque colonne
            pour définir sa visibilité et son comportement selon la taille d'écran.
          </p>
        </div>
      </section>

      {/* Installation */}
      <DocSectionHeader id="installation" title="Installation">
        📦 Installation
      </DocSectionHeader>
      <section className="space-y-6">

        <div className="space-y-4">
          <p className="text-muted-foreground">
            Installez le composant Data Table via shadcn/ui CLI :
          </p>
          <InstallationCommand componentPath="components/data-table" className="bg-zinc-950 dark:bg-zinc-900 text-green-400 font-mono" />

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Toutes les dépendances sont installées automatiquement</strong> par la commande shadcn add (zod, lucide-react, clsx, tailwind-merge).
            </p>
          </div>
        </div>
      </section>

      {/* API Reference */}
      <DocSectionHeader id="api-reference" title="Référence API">
        📖 Référence API
      </DocSectionHeader>
      <section className="space-y-6">

        {/* DataTableProps */}
        <div className="space-y-4">
          <DocSubSectionHeader id="datatable-props" title="Props du DataTable" />
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
                  <td className="p-4 text-sm"><code>function</code></td>
                  <td className="p-4 text-sm">Fonction pour récupérer les données avec tri, pagination, groupement et filtrage</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">messages</td>
                  <td className="p-4 text-sm"><code>DataTableMessages</code></td>
                  <td className="p-4 text-sm">Configuration pour la personnalisation des messages (optionnel)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">paginationMode</td>
                  <td className="p-4 text-sm"><code>'None' | 'InfiniteScroll' | 'Pagination' | 'PaginationWithSize'</code></td>
                  <td className="p-4 text-sm">Mode de pagination (défaut: 'PaginationWithSize')</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">pageSize</td>
                  <td className="p-4 text-sm"><code>number</code></td>
                  <td className="p-4 text-sm">Taille de page pour la pagination (défaut: 50)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">pageSizeOptions</td>
                  <td className="p-4 text-sm"><code>number[]</code></td>
                  <td className="p-4 text-sm">Options de taille de page pour PaginationWithSize (défaut: [10, 25, 50, 100])</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">showPaginationInfo</td>
                  <td className="p-4 text-sm"><code>boolean</code></td>
                  <td className="p-4 text-sm">Afficher les informations de pagination (défaut: true)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">showSinglePagePagination</td>
                  <td className="p-4 text-sm"><code>boolean</code></td>
                  <td className="p-4 text-sm">Afficher la pagination même s'il n'y a qu'une seule page (défaut: false)</td>
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
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">grouping</td>
                  <td className="p-4 text-sm"><code>DataTableGrouping</code></td>
                  <td className="p-4 text-sm">Configuration du groupement de données (optionnel)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">sortIcons</td>
                  <td className="p-4 text-sm"><code>SortIcons</code></td>
                  <td className="p-4 text-sm">Configuration des icônes de tri personnalisées (optionnel)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">filterIcons</td>
                  <td className="p-4 text-sm"><code>FilterIcons</code></td>
                  <td className="p-4 text-sm">Configuration des icônes de filtrage personnalisées (optionnel)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* DataTableColumn */}
        <div className="space-y-4">
          <DocSubSectionHeader id="column-configuration" title="Configuration des colonnes" />
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
                  <td className="p-4 font-mono text-sm">isFilterable</td>
                  <td className="p-4 text-sm"><code>boolean</code></td>
                  <td className="p-4 text-sm">Si la colonne peut être filtrée (défaut: false)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">filterControl</td>
                  <td className="p-4 text-sm"><code>React.ComponentType&lt;FilterControlProps&gt;</code></td>
                  <td className="p-4 text-sm">Composant de contrôle de filtre personnalisé</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">render</td>
                  <td className="p-4 text-sm"><code>(value: unknown, row: T) =&gt; ReactNode</code></td>
                  <td className="p-4 text-sm">Fonction de rendu personnalisée</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">width</td>
                  <td className="p-4 text-sm"><code>string</code></td>
                  <td className="p-4 text-sm">Largeur de la colonne (optionnel)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">align</td>
                  <td className="p-4 text-sm"><code>'left' | 'center' | 'right'</code></td>
                  <td className="p-4 text-sm">Alignement du contenu</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-sm">type</td>
                  <td className="p-4 text-sm"><code>'data' | 'action' | 'computed'</code></td>
                  <td className="p-4 text-sm">Type de colonne pour clarifier l'usage</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* DataTableMessages */}
        <div className="space-y-4">
          <DocSubSectionHeader id="messages-configuration" title="Configuration des messages" />
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
                  <td className="p-4 font-mono text-sm">emptyMessage</td>
                  <td className="p-4 text-sm"><code>string</code></td>
                  <td className="p-4 text-sm">Message affiché quand il n'y a pas de données</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">loadingMessage</td>
                  <td className="p-4 text-sm"><code>string</code></td>
                  <td className="p-4 text-sm">Message affiché pendant le chargement</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">loadingIndicator</td>
                  <td className="p-4 text-sm"><code>string</code></td>
                  <td className="p-4 text-sm">Texte affiché pendant le chargement de données supplémentaires</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">loadMoreButton</td>
                  <td className="p-4 text-sm"><code>string</code></td>
                  <td className="p-4 text-sm">Texte du bouton "Charger plus"</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">displayInfo</td>
                  <td className="p-4 text-sm"><code>string</code></td>
                  <td className="p-4 text-sm">Template d'information de pagination : "{"{start}"} à {"{end}"} sur {"{total}"} éléments"</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">elementsPerPage</td>
                  <td className="p-4 text-sm"><code>string</code></td>
                  <td className="p-4 text-sm">Label pour le sélecteur de taille de page</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">totalElements</td>
                  <td className="p-4 text-sm"><code>string</code></td>
                  <td className="p-4 text-sm">Template pour le total d'éléments : "{"{total}"} éléments au total"</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">sortColumnAriaLabel</td>
                  <td className="p-4 text-sm"><code>string</code></td>
                  <td className="p-4 text-sm">Label aria pour colonnes triables avec placeholder {"{column}"}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">paginationAriaLabel</td>
                  <td className="p-4 text-sm"><code>string</code></td>
                  <td className="p-4 text-sm">Label aria pour la navigation de pagination</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">validationError</td>
                  <td className="p-4 text-sm"><code>string</code></td>
                  <td className="p-4 text-sm">Message d'erreur de validation des données</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">loadingError</td>
                  <td className="p-4 text-sm"><code>string</code></td>
                  <td className="p-4 text-sm">Message d'erreur de chargement des données</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-sm">unknownError</td>
                  <td className="p-4 text-sm"><code>string</code></td>
                  <td className="p-4 text-sm">Message pour erreur inconnue</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FilterValue */}
        <div className="space-y-4">
          <DocSubSectionHeader id="filter-structure" title="Structure des filtres" />
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
                  <td className="p-4 font-mono text-sm">operator</td>
                  <td className="p-4 text-sm"><code>FilterOperator</code></td>
                  <td className="p-4 text-sm">Opérateur de filtrage (equals, contains, greater_than, etc.)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">value</td>
                  <td className="p-4 text-sm"><code>unknown</code></td>
                  <td className="p-4 text-sm">Valeur principale du filtre</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">value2</td>
                  <td className="p-4 text-sm"><code>unknown</code></td>
                  <td className="p-4 text-sm">Valeur secondaire pour l'opérateur 'between'</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-sm">values</td>
                  <td className="p-4 text-sm"><code>unknown[]</code></td>
                  <td className="p-4 text-sm">Liste de valeurs pour les opérateurs 'in' et 'not_in'</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Opérateurs de filtre */}
        <div className="space-y-4">
          <DocSubSectionHeader id="filter-operators" title="Opérateurs de filtrage" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border overflow-hidden">
              <div className="bg-muted/50 p-3 border-b">
                <h4 className="font-medium">Texte</h4>
              </div>
              <div className="p-4 space-y-2 text-sm">
                <div><code>contains</code> - Contient le texte</div>
                <div><code>starts_with</code> - Commence par</div>
                <div><code>ends_with</code> - Finit par</div>
                <div><code>equals</code> - Égalité exacte</div>
                <div><code>not_equals</code> - Différent de</div>
              </div>
            </div>
            <div className="rounded-lg border overflow-hidden">
              <div className="bg-muted/50 p-3 border-b">
                <h4 className="font-medium">Nombres/Dates</h4>
              </div>
              <div className="p-4 space-y-2 text-sm">
                <div><code>greater_than</code> - Plus grand que</div>
                <div><code>greater_or_equal</code> - Plus grand ou égal</div>
                <div><code>less_than</code> - Plus petit que</div>
                <div><code>less_or_equal</code> - Plus petit ou égal</div>
                <div><code>between</code> - Entre deux valeurs</div>
              </div>
            </div>
            <div className="rounded-lg border overflow-hidden">
              <div className="bg-muted/50 p-3 border-b">
                <h4 className="font-medium">Listes</h4>
              </div>
              <div className="p-4 space-y-2 text-sm">
                <div><code>in</code> - Dans une liste de valeurs</div>
                <div><code>not_in</code> - Pas dans une liste</div>
              </div>
            </div>
            <div className="rounded-lg border overflow-hidden">
              <div className="bg-muted/50 p-3 border-b">
                <h4 className="font-medium">Valeurs nulles</h4>
              </div>
              <div className="p-4 space-y-2 text-sm">
                <div><code>is_null</code> - Est nul</div>
                <div><code>is_not_null</code> - N'est pas nul</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exemples */}
      <DocSectionHeader id="examples" title="Exemples">
        📚 Exemples
      </DocSectionHeader>
      <section className="space-y-8">

        {/* Exemple de base */}
        <DocSample
          id="basic-example"
          title="🎯 Utilisation de base"
          description="DataTable avec tri, sélection et pagination. Clic simple = tri unique | Ctrl/Shift + Clic = tri multi-colonnes"
          sourceCode={getSampleSourceCode('basic-example')}
        >
          <BasicExample />
        </DocSample>

        {/* Internationalisation */}
        <DocSample
          id="i18n-example"
          title="🌍 Messages personnalisés et i18n"
          description="Personnalisation des messages du DataTable avec support de l'internationalisation. Changez la langue pour voir les messages mis à jour."
          sourceCode={getSampleSourceCode('i18n-example')}
        >
          <I18nExample />
        </DocSample>

        {/* Responsive */}
        <DocSample
          id="responsive-example"
          title="📱 Colonnes Responsives"
          description="Gestion avancée de la visibilité des colonnes selon la taille d'écran avec breakpoints personnalisés"
          sourceCode={getSampleSourceCode('responsive-example')}
        >
          <ResponsiveDataTableExample />
        </DocSample>

        {/* Filtrage */}
        <DocSample
          id="filtering-example"
          title="🔍 Filtrage avancé"
          description="Système de filtres uniformes avec opérateurs (contains, equals, between, etc.) pour tous types de données"
          sourceCode={getSampleSourceCode('filtering-example')}
        >
          <FilteringExample />
        </DocSample>

        {/* Modes de pagination */}
        <DocSample
          id="pagination-modes-example"
          title="📄 Modes de pagination"
          description="Différents modes de pagination : None, InfiniteScroll, Pagination simple, Pagination avec contrôle de taille"
          sourceCode={getSampleSourceCode('pagination-modes-example')}
        >
          <PaginationModesExample />
        </DocSample>

        {/* Groupement */}
        <DocSample
          id="grouping-example"
          title="📊 Groupement de données"
          description="Groupement des données par colonnes avec en-têtes personnalisables et états d'expansion"
          sourceCode={getSampleSourceCode('grouping-example')}
        >
          <GroupingExample />
        </DocSample>

        {/* Icônes personnalisées */}
        <DocSample
          id="custom-sort-icons-example"
          title="🎨 Icônes de tri personnalisées"
          description="Configuration d'icônes personnalisées pour les différents états de tri avec classes CSS"
          sourceCode={getSampleSourceCode('custom-sort-icons-example')}
        >
          <CustomSortIconsExample />
        </DocSample>
      </section>
    </div>
  )
}
