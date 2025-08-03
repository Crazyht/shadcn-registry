import { DataTable } from '../data-table'
import { defineColumn } from '../data-table-types'
import { z } from 'zod'

// Schéma pour les données d'exemple
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  department: z.string(),
  role: z.string(),
  status: z.enum(['active', 'inactive', 'pending']),
  salary: z.number(),
  lastLogin: z.string(),
})

type User = z.infer<typeof UserSchema>

// Données d'exemple
const sampleUsers: User[] = [
  {
    id: 1,
    name: "Marie Dubois",
    email: "marie.dubois@example.com",
    phone: "+33 1 23 45 67 89",
    department: "IT",
    role: "Developer",
    status: "active",
    salary: 55000,
    lastLogin: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Jean Martin",
    email: "jean.martin@example.com",
    phone: "+33 1 98 76 54 32",
    department: "Marketing",
    role: "Manager",
    status: "active",
    salary: 65000,
    lastLogin: "2024-01-14T16:45:00Z"
  },
  {
    id: 3,
    name: "Sophie Leroy",
    email: "sophie.leroy@example.com",
    phone: "+33 1 11 22 33 44",
    department: "HR",
    role: "Specialist",
    status: "inactive",
    salary: 48000,
    lastLogin: "2024-01-10T09:15:00Z"
  },
  {
    id: 4,
    name: "Pierre Moreau",
    email: "pierre.moreau@example.com",
    phone: "+33 1 55 66 77 88",
    department: "Finance",
    role: "Analyst",
    status: "pending",
    salary: 52000,
    lastLogin: "2024-01-12T14:20:00Z"
  }
]

export function ResponsiveDataTableExample() {
  // Configuration des colonnes avec gestion responsive
  const userColumn = defineColumn<User, typeof UserSchema>(UserSchema)
  const columns = [
    userColumn('id', {
      label: "ID",
      isSortable: true,
      responsive: {
        medias: ['Desktop'], // Visible uniquement sur desktop
        widthMode: "content" as const,
        width: "60px"
      }
    }),
    userColumn('name', {
      label: "Nom",
      isSortable: true,
      responsive: {
        // Pas de medias défini = visible partout
        widthMode: "range" as const,
        minWidth: "120px",
        maxWidth: "200px"
      }
    }),
    userColumn('email', {
      label: "Email",
      isSortable: true,
      responsive: {
        medias: ['Tablet', 'Desktop'], // Masqué sur mobile
        widthMode: "fill" as const,
        minWidth: "150px"
      }
    }),
    userColumn('phone', {
      label: "Téléphone",
      responsive: {
        medias: ['Mobile'], // Visible uniquement sur mobile
        widthMode: "content" as const,
        width: "120px"
      }
    }),
    userColumn('department', {
      label: "Département",
      isSortable: true,
      responsive: {
        medias: [{ min: '900px' }], // Media query personnalisée
        widthMode: "content" as const,
        width: "120px"
      }
    }),
    userColumn('role', {
      label: "Rôle",
      responsive: {
        medias: ['Tablet', 'Desktop'],
        widthMode: "content" as const,
        width: "100px"
      }
    }),
    userColumn('status', {
      label: "Statut",
      render: (value) => {
        const statusColors = {
          active: 'text-green-600 bg-green-100',
          inactive: 'text-red-600 bg-red-100',
          pending: 'text-orange-600 bg-orange-100'
        }
        const status = value as keyof typeof statusColors
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {status}
          </span>
        )
      },
      responsive: {
        medias: ['Mobile', 'Desktop'], // Visible sur mobile et desktop, pas tablette
        widthMode: "content" as const,
        width: "80px"
      }
    }),
    userColumn('salary', {
      label: "Salaire",
      render: (value) => new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(value),
      responsive: {
        medias: [{ min: '1200px' }], // Visible uniquement sur grands écrans
        widthMode: "content" as const,
        width: "100px"
      }
    }),
    userColumn('lastLogin', {
      label: "Dernière connexion",
      render: (value) => new Date(value).toLocaleDateString('fr-FR'),
      responsive: {
        medias: [{ min: '768px', max: '1200px' }], // Visible entre 768px et 1200px
        widthMode: "content" as const,
        width: "120px"
      }
    }),
    // Colonne Actions sans path spécifique
    {
      label: "Actions",
      path: undefined,
      render: () => (
        <div className="flex gap-2">
          <button className="text-blue-600 hover:text-blue-800 text-sm">Modifier</button>
          <button className="text-red-600 hover:text-red-800 text-sm">Supprimer</button>
        </div>
      ),
      responsive: {
        // Visible partout
        widthMode: "content" as const,
        width: "120px"
      }
    }
  ]

  // Fonction pour récupérer les données
  const getData = async () => {
    // Simulation d'un appel API
    return {
      data: sampleUsers,
      totalCount: sampleUsers.length
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">DataTable avec colonnes responsives</h3>
        <p className="text-sm text-muted-foreground">
          Redimensionnez votre fenêtre pour voir les colonnes s'adapter automatiquement :
        </p>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li><strong>Mobile (&lt; 640px)</strong> : Nom, Téléphone, Statut, Actions</li>
          <li><strong>Tablet (640px - 1024px)</strong> : + Email, Rôle, Dernière connexion</li>
          <li><strong>Desktop (&gt; 1024px)</strong> : + ID, Département (900px+), Salaire (1200px+)</li>
        </ul>
      </div>

      <DataTable
        schema={UserSchema}
        columns={columns}
        getData={getData}
        paginationMode="None"
        messages={{
          emptyMessage: "Aucun utilisateur trouvé"
        }}
      />
    </div>
  )
}
