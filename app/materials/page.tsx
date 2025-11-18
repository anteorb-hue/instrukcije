'use client'

import React, { useState } from 'react'
import useSWR from 'swr'
import {
  FileText,
  Video,
  Image as ImageIcon,
  Download,
  Eye,
  Upload,
  Search,
  Heart,
  Share2,
  BookOpen,
  Loader2,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function MaterialsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')

  // Build API query params
  const params = new URLSearchParams()
  if (searchQuery) params.append('search', searchQuery)
  if (selectedType !== 'all') params.append('type', selectedType.toUpperCase())
  if (selectedSubject !== 'all') params.append('subjectId', selectedSubject)
  params.append('limit', '50')

  // Fetch materials from API
  const { data, error, isLoading } = useSWR(
    `/api/materials?${params.toString()}`,
    fetcher
  )

  // Fetch subjects for filter
  const { data: subjectsData } = useSWR('/api/subjects', fetcher)

  const materials = data?.materials || []
  const subjects = subjectsData || []
  const stats = {
    totalMaterials: data?.total || 0,
    myUploads: 0, // TODO: Filter by current user
    savedMaterials: 0, // TODO: Implement favorites
    totalDownloads: materials.reduce((sum: number, m: any) => sum + (m.downloadCount || 0), 0),
  }

  const types = [
    { value: 'all', label: 'Sve', icon: <BookOpen className="w-4 h-4" /> },
    { value: 'pdf', label: 'PDF', icon: <FileText className="w-4 h-4" /> },
    { value: 'video', label: 'Video', icon: <Video className="w-4 h-4" /> },
    { value: 'image', label: 'Slike', icon: <ImageIcon className="w-4 h-4" /> },
  ]

  const getFileIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'PDF':
        return <FileText className="w-8 h-8 text-red-500" />
      case 'VIDEO':
        return <Video className="w-8 h-8 text-blue-500" />
      case 'IMAGE':
        return <ImageIcon className="w-8 h-8 text-green-500" />
      default:
        return <FileText className="w-8 h-8 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const handleDownload = async (materialId: string) => {
    try {
      // Track download
      await fetch(`/api/materials/${materialId}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: null }), // TODO: Add current user ID
      })

      // TODO: Trigger actual download
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  const handleView = async (materialId: string) => {
    try {
      // Track view
      await fetch(`/api/materials/${materialId}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: null }), // TODO: Add current user ID
      })
    } catch (error) {
      console.error('View error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Materijali za učenje</h1>
          <p className="text-gray-600">
            Pristupite tisućama resursa za učenje koje su podijelili naši instruktori
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <p className="text-2xl font-bold text-gradient">{stats.totalMaterials}</p>
            <p className="text-sm text-gray-600">Ukupno materijala</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.myUploads}</p>
            <p className="text-sm text-gray-600">Moji uploadi</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.savedMaterials}</p>
            <p className="text-sm text-gray-600">Spremljeno</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.totalDownloads}</p>
            <p className="text-sm text-gray-600">Ukupno preuzimanja</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Tip datoteke</h3>
              <div className="space-y-2">
                {types.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      selectedType === type.value
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {type.icon}
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Predmet</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedSubject('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedSubject === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Svi predmeti
                </button>
                {subjects.map((subject: any) => (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedSubject === subject.id
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {subject.name}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="gradient-bg text-white">
              <h3 className="font-semibold mb-3">Podijeli svoje materijale</h3>
              <p className="text-sm text-white/80 mb-4">
                Pomozi drugim učenicima dijeljenjem svojih bilješki i resursa
              </p>
              <Button variant="secondary" className="w-full" icon={<Upload className="w-4 h-4" />}>
                Upload materijal
              </Button>
            </Card>
          </div>

          {/* Materials Grid */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="mb-6">
              <Input
                placeholder="Pretraži materijale..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <Card className="text-center py-12">
                <p className="text-lg text-red-600">Greška pri učitavanju materijala</p>
                <p className="text-sm text-gray-500 mt-2">Molimo pokušajte ponovno</p>
              </Card>
            )}

            {/* Results */}
            {!isLoading && !error && (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Pronađeno {materials.length} materijala
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {materials.map((material: any) => (
                    <Card key={material.id} hover>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">{getFileIcon(material.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 truncate pr-2">
                              {material.title}
                            </h3>
                            <button className="flex-shrink-0 text-gray-400 hover:text-red-500">
                              <Heart className="w-5 h-5" />
                            </button>
                          </div>

                          <Badge variant="info" className="mb-2">
                            {material.subject?.name || 'Bez predmeta'}
                          </Badge>

                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {material.description || 'Nema opisa'}
                          </p>

                          {material.tags && material.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {material.tags.slice(0, 3).map((tagObj: any, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                >
                                  #{tagObj.tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div>
                              <p>{material.tutor?.name || 'Nepoznato'}</p>
                              <p>{formatFileSize(material.fileSize || 0)}</p>
                            </div>
                            <div className="text-right">
                              <p>{material.downloadCount || 0} preuzimanja</p>
                              <p>{material.viewCount || 0} pregleda</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 mt-4">
                            <Button
                              variant="primary"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleDownload(material.id)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Preuzmi
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(material.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {materials.length === 0 && (
                  <Card className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-600">Nema pronađenih materijala</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Pokušajte s drugim filterima ili pretraživanjem
                    </p>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
