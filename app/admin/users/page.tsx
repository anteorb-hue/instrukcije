'use client'

import { useState } from 'react'
import useSWR from 'swr'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import Input from '@/components/ui/Input'
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  Edit,
  Ban,
  Trash2,
  CheckCircle,
  XCircle,
  Mail,
  Shield,
  Users,
  UserCheck,
  UserX,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  Star,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Loader2,
} from 'lucide-react'

// Types
interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'ADMIN' | 'TUTOR' | 'STUDENT' | 'PARENT'
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED' | 'PENDING'
  verified: boolean
  emailVerified: boolean
  featured: boolean // NEW: Istaknut na platformi
  registeredAt: Date
  lastLogin?: Date
  totalLessons: number
  totalSpent?: number
  totalEarned?: number
  rating?: number
  profileComplete: number
}

interface ApiResponse {
  users: User[]
  total: number
  limit: number
  offset: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const usersPerPage = 10

  // Build API URL with query params
  const buildApiUrl = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.append('search', searchQuery)
    if (selectedRole !== 'all') params.append('role', selectedRole)
    params.append('limit', usersPerPage.toString())
    params.append('offset', ((currentPage - 1) * usersPerPage).toString())
    // Note: status filtering is done client-side
    return `/api/admin/users?${params.toString()}`
  }

  // Fetch users from API
  const { data, error, isLoading, mutate } = useSWR<ApiResponse>(buildApiUrl(), fetcher)

  // Client-side status filtering (API doesn't support status filter)
  const filteredUsers = data?.users.filter(user => {
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus
    return matchesStatus
  }) || []

  // Pagination
  const totalPages = Math.ceil((data?.total || 0) / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage

  // Statistics (from filtered users)
  const allUsers = data?.users || []
  const stats = {
    total: data?.total || 0,
    active: allUsers.filter(u => u.status === 'ACTIVE').length,
    suspended: allUsers.filter(u => u.status === 'SUSPENDED').length,
    pending: allUsers.filter(u => u.status === 'PENDING').length,
    tutors: allUsers.filter(u => u.role === 'TUTOR').length,
    students: allUsers.filter(u => u.role === 'STUDENT').length,
    featured: allUsers.filter(u => u.featured).length,
    totalEarnings: allUsers.reduce((sum, u) => sum + (u.totalEarned || 0), 0),
  }

  // Action Handlers
  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      await mutate()
      setShowDeleteConfirm(null)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Greška pri brisanju korisnika')
    }
  }

  const handleToggleFeatured = async (userId: string) => {
    const user = allUsers.find(u => u.id === userId)
    if (!user) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: !user.featured }),
      })

      if (!response.ok) {
        throw new Error('Failed to update featured status')
      }

      await mutate()
    } catch (error) {
      console.error('Error updating featured status:', error)
      alert('Greška pri ažuriranju istaknutog statusa')
    }
  }

  const handleToggleStatus = async (userId: string, newStatus: User['status']) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      await mutate()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Greška pri ažuriranju statusa')
    }
  }

  const handleVerifyUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verified: true }),
      })

      if (!response.ok) {
        throw new Error('Failed to verify user')
      }

      await mutate()
    } catch (error) {
      console.error('Error verifying user:', error)
      alert('Greška pri verifikaciji korisnika')
    }
  }

  const getRoleColor = (role: string) => {
    const colors = {
      ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
      TUTOR: 'bg-blue-100 text-blue-800 border-blue-200',
      STUDENT: 'bg-green-100 text-green-800 border-green-200',
      PARENT: 'bg-orange-100 text-orange-800 border-orange-200',
    }
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800',
      SUSPENDED: 'bg-yellow-100 text-yellow-800',
      BANNED: 'bg-red-100 text-red-800',
      PENDING: 'bg-gray-100 text-gray-800',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('hr-HR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('hr-HR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id))
    }
  }

  const handleBulkAction = async (action: string) => {
    if (action === 'verify') {
      for (const id of selectedUsers) {
        await handleVerifyUser(id)
      }
    } else if (action === 'suspend') {
      for (const id of selectedUsers) {
        await handleToggleStatus(id, 'SUSPENDED')
      }
    } else if (action === 'activate') {
      for (const id of selectedUsers) {
        await handleToggleStatus(id, 'ACTIVE')
      }
    } else if (action === 'delete') {
      if (confirm(`Jeste li sigurni da želite obrisati ${selectedUsers.length} korisnika?`)) {
        for (const id of selectedUsers) {
          await handleDeleteUser(id)
        }
      }
    }
    setSelectedUsers([])
    await mutate()
  }

  const handleRefresh = async () => {
    await mutate()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Superadmin Panel</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Potpuna kontrola nad svim korisnicima i instruktorima
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" onClick={handleRefresh} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Pretraži po imenu ili emailu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button
                variant={showFilters ? 'default' : 'outline'}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filteri
              </Button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">Sve uloge</option>
                  <option value="ADMIN">Admin</option>
                  <option value="TUTOR">Instruktor</option>
                  <option value="STUDENT">Učenik</option>
                  <option value="PARENT">Roditelj</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">Svi statusi</option>
                  <option value="ACTIVE">Aktivan</option>
                  <option value="SUSPENDED">Suspendiran</option>
                  <option value="BANNED">Bannan</option>
                  <option value="PENDING">Na čekanju</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-3 text-gray-600">Učitavanje korisnika...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-6 mb-6 bg-red-50 border-red-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Greška pri učitavanju</h3>
                <p className="text-sm text-red-700">Nije moguće učitati korisnike. Pokušajte ponovno.</p>
              </div>
            </div>
          </Card>
        )}

        {/* Content */}
        {!isLoading && !error && (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
              <Card className="p-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-600">Ukupno</p>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <UserCheck className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                  <p className="text-xs text-gray-600">Aktivni</p>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Ban className="h-4 w-4 text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.suspended}</p>
                  <p className="text-xs text-gray-600">Suspendirani</p>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  <p className="text-xs text-gray-600">Pending</p>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.tutors}</p>
                  <p className="text-xs text-gray-600">Instruktori</p>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.students}</p>
                  <p className="text-xs text-gray-600">Učenici</p>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Star className="h-4 w-4 text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.featured}</p>
                  <p className="text-xs text-gray-600">Istaknuti</p>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.totalEarnings)}</p>
                  <p className="text-xs text-gray-600">Tot. zarada</p>
                </div>
              </Card>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <Card className="p-4 mb-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedUsers.length} korisnika odabrano
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('verify')}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verificiraj
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('activate')}>
                      <UserCheck className="h-4 w-4 mr-1" />
                      Aktiviraj
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('suspend')}>
                      <Ban className="h-4 w-4 mr-1" />
                      Suspendiraj
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('email')}>
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('delete')}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Obriši
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setSelectedUsers([])}>
                      Otkaži
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Users Table */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                          onChange={toggleSelectAll}
                          className="rounded text-primary-600"
                        />
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Korisnik
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Uloga
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Registriran
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Zadnja prijava
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                        Aktivnost
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">
                        Akcije
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                            className="rounded text-primary-600"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              {user.avatar && <img src={user.avatar} alt={user.name} />}
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-900">{user.name}</p>
                                {user.verified && (
                                  <CheckCircle className="h-4 w-4 text-blue-600" title="Verificiran" />
                                )}
                                {user.featured && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" title="Istaknut" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(user.registeredAt)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {user.lastLogin ? formatDate(user.lastLogin) : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">{user.totalLessons} lekcija</p>
                            {user.role === 'TUTOR' && user.totalEarned && (
                              <p className="text-green-600 font-semibold">{formatCurrency(user.totalEarned)}</p>
                            )}
                            {(user.role === 'STUDENT' || user.role === 'PARENT') && user.totalSpent && (
                              <p className="text-gray-600">{formatCurrency(user.totalSpent)}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2 relative">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Pogledaj detalje"
                            >
                              <Eye className="h-4 w-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Više opcija"
                            >
                              <MoreVertical className="h-4 w-4 text-gray-600" />
                            </button>

                            {/* Action Menu Dropdown */}
                            {showActionMenu === user.id && (
                              <div className="absolute right-0 top-12 z-20 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px]">
                                <button
                                  onClick={() => {
                                    handleToggleFeatured(user.id)
                                    setShowActionMenu(null)
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Star className="h-4 w-4" />
                                  {user.featured ? 'Ukloni istaknutog' : 'Označi kao istaknut'}
                                </button>
                                {!user.verified && (
                                  <button
                                    onClick={() => {
                                      handleVerifyUser(user.id)
                                      setShowActionMenu(null)
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    Verificiraj
                                  </button>
                                )}
                                {user.status === 'ACTIVE' && (
                                  <button
                                    onClick={() => {
                                      handleToggleStatus(user.id, 'SUSPENDED')
                                      setShowActionMenu(null)
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-yellow-600"
                                  >
                                    <Ban className="h-4 w-4" />
                                    Suspendiraj
                                  </button>
                                )}
                                {user.status === 'ACTIVE' && (
                                  <button
                                    onClick={() => {
                                      handleToggleStatus(user.id, 'BANNED')
                                      setShowActionMenu(null)
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-600"
                                  >
                                    <UserX className="h-4 w-4" />
                                    Bannaj
                                  </button>
                                )}
                                {(user.status === 'SUSPENDED' || user.status === 'BANNED') && (
                                  <button
                                    onClick={() => {
                                      handleToggleStatus(user.id, 'ACTIVE')
                                      setShowActionMenu(null)
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-green-600"
                                  >
                                    <UserCheck className="h-4 w-4" />
                                    Aktiviraj
                                  </button>
                                )}
                                <div className="border-t border-gray-200 my-1"></div>
                                <button
                                  onClick={() => {
                                    setShowDeleteConfirm(user.id)
                                    setShowActionMenu(null)
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Obriši korisnika
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Prikazano {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} od{' '}
                    {data?.total || 0} korisnika
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                      const pageNum = i + 1
                      return (
                        <Button
                          key={i}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Potvrdi brisanje</h3>
                <p className="text-sm text-gray-600">Ova akcija se ne može poništiti</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Jeste li sigurni da želite trajno obrisati ovog korisnika? Svi podaci će biti izgubljeni.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Otkaži
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={() => handleDeleteUser(showDeleteConfirm)}
              >
                Obriši
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Detalji korisnika</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  {selectedUser.avatar && <img src={selectedUser.avatar} alt={selectedUser.name} />}
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className={getRoleColor(selectedUser.role)}>
                      {selectedUser.role}
                    </Badge>
                    <Badge className={getStatusColor(selectedUser.status)}>
                      {selectedUser.status}
                    </Badge>
                    {selectedUser.verified && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verificiran
                      </Badge>
                    )}
                    {selectedUser.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Istaknut
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Ukupno lekcija</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedUser.totalLessons}</p>
                </div>
                {selectedUser.totalEarned && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Ukupna zarada</p>
                    <p className="text-2xl font-bold text-green-700">{formatCurrency(selectedUser.totalEarned)}</p>
                  </div>
                )}
                {selectedUser.totalSpent && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Ukupna potrošnja</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedUser.totalSpent)}</p>
                  </div>
                )}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Profil potpunost</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${selectedUser.profileComplete}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{selectedUser.profileComplete}%</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 flex-wrap">
                <Button className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Pošalji email
                </Button>
                <Button variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Uredi
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    await handleToggleFeatured(selectedUser.id)
                    setSelectedUser(prev => prev ? { ...prev, featured: !prev.featured } : null)
                  }}
                >
                  <Star className="h-4 w-4 mr-2" />
                  {selectedUser.featured ? 'Ukloni istaknutog' : 'Označi istaknut'}
                </Button>
                {selectedUser.status === 'ACTIVE' ? (
                  <Button variant="outline" onClick={async () => {
                    await handleToggleStatus(selectedUser.id, 'SUSPENDED')
                    setSelectedUser(prev => prev ? { ...prev, status: 'SUSPENDED' } : null)
                  }}>
                    <Ban className="h-4 w-4 mr-2" />
                    Suspendiraj
                  </Button>
                ) : (
                  <Button variant="outline" onClick={async () => {
                    await handleToggleStatus(selectedUser.id, 'ACTIVE')
                    setSelectedUser(prev => prev ? { ...prev, status: 'ACTIVE' } : null)
                  }}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aktiviraj
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() => {
                    setShowDeleteConfirm(selectedUser.id)
                    setSelectedUser(null)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Obriši
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Click outside to close action menu */}
      {showActionMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowActionMenu(null)}
        />
      )}
    </div>
  )
}
