'use client'

import { Clock, FileText, Globe, CheckCircle, Share2, Download, ExternalLink } from 'lucide-react'
import { useTask } from '@/context/TaskContext'

export default function OverviewTab() {
  const { state } = useTask()

  const completedSteps = state.steps.length || 0
  const totalSteps = state.taskStatus === 'finished' ? completedSteps : (completedSteps || 0)
  const filesGenerated = state.generatedFiles.length
  
  const duration = state.startTime && state.endTime 
    ? Math.floor((new Date(state.endTime).getTime() - new Date(state.startTime).getTime()) / 1000)
    : state.startTime 
    ? Math.floor((Date.now() - new Date(state.startTime).getTime()) / 1000)
    : 0

  const handleShare = async () => {
    try {
      // Use Browser Use public share URL if available, otherwise use current URL
      const shareUrl = state.publicShareUrl || window.location.href
      await navigator.clipboard.writeText(shareUrl)
      alert('Share link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy link:', error)
      alert('Failed to copy link to clipboard')
    }
  }

  if (!state.isRunning && !state.summary && completedSteps === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-dark-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Results Yet</h3>
          <p className="text-gray-400">
            Research summary will appear here once complete
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-dark-200 border border-dark-300 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Steps Completed</p>
                <p className="text-2xl font-bold text-white">{completedSteps}/{totalSteps}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-dark-200 border border-dark-300 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Files Generated</p>
                <p className="text-2xl font-bold text-white">{filesGenerated}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <div className="bg-dark-200 border border-dark-300 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Task Status</p>
                <p className="text-2xl font-bold text-white capitalize">{state.taskStatus || 'Ready'}</p>
              </div>
              <Globe className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-dark-200 border border-dark-300 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Duration</p>
                <p className="text-2xl font-bold text-white">{duration}s</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Company Header */}
        {state.companyName && (
          <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{state.companyName}</h1>
                {state.website && (
                  <a 
                    href={state.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 flex items-center space-x-1"
                  >
                    <span>{state.website}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              
              {/* Share Action */}
              <div className="flex space-x-2">
                {state.publicShareUrl ? (
                  <div className="flex items-center space-x-2">
                    <a
                      href={state.output.public_share_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Public Share</span>
                    </a>
                    <button
                      onClick={handleShare}
                      className="bg-dark-300 hover:bg-dark-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Copy Link</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleShare}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Public Share URL Display */}
        {state.publicShareUrl && (
          <div className="bg-dark-200 border border-dark-300 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-white mb-1">Public Share URL</h3>
                <p className="text-xs text-gray-400 truncate max-w-md">{state.publicShareUrl}</p>
              </div>
                              <div className="flex items-center space-x-2">
                  <a
                    href={state.publicShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 text-sm"
                  >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={handleShare}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Research Summary */}
        <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Executive Summary</h2>
          
          {state.executionSummary ? (
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                {state.executionSummary}
              </div>
            </div>
          ) : state.isRunning ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-300">Generating comprehensive analysis summary...</span>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-dark-300 rounded animate-pulse"></div>
                <div className="h-4 bg-dark-300 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-dark-300 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Analysis summary will be generated upon completion.</p>
          )}
        </div>

        {/* Key Findings (Mock Data) */}
        {completedSteps > 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Funding Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Funding:</span>
                  <span className="text-white font-medium">$50M+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Round:</span>
                  <span className="text-white font-medium">Series B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Investors:</span>
                  <span className="text-white font-medium">8 Total</span>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Team Insights</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Team Size:</span>
                  <span className="text-white font-medium">150+ employees</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Leadership:</span>
                  <span className="text-white font-medium">5 executives</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Engineering:</span>
                  <span className="text-white font-medium">60% of team</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 