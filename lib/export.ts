// Export utilities for generating CSV, Excel, and PDF reports

export interface ExportOptions {
  filename: string
  data: Record<string, unknown>[]
  columns?: string[]
  format?: 'csv' | 'json'
}

// Export to CSV
export function exportToCSV(options: ExportOptions) {
  const { filename, data, columns } = options

  if (!data || data.length === 0) {
    console.warn('No data to export')
    return
  }

  // Get columns from first data item if not provided
  const cols = columns || Object.keys(data[0])

  // Create CSV header
  const header = cols.join(',')

  // Create CSV rows
  const rows = data.map(item => {
    return cols.map(col => {
      const value = item[col]
      // Handle values with commas, quotes, newlines
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }).join(',')
  })

  // Combine header and rows
  const csv = [header, ...rows].join('\n')

  // Create and download file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Export to JSON
export function exportToJSON(options: ExportOptions) {
  const { filename, data } = options

  if (!data || data.length === 0) {
    console.warn('No data to export')
    return
  }

  const json = JSON.stringify(data, null, 2)

  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.json`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Export to Excel (basic - uses CSV under the hood)
export function exportToExcel(options: ExportOptions) {
  // For true Excel export, you'd use a library like xlsx
  // This is a simplified version using CSV
  const { filename, ...rest } = options
  exportToCSV({ ...rest, filename: `${filename}.xlsx` })
}

// Print report
export function printReport(elementId: string) {
  const element = document.getElementById(elementId)
  if (!element) {
    console.warn('Element not found for printing')
    return
  }

  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    console.warn('Failed to open print window')
    return
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Report</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `)

  printWindow.document.close()
  printWindow.focus()

  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)
}

// Format data for export
export function formatDataForExport(data: Record<string, unknown>[], dateFields: string[] = []) {
  return data.map(item => {
    const formatted: Record<string, unknown> = {}

    Object.keys(item).forEach(key => {
      let value = item[key]

      // Format dates
      if (dateFields.includes(key) && value instanceof Date) {
        value = value.toLocaleDateString('hr-HR')
      }

      // Format booleans
      if (typeof value === 'boolean') {
        value = value ? 'Da' : 'Ne'
      }

      // Format null/undefined
      if (value === null || value === undefined) {
        value = ''
      }

      // Format objects (shallow)
      if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value)
      }

      formatted[key] = value
    })

    return formatted
  })
}

// Generate filename with timestamp
export function generateFilename(prefix: string, extension: string = 'csv') {
  const timestamp = new Date().toISOString().split('T')[0]
  return `${prefix}_${timestamp}.${extension}`
}
