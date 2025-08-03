// Messages par défaut pour les tests DataTable
import { DataTableMessages } from '../../data-table-types'

export const defaultTestMessages: DataTableMessages = {
  // Messages de base
  emptyMessage: "Aucune donnée disponible",
  loadingMessage: "Chargement...",

  // Pagination
  displayInfo: "Affichage de {start} à {end} sur {total} éléments",
  elementsPerPage: "Lignes par page",
  totalElements: "{total} éléments au total",

  // Tri
  sortColumnAriaLabel: "{column} - Cliquez pour trier, Ctrl/Shift+Clic pour tri multi-colonnes",

  // Filtres
  filterValuePlaceholder: "Saisir une valeur...",
  filterNumberPlaceholder: "Saisir un nombre...",
  filterSelectPlaceholder: "Sélectionner...",
  filterOperatorLabel: "Opérateur",
  filterValueLabel: "Valeur",
  filterPopupApply: "Filtrer",
  filterPopupClear: "Effacer",
  filterPopupCancel: "Annuler",

  // Opérateurs de filtrage
  filterOperatorContains: "Contient",
  filterOperatorNotEquals: "Différent de",
  filterOperatorStartsWith: "Commence par",
  filterOperatorEndsWith: "Finit par",
  filterOperatorEquals: "Égal à",
  filterOperatorGreaterThan: "Supérieur à",
  filterOperatorGreaterOrEqual: "Supérieur ou égal à",
  filterOperatorLessThan: "Inférieur à",
  filterOperatorLessOrEqual: "Inférieur ou égal à",
  filterOperatorIn: "Dans la liste",
  filterOperatorNotIn: "Pas dans la liste",
  filterOperatorIsNull: "Est vide",
  filterOperatorIsNotNull: "N'est pas vide"
}
