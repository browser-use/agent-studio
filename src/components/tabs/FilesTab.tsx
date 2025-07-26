'use client'

import { Download, FileText, Table, FileJson, Archive, Image, Eye, ExternalLink } from 'lucide-react'
import { useTask } from '@/context/TaskContext'
import { GeneratedFile } from '@/context/TaskContext'
import { browserUseApi } from '@/lib/browserUseApi'

export default function FilesTab() {
  const { state } = useTask()

  const getFileIcon = (type: GeneratedFile['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />
      case 'excel':
        return <Table className="w-8 h-8 text-green-500" />
      case 'json':
        return <FileJson className="w-8 h-8 text-blue-500" />
      case 'zip':
        return <Archive className="w-8 h-8 text-purple-500" />
      case 'image':
        return <Image className="w-8 h-8 text-primary" />
      default:
        return <FileText className="w-8 h-8 text-gray-500" />
    }
  }

  const getFileTypeLabel = (type: GeneratedFile['type']) => {
    switch (type) {
      case 'pdf':
        return 'PDF Report'
      case 'excel':
        return 'Excel Sheet'
      case 'json':
        return 'JSON Data'
      case 'zip':
        return 'Archive'
      case 'image':
        return 'Screenshot'
      default:
        return 'File'
    }
  }

  const handleDownload = async (file: GeneratedFile) => {
    try {
      if (file.url.startsWith('http')) {
        // Direct download from Browser Use API
        const response = await fetch(file.url)
        const blob = await response.blob()
        
        // Create download link
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        // Fallback for mock files
        console.log(`Downloading ${file.name}`)
      }
    } catch (error) {
      console.error('Error downloading file:', error)
      alert('Failed to download file. Please try again.')
    }
  }

  const handlePreview = (file: GeneratedFile) => {
    if (file.url.startsWith('http')) {
      // Open file in new tab for preview
      window.open(file.url, '_blank')
    } else {
      // Mock preview functionality
      console.log(`Previewing ${file.name}`)
      alert('Preview functionality will open the file in a new tab once research is completed.')
    }
  }

  const handleBulkDownload = () => {
    // Download all files
    state.generatedFiles.forEach((file: any) => {
      setTimeout(() => handleDownload(file), 100) // Small delay between downloads
    })
  }

  const handleShareCollection = () => {
    // Generate shareable link (mock functionality)
    const shareUrl = `${window.location.origin}/task/shared/${state.taskId || 'unknown'}`
    navigator.clipboard.writeText(shareUrl)
    alert('Shareable link copied to clipboard!')
  }

  if (!state.generatedFiles || state.generatedFiles.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-dark-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <Download className="w-12 h-12 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Files Yet</h3>
          <p className="text-gray-400">
            Generated files and reports will appear here during research
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Generated Files</h2>
          <p className="text-gray-400">
            {state.generatedFiles.length} file{state.generatedFiles.length !== 1 ? 's' : ''} generated during automation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.generatedFiles.map((file: any) => (
            <div
              key={file.id}
              className="bg-dark-200 border border-dark-300 rounded-lg p-6 hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                      {file.name}
                    </h3>
                    <p className="text-sm text-gray-400">{getFileTypeLabel(file.type)}</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                {file.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span>{file.size}</span>
                <span>{new Date(file.createdAt).toLocaleString()}</span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handlePreview(file)}
                  className="flex-1 bg-dark-300 hover:bg-dark-400 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => handleDownload(file)}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Actions */}
        {state.generatedFiles.length > 1 && (
          <div className="mt-8 p-4 bg-dark-200 border border-dark-300 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white mb-1">Bulk Actions</h3>
                <p className="text-sm text-gray-400">Download multiple files at once</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={handleBulkDownload}
                  className="bg-dark-300 hover:bg-dark-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Archive className="w-4 h-4" />
                  <span>Download All</span>
                </button>
                <button 
                  onClick={handleShareCollection}
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Share Collection</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 