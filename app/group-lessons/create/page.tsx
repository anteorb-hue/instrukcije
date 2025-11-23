'use client'

import React, { useState } from 'react'
import {
  Users,
  Calendar,
  Clock,
  Video,
  DollarSign,
  BookOpen,
  Tag,
  FileText,
  Upload,
  X,
  Plus,
  AlertCircle,
  CheckCircle,
  Save,
  Eye,
  ArrowLeft,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import { useRouter } from 'next/navigation'

interface Material {
  id: string
  name: string
  file?: File
}

export default function CreateGroupLessonPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subject, setSubject] = useState('')
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [type, setType] = useState<'group-lesson' | 'webinar'>('group-lesson')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [duration, setDuration] = useState(60)
  const [maxParticipants, setMaxParticipants] = useState(10)
  const [pricePerPerson, setPricePerPerson] = useState(50)
  const [location, setLocation] = useState('Online - Zoom')
  const [hasRecording, setHasRecording] = useState(true)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [requirements, setRequirements] = useState<string[]>(['Stabilna internet veza'])
  const [requirementInput, setRequirementInput] = useState('')
  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>([])
  const [learningInput, setLearningInput] = useState('')
  const [materials, setMaterials] = useState<Material[]>([])

  const subjects = [
    'Matematika',
    'Fizika',
    'Kemija',
    'Biologija',
    'Hrvatski jezik',
    'Engleski jezik',
    'Njemački jezik',
    'Povijest',
    'Geografija',
    'Informatika',
    'Programiranje',
    'Ekonomija',
    'Psihologija',
  ]

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleAddRequirement = () => {
    if (requirementInput.trim() && !requirements.includes(requirementInput.trim())) {
      setRequirements([...requirements, requirementInput.trim()])
      setRequirementInput('')
    }
  }

  const handleRemoveRequirement = (requirement: string) => {
    setRequirements(requirements.filter((r) => r !== requirement))
  }

  const handleAddLearning = () => {
    if (learningInput.trim() && !whatYouWillLearn.includes(learningInput.trim())) {
      setWhatYouWillLearn([...whatYouWillLearn, learningInput.trim()])
      setLearningInput('')
    }
  }

  const handleRemoveLearning = (learning: string) => {
    setWhatYouWillLearn(whatYouWillLearn.filter((l) => l !== learning))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newMaterials = Array.from(files).map((file) => ({
        id: Math.random().toString(),
        name: file.name,
        file,
      }))
      setMaterials([...materials, ...newMaterials])
    }
  }

  const handleRemoveMaterial = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id))
  }

  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return title.trim() !== '' && description.trim() !== '' && subject !== ''
      case 2:
        return startDate !== '' && startTime !== '' && duration > 0
      case 3:
        return maxParticipants > 0 && pricePerPerson > 0
      case 4:
        return whatYouWillLearn.length > 0
      default:
        return true
    }
  }

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    } else {
      alert('Molimo popunite sva obavezna polja')
    }
  }

  const handlePrevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      alert('Molimo popunite sva obavezna polja')
      return
    }

    // Simulate API call
    alert('Grupna lekcija uspješno kreirana! Bit će objavljena nakon pregleda.')
    router.push('/group-lessons')
  }

  const handleSaveDraft = () => {
    alert('Nacrt spremljen! Možete nastaviti kasnije.')
    router.push('/dashboard')
  }

  const totalRevenue = pricePerPerson * maxParticipants

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/group-lessons')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Povratak na grupne lekcije
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kreiraj novu grupnu lekciju
          </h1>
          <p className="text-gray-600">
            Podijeli svoje znanje s više učenika odjednom i povećaj svoju zaradu
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Osnovni podaci' },
              { num: 2, label: 'Datum i vrijeme' },
              { num: 3, label: 'Polaznici i cijena' },
              { num: 4, label: 'Program' },
              { num: 5, label: 'Pregled' },
            ].map((s, index) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 ${
                      step >= s.num
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step > s.num ? <CheckCircle className="w-6 h-6" /> : s.num}
                  </div>
                  <span
                    className={`text-xs text-center ${
                      step >= s.num ? 'text-primary-600 font-medium' : 'text-gray-600'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {index < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 mb-6 ${
                      step > s.num ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Osnovni podaci o lekciji
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Naslov lekcije *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="npr. Priprema za maturu - Matematika"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opis lekcije *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detaljno opiši što ćeš pokrivati na lekciji, za koga je namijenjena, što će polaznici naučiti..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={6}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">{description.length}/1000 znakova</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Predmet *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Odaberi predmet</option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razina *
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as 'OSNOVNA_SKOLA' | 'SREDNJA_SKOLA' | 'FAKULTET' | 'OSTALO')}
                    className="input-field"
                    required
                  >
                    <option value="beginner">Početnik</option>
                    <option value="intermediate">Srednji</option>
                    <option value="advanced">Napredni</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tip lekcije *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setType('group-lesson')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      type === 'group-lesson'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Users className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                    <p className="font-medium">Grupna lekcija</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Interaktivna lekcija s manje polaznika
                    </p>
                  </button>
                  <button
                    onClick={() => setType('webinar')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      type === 'webinar'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Video className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="font-medium">Webinar</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Prezentacija za veću grupu polaznika
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagovi (za lakše pronalaženje)
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Dodaj tag..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button variant="outline" onClick={handleAddTag}>
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                      <button onClick={() => handleRemoveTag(tag)} className="ml-2">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Kada će se održati lekcija?
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Datum *
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vrijeme *
                  </label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trajanje (minute) *
                </label>
                <div className="grid grid-cols-4 gap-4">
                  {[60, 90, 120, 180].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`p-3 border-2 rounded-lg transition-all ${
                        duration === d
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold">{d} min</p>
                      <p className="text-xs text-gray-600">{d / 60}h</p>
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                    placeholder="Prilagođeno trajanje..."
                    min={15}
                    max={360}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokacija / Platforma
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input-field"
                >
                  <option value="Online - Zoom">Online - Zoom</option>
                  <option value="Online - Google Meet">Online - Google Meet</option>
                  <option value="Online - Microsoft Teams">Online - Microsoft Teams</option>
                  <option value="Online - Ostalo">Online - Ostalo</option>
                  <option value="Uživo">Uživo</option>
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasRecording}
                    onChange={(e) => setHasRecording(e.target.checked)}
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Omogući snimanje</p>
                    <p className="text-sm text-gray-600">
                      Lekcija će biti snimljena i dostupna polaznicima 30 dana
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Participants & Pricing */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Polaznici i cijena
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maksimalan broj polaznika *
                </label>
                <Input
                  type="number"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(parseInt(e.target.value) || 1)}
                  min={1}
                  max={100}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Preporučeno: {type === 'webinar' ? '20-50' : '5-15'} polaznika za{' '}
                  {type === 'webinar' ? 'webinar' : 'grupnu lekciju'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cijena po polazniku (kn) *
                </label>
                <Input
                  type="number"
                  value={pricePerPerson}
                  onChange={(e) => setPricePerPerson(parseInt(e.target.value) || 0)}
                  min={0}
                  step={10}
                  icon={<DollarSign className="w-5 h-5" />}
                  required
                />
              </div>

              {/* Revenue Calculator */}
              <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
                <h3 className="font-semibold text-gray-900 mb-4">Kalkulator prihoda</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Cijena po osobi</p>
                    <p className="text-2xl font-bold text-primary-600">{pricePerPerson} kn</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Maksimalno polaznika</p>
                    <p className="text-2xl font-bold text-secondary-600">
                      {maxParticipants}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Potencijalni prihod</p>
                    <p className="text-2xl font-bold text-green-600">{totalRevenue} kn</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white/60 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Tvoja zarada:</strong>{' '}
                    {Math.round(totalRevenue * 0.85)} kn (85% od ukupnog prihoda)
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Platforma zadržava 15% za održavanje usluge
                  </p>
                </div>
              </Card>

              {/* Pricing Tips */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 mb-2">Savjeti za određivanje cijene</p>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Grupne lekcije su 40-60% jeftinije od individualnih</li>
                      <li>• Prosječna cijena za {subject || 'predmet'}: 50-80 kn/osobi</li>
                      <li>• Više polaznika = niža cijena po osobi = veća kompetitivnost</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Program */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Program i materijali
              </h2>

              {/* What You'll Learn */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Što će polaznici naučiti? *
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <Input
                    value={learningInput}
                    onChange={(e) => setLearningInput(e.target.value)}
                    placeholder="npr. Sve tipove funkcija i njihova svojstva"
                    onKeyPress={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), handleAddLearning())
                    }
                  />
                  <Button variant="outline" onClick={handleAddLearning}>
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {whatYouWillLearn.map((learning, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="flex-1 text-sm text-gray-700">{learning}</p>
                      <button onClick={() => handleRemoveLearning(learning)}>
                        <X className="w-4 h-4 text-gray-400 hover:text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
                {whatYouWillLearn.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    Dodaj barem jednu stvar koju će polaznici naučiti
                  </p>
                )}
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Što polaznici trebaju za lekciju?
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <Input
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    placeholder="npr. Bilježnica i olovka"
                    onKeyPress={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())
                    }
                  />
                  <Button variant="outline" onClick={handleAddRequirement}>
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {requirements.map((requirement, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <p className="flex-1 text-sm text-gray-700">{requirement}</p>
                      <button onClick={() => handleRemoveRequirement(requirement)}>
                        <X className="w-4 h-4 text-gray-400 hover:text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Materials Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Materijali za polaznike
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xlsx,.xls"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-700 font-medium mb-1">
                      Klikni za upload ili povuci datoteke ovdje
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, DOC, PPT, XLSX do 10 MB
                    </p>
                  </label>
                </div>
                {materials.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {materials.map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-600 mr-3" />
                          <span className="text-sm text-gray-700">{material.name}</span>
                        </div>
                        <button onClick={() => handleRemoveMaterial(material.id)}>
                          <X className="w-4 h-4 text-gray-400 hover:text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Preview */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Pregled lekcije prije objave
              </h2>

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Osnovni podaci</h3>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={type === 'webinar' ? 'info' : 'secondary'}>
                            {type === 'webinar' ? 'Webinar' : 'Grupna lekcija'}
                          </Badge>
                          <Badge variant="warning">
                            {level === 'advanced'
                              ? 'Napredni'
                              : level === 'intermediate'
                              ? 'Srednji'
                              : 'Početnik'}
                          </Badge>
                          {hasRecording && <Badge variant="success">Snimka dostupna</Badge>}
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
                        <p className="text-sm text-gray-700 mb-2">{description}</p>
                        <p className="text-sm text-gray-600">
                          <BookOpen className="w-4 h-4 inline mr-1" />
                          {subject}
                        </p>
                      </div>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Raspored</h3>
                  <div className="p-4 bg-gray-50 rounded-lg grid md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Datum</p>
                        <p className="font-medium text-gray-900">
                          {startDate
                            ? new Date(startDate).toLocaleDateString('hr-HR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })
                            : '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Vrijeme i trajanje</p>
                        <p className="font-medium text-gray-900">
                          {startTime || '-'} ({duration} min)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Participants & Pricing */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Polaznici i cijena</h3>
                  <div className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Maksimalno polaznika</p>
                        <p className="text-2xl font-bold text-primary-600">
                          {maxParticipants}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Cijena po osobi</p>
                        <p className="text-2xl font-bold text-secondary-600">
                          {pricePerPerson} kn
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Ukupni prihod</p>
                        <p className="text-2xl font-bold text-green-600">{totalRevenue} kn</p>
                      </div>
                    </div>
                    <div className="p-3 bg-white/60 rounded">
                      <p className="text-sm font-medium text-gray-900">
                        Tvoja zarada: {Math.round(totalRevenue * 0.85)} kn
                      </p>
                    </div>
                  </div>
                </div>

                {/* Program */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Program</h3>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                    {whatYouWillLearn.length > 0 && (
                      <div>
                        <p className="font-medium text-gray-900 mb-2">Što će polaznici naučiti:</p>
                        <ul className="space-y-1">
                          {whatYouWillLearn.map((item, index) => (
                            <li key={index} className="flex items-start text-sm">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {requirements.length > 0 && (
                      <div>
                        <p className="font-medium text-gray-900 mb-2">Potrebno za lekciju:</p>
                        <ul className="space-y-1">
                          {requirements.map((item, index) => (
                            <li key={index} className="flex items-start text-sm">
                              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2 mt-1.5 flex-shrink-0" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {materials.length > 0 && (
                      <div>
                        <p className="font-medium text-gray-900 mb-2">
                          Materijali ({materials.length}):
                        </p>
                        <ul className="space-y-1">
                          {materials.map((material) => (
                            <li key={material.id} className="flex items-center text-sm">
                              <FileText className="w-4 h-4 text-gray-600 mr-2" />
                              <span className="text-gray-700">{material.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900 mb-1">Sljedeći koraci</p>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Lekcija će biti pregledana u roku od 24h</li>
                        <li>• Dobit ćeš obavijest kada bude odobrena</li>
                        <li>• Možeš uređivati lekciju do 48h prije početka</li>
                        <li>• Dobiti će biti isplaćene 7 dana nakon održavanja</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={handlePrevStep}>
                <ArrowLeft className="w-5 h-5 mr-2" />
                Natrag
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={handleSaveDraft}>
              <Save className="w-5 h-5 mr-2" />
              Spremi nacrt
            </Button>
            {step < 5 ? (
              <Button variant="primary" onClick={handleNextStep}>
                Dalje
                <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
              </Button>
            ) : (
              <Button variant="primary" onClick={handleSubmit}>
                <CheckCircle className="w-5 h-5 mr-2" />
                Objavi lekciju
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
