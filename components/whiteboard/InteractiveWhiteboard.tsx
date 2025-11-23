'use client'

import React, { useRef, useState, useEffect } from 'react'
import {
  Pencil,
  Eraser,
  Square,
  Circle,
  Type,
  Download,
  Trash2,
  Undo,
  Redo,
  Palette,
  Minus,
  Move
} from 'lucide-react'
import Card from '@/components/ui/Card'

type Tool = 'pencil' | 'eraser' | 'rectangle' | 'circle' | 'text' | 'line' | 'select'

export default function InteractiveWhiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState<Tool>('pencil')
  const [currentColor, setCurrentColor] = useState('#000000')
  const [lineWidth, setLineWidth] = useState(2)
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyStep, setHistoryStep] = useState(0)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  const colors = [
    '#000000', // Black
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#800080', // Purple
    '#FFFFFF', // White
  ]

  const tools = [
    { id: 'pencil' as Tool, icon: <Pencil className="w-5 h-5" />, label: 'Olovka' },
    { id: 'eraser' as Tool, icon: <Eraser className="w-5 h-5" />, label: 'Gumica' },
    { id: 'line' as Tool, icon: <Minus className="w-5 h-5" />, label: 'Linija' },
    { id: 'rectangle' as Tool, icon: <Square className="w-5 h-5" />, label: 'Pravokutnik' },
    { id: 'circle' as Tool, icon: <Circle className="w-5 h-5" />, label: 'Krug' },
    { id: 'text' as Tool, icon: <Type className="w-5 h-5" />, label: 'Tekst' },
    { id: 'select' as Tool, icon: <Move className="w-5 h-5" />, label: 'Odabir' },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Save initial state
    saveToHistory()

    return () => window.removeEventListener('resize', resizeCanvas)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveToHistory = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const newHistory = history.slice(0, historyStep + 1)
    newHistory.push(imageData)
    setHistory(newHistory)
    setHistoryStep(newHistory.length - 1)
  }

  const undo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const newStep = historyStep - 1
      ctx.putImageData(history[newStep], 0, 0)
      setHistoryStep(newStep)
    }
  }

  const redo = () => {
    if (historyStep < history.length - 1) {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const newStep = historyStep + 1
      ctx.putImageData(history[newStep], 0, 0)
      setHistoryStep(newStep)
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    saveToHistory()
  }

  const downloadCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `whiteboard-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e)
    setStartPos(pos)
    setIsDrawing(true)

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    ctx.strokeStyle = currentTool === 'eraser' ? '#FFFFFF' : currentColor
    ctx.lineWidth = currentTool === 'eraser' ? lineWidth * 4 : lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pos = getMousePos(e)

    if (currentTool === 'pencil' || currentTool === 'eraser') {
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    }
  }

  const endDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pos = getMousePos(e)

    // Draw shapes
    if (currentTool === 'line') {
      ctx.beginPath()
      ctx.moveTo(startPos.x, startPos.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    } else if (currentTool === 'rectangle') {
      ctx.strokeRect(
        startPos.x,
        startPos.y,
        pos.x - startPos.x,
        pos.y - startPos.y
      )
    } else if (currentTool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2)
      )
      ctx.beginPath()
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI)
      ctx.stroke()
    } else if (currentTool === 'text') {
      const text = prompt('Unesite tekst:')
      if (text) {
        ctx.font = `${lineWidth * 10}px Arial`
        ctx.fillStyle = currentColor
        ctx.fillText(text, pos.x, pos.y)
      }
    }

    setIsDrawing(false)
    saveToHistory()
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b">
          {/* Tools */}
          <div className="flex items-center space-x-1 border-r pr-4">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setCurrentTool(tool.id)}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool === tool.id
                    ? 'bg-primary-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                title={tool.label}
              >
                {tool.icon}
              </button>
            ))}
          </div>

          {/* Colors */}
          <div className="flex items-center space-x-1 border-r pr-4">
            <Palette className="w-5 h-5 text-gray-600 mr-1" />
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
                className={`w-8 h-8 rounded-lg border-2 transition-transform ${
                  currentColor === color
                    ? 'border-primary-600 scale-110'
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          {/* Line Width */}
          <div className="flex items-center space-x-2 border-r pr-4">
            <label className="text-sm text-gray-600">Debljina:</label>
            <input
              type="range"
              min="1"
              max="20"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value))}
              className="w-24"
            />
            <span className="text-sm text-gray-600 w-8">{lineWidth}px</span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1">
            <button
              onClick={undo}
              disabled={historyStep <= 0}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Poništi"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button
              onClick={redo}
              disabled={historyStep >= history.length - 1}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Ponovi"
            >
              <Redo className="w-5 h-5" />
            </button>
            <button
              onClick={clearCanvas}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-600"
              title="Obriši sve"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={downloadCanvas}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-green-600"
              title="Preuzmi"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative w-full" style={{ height: '500px' }}>
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            className="w-full h-full border-2 border-gray-300 rounded-lg cursor-crosshair bg-white"
          />
        </div>

        {/* Info */}
        <div className="text-sm text-gray-600 flex items-center justify-between">
          <span>
            Alat: <strong>{tools.find((t) => t.id === currentTool)?.label}</strong>
          </span>
          <span>
            Boja: <strong style={{ color: currentColor }}>{currentColor}</strong>
          </span>
        </div>
      </div>
    </Card>
  )
}
