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

  // Helper function to replace "Unknown" with "N/A"
  const formatValue = (value: string | string[] | undefined | null): string => {
    if (!value || value === "Unknown") return "N/A"
    if (Array.isArray(value)) {
      if (value.length === 0 || (value.length === 1 && value[0] === "Unknown")) return "N/A"
      return value.filter(v => v !== "Unknown").join(", ") || "N/A"
    }
    return value
  }

  // Parse structured output
  let structuredData = null
  if (state.output) {
    try {
      structuredData = typeof state.output === 'string' ? JSON.parse(state.output) : state.output
    } catch (error) {
      console.error('Failed to parse structured output:', error)
    }
  }

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
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-dark-200 border border-dark-300 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Steps Completed</p>
                <p className="text-white text-xl font-semibold">{completedSteps}/{totalSteps}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-dark-200 border border-dark-300 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Files Generated</p>
                <p className="text-white text-xl font-semibold">{filesGenerated}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-dark-200 border border-dark-300 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                state.taskStatus === 'finished' 
                  ? 'bg-green-600/20' 
                  : state.taskStatus === 'running'
                  ? 'bg-blue-600/20'
                  : state.taskStatus === 'failed' || state.taskStatus === 'stopped'
                  ? 'bg-red-600/20'
                  : 'bg-gray-600/20'
              }`}>
                <Globe className={`w-5 h-5 ${
                  state.taskStatus === 'finished' 
                    ? 'text-green-400' 
                    : state.taskStatus === 'running'
                    ? 'text-blue-400'
                    : state.taskStatus === 'failed' || state.taskStatus === 'stopped'
                    ? 'text-red-400'
                    : 'text-gray-400'
                }`} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Task Status</p>
                <p className="text-white text-xl font-semibold capitalize">
                  {state.taskStatus || 'Unknown'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-dark-200 border border-dark-300 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Duration</p>
                <p className="text-white text-xl font-semibold">{duration}s</p>
              </div>
            </div>
          </div>
        </div>

        {/* Public Share URL */}
        {state.publicShareUrl && (
          <div className="bg-dark-200 border border-dark-300 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Public Share URL</h3>
                <p className="text-gray-400 text-sm mt-1 font-mono">{state.publicShareUrl}</p>
              </div>
              
              {/* Share Action */}
              <div className="flex space-x-2">
                {state.publicShareUrl ? (
                  <div className="flex items-center space-x-2">
                    <a
                      href={state.publicShareUrl}
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
                    <span>Share Results</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Executive Summary */}
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

        {/* Structured Data Results */}
        {structuredData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Funding Overview */}
            {structuredData.funding_summary && (
              <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Funding Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Funding:</span>
                    <span className="text-white font-medium">{formatValue(structuredData.funding_summary.total_funding)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Round:</span>
                    <span className="text-white font-medium">{formatValue(structuredData.funding_summary.last_round)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Round Amount:</span>
                    <span className="text-white font-medium">{formatValue(structuredData.funding_summary.last_round_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Valuation:</span>
                    <span className="text-white font-medium">{formatValue(structuredData.funding_summary.valuation)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Investors:</span>
                    <span className="text-white font-medium">{formatValue(structuredData.funding_summary.investors)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Funding Date:</span>
                    <span className="text-white font-medium">{formatValue(structuredData.funding_summary.funding_date)}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Team Insights */}
            {structuredData.team_summary && (
              <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Team Insights</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Team Size:</span>
                    <span className="text-white font-medium">{formatValue(structuredData.team_summary.team_size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Leadership:</span>
                    <span className="text-white font-medium">{formatValue(structuredData.team_summary.leadership)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Key Executives:</span>
                    <span className="text-white font-medium">{formatValue(structuredData.team_summary.key_executives)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Founders:</span>
                    <span className="text-white font-medium">{formatValue(structuredData.team_summary.founders)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Company Overview */}
            {structuredData.company_overview && (
              <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Company Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Founded:</span>
                    <span className="text-white font-medium">{formatValue(structuredData.company_overview.founded)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Headquarters:</span>
                    <span className="text-white font-medium">{formatValue(structuredData.company_overview.headquarters)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Industry:</span>
                    <span className="text-white font-medium">{formatValue(structuredData.company_overview.industry)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Employee Count:</span>
                    <span className="text-white font-medium">{formatValue(structuredData.company_overview.employee_count)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Website:</span>
                    <span className="text-white font-medium">{formatValue(structuredData.company_overview.website)}</span>
                  </div>
                </div>
                {structuredData.company_overview.description && structuredData.company_overview.description !== "Unknown" && (
                  <div className="mt-4 pt-4 border-t border-dark-300">
                    <span className="text-gray-400 text-sm">Description:</span>
                    <p className="text-white text-sm mt-1">{structuredData.company_overview.description}</p>
                  </div>
                )}
              </div>
            )}

            {/* Market Analysis */}
            {structuredData.market_analysis && (
              <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Market Analysis</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Size:</span>
                    <span className="text-white font-medium">{formatValue(structuredData.market_analysis.market_size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Position:</span>
                    <span className="text-white font-medium">{formatValue(structuredData.market_analysis.market_position)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Competitors:</span>
                    <span className="text-white font-medium">{formatValue(structuredData.market_analysis.competitors)}</span>
                  </div>
                </div>
                {structuredData.market_analysis.competitive_advantage && structuredData.market_analysis.competitive_advantage !== "Unknown" && (
                  <div className="mt-4 pt-4 border-t border-dark-300">
                    <span className="text-gray-400 text-sm">Competitive Advantage:</span>
                    <p className="text-white text-sm mt-1">{structuredData.market_analysis.competitive_advantage}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Show mock data only if no structured data is available and steps > 2 */}
        {!structuredData && completedSteps > 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Funding Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Funding:</span>
                  <span className="text-white font-medium">N/A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Round:</span>
                  <span className="text-white font-medium">N/A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Investors:</span>
                  <span className="text-white font-medium">N/A</span>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-200 border border-dark-300 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Team Insights</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Team Size:</span>
                  <span className="text-white font-medium">N/A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Leadership:</span>
                  <span className="text-white font-medium">N/A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Engineering:</span>
                  <span className="text-white font-medium">N/A</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 