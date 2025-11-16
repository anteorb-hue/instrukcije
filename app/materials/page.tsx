'use client'

import React, { useState } from 'react'
import {
  FileText,
  Video,
  Image as ImageIcon,
  Download,
  Eye,
  Upload,
  Search,
  Filter,
  Heart,
  Share2,
  Bookmark,
  BookOpen,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import { formatFileSize } from '@/lib/utils'

export default function MaterialsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')

  const materials = [
    {
      id: '1',
      title: 'Derivacije - Kompletni vodič',
      type: 'pdf',
      subject: 'Matematika',
      tutor: 'Ana Horvat',
      size: '2.4 MB',
      downloads: 234,
      uploadDate: '2025-01-15',
      description: 'Kompletni vodič kroz derivacije sa primjerima i zadacima',
      thumbnail: null,
      tags: ['derivacije', 'kalkulus', 'matematika'],
      saved: true,
    },
    {
      id: '2',
      title: 'English Grammar - Present Tenses',
      type: 'video',
      subject: 'Engleski jezik',
      tutor: 'Marko Novak',
      size: '45.2 MB',
      downloads: 456,
      uploadDate: '2025-01-14',
      description: 'Video lekcija o svim present tense oblicima u engleskom',
      thumbnail: null,
      tags: ['grammar', 'tenses', 'english'],
      saved: false,
    },
    {
      id: '3',
      title: 'React Hooks - Cheat Sheet',
      type: 'pdf',
      subject: 'Programiranje',
      tutor: 'Petra Kovačić',
      size: '1.8 MB',
      downloads: 789,
      uploadDate: '2025-01-13',
      description: 'Sažetak svih React hooks sa primjerima korištenja',
      thumbnail: null,
      tags: ['react', 'hooks', 'javascript'],
      saved: true,
    },
    {
      id: '4',
      title: 'Periodični sustav elemenata - Plakat',
      type: 'image',
      subject: 'Kemija',
      tutor: 'Ivan Babić',
      size: '5.1 MB',
      downloads: 345,
      uploadDate: '2025-01-12',
      description: 'Visokokvalitetni plakat periodičnog sustava',
      thumbnail: null,
      tags: ['kemija', 'elementi', 'periodični sustav'],
      saved: false,
    },
    {
      id: '5',
      title: 'Mikroekonomija - Bilješke sa predavanja',
      type: 'pdf',
      subject: 'Ekonomija',
      tutor: 'Lucija Marić',
      size: '3.2 MB',
      downloads: 123,
      uploadDate: '2025-01-11',
      description: 'Kompletne bilješke sa predavanja mikroekonomije',
      thumbnail: null,
      tags: ['ekonomija', 'mikroekonomija', 'bilješke'],
      saved: false,
    },
  ]

  const stats = {
    totalMaterials: 1234,
    myUploads: 12,
    savedMaterials: 45,
    totalDownloads: 3456,
  }

  const subjects = ['Matematika', 'Engleski jezik', 'Programiranje', 'Kemija', 'Ekonomija', 'Fizika']
  const types = [
    { value: 'all', label: 'Sve', icon: <BookOpen className="w-4 h-4" /> },
    { value: 'pdf', label: 'PDF', icon: <FileText className="w-4 h-4" /> },
    { value: 'video', label: 'Video', icon: <Video className="w-4 h-4" /> },
    { value: 'image', label: 'Slike', icon: <ImageIcon className="w-4 h-4" /> },
  ]

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />
      case 'video':
        return <Video className="w-8 h-8 text-blue-500" />
      case 'image':
        return <ImageIcon className="w-8 h-8 text-green-500" />
      default:
        return <FileText className="w-8 h-8 text-gray-500" />
    }
  }

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = selectedType === 'all' || material.type === selectedType
    const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject

    return matchesSearch && matchesType && matchesSubject
  })

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
            <p className="text-sm text-gray-600">Moja preuzimanja</p>
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
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedSubject === subject
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {subject}
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

            {/* Results */}
            <div className="mb-4 text-sm text-gray-600">
              Pronađeno {filteredMaterials.length} materijala
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMaterials.map((material) => (
                <Card key={material.id} hover>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">{getFileIcon(material.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 truncate pr-2">
                          {material.title}
                        </h3>
                        <button
                          className={`flex-shrink-0 ${
                            material.saved ? 'text-red-500' : 'text-gray-400'
                          }`}
                        >
                          <Heart
                            className={`w-5 h-5 ${material.saved ? 'fill-current' : ''}`}
                          />
                        </button>
                      </div>

                      <Badge variant="info" className="mb-2">
                        {material.subject}
                      </Badge>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {material.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {material.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div>
                          <p>{material.tutor}</p>
                          <p>{material.size}</p>
                        </div>
                        <div className="text-right">
                          <p>{material.downloads} preuzimanja</p>
                          <p>{material.uploadDate}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-4">
                        <Button variant="primary" size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-1" />
                          Preuzmi
                        </Button>
                        <Button variant="outline" size="sm">
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

            {filteredMaterials.length === 0 && (
              <Card className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600">Nema pronađenih materijala</p>
                <p className="text-sm text-gray-500 mt-2">
                  Pokušajte s drugim filterima ili pretraživanjem
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
