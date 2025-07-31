/**
 * DataTable Tests - Restructured Modular Test Suite
 *
 * Cette nouvelle structure de tests divise le fichier de test monolithique original
 * en modules plus petits et maintenables, organisés par fonctionnalité :
 *
 * - basic.test.tsx         : Tests de base (rendu, validation, états)
 * - sorting.test.tsx       : Tests de tri (simple et multi-colonnes)
 * - pagination.test.tsx    : Tests de pagination (différents modes)
 * - row-selection.test.tsx : Tests de sélection de lignes
 * - grouping.test.tsx      : Tests de groupement de données
 * - filtering.test.tsx     : Tests de filtrage de colonnes
 * - infinite-scroll.test.tsx : Tests de scroll infini et "Charger plus"
 *
 * Avantages de cette restructuration :
 * - Meilleure maintenabilité du code de test
 * - Tests plus ciblés et faciles à comprendre
 * - Exécution parallèle possible des modules
 * - Réutilisation du code avec shared/test-setup.ts
 * - Amélioration de la lisibilité et de l'organisation
 */

// Import the complete modular test suite
import './__tests__'

// Note: L'ancien fichier data-table.test.tsx peut être supprimé une fois
// que cette nouvelle structure est validée et que tous les tests passent.
