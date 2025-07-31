'use client'

import { useEffect, useState } from 'react'
import { Monitor, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react'
import { useTask } from '@/context/TaskContext'

export default function LiveBrowserTab() {
  const { state } = useTask()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setIframeKey(prev => prev + 1)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const openInNewTab = () => {
    if (state.liveUrl) {
      window.open(state.liveUrl, '_blank', 'noopener,noreferrer')
    }
  }

  if (!state.isRunning && !state.liveUrl) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-dark-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <Monitor className="w-12 h-12 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Live Browser Session</h3>
          <p className="text-gray-400">
            Start a research task to see the live browser automation in action
          </p>
        </div>
      </div>
    )
  }

  if (state.isRunning && !state.liveUrl) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Setting Up Browser Session</h3>
          <p className="text-gray-400">
            Initializing live browser view... This may take a few moments
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with controls */}
      <div className="bg-dark-200 border-b border-dark-300 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
              <Monitor className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Live Browser View</h2>
              <p className="text-sm text-gray-400">Real-time automation in progress</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-dark-300 hover:bg-dark-400 disabled:opacity-50 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              title="Refresh browser view"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            
            <button
              onClick={openInNewTab}
              className="bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Open</span>
            </button>
          </div>
        </div>
        
        {/* URL Display */}
        {state.liveUrl && (
          <div className="mt-3 p-2 bg-dark-300 rounded border border-dark-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Live URL:</span>
              <span className="text-xs text-white font-mono truncate flex-1">{state.liveUrl}</span>
            </div>
          </div>
        )}
      </div>

      {/* Browser iframe */}
      <div className="flex-1 bg-dark-100 relative">
        {state.liveUrl ? (
          <iframe
            key={iframeKey}
            src={state.liveUrl}
            className="w-full h-full border-0"
            title="Live Browser View"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            onLoad={() => setIsRefreshing(false)}
            onError={() => setIsRefreshing(false)}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Browser URL Not Available</h3>
              <p className="text-gray-400 text-sm">
                The live browser URL is not yet available. This may take a few moments after starting the task.
              </p>
            </div>
          </div>
        )}
        
        {/* Loading overlay */}
        {isRefreshing && (
          <div className="absolute inset-0 bg-dark-100/80 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-white text-sm">Refreshing browser view...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Status indicator */}
      <div className="bg-dark-200 border-t border-dark-300 p-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              state.taskStatus === 'running' ? 'bg-green-400 animate-pulse' :
              state.taskStatus === 'finished' ? 'bg-blue-400' :
              state.taskStatus === 'failed' || state.taskStatus === 'stopped' ? 'bg-red-400' :
              'bg-gray-400'
            }`}></div>
            <span className="text-gray-400">
              Status: <span className="text-white capitalize">{state.taskStatus || 'Unknown'}</span>
            </span>
          </div>
          
          {state.steps.length > 0 && (
            <span className="text-gray-400">
              Step {state.steps.length} {state.taskStatus === 'running' ? 'in progress' : 'completed'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
} 