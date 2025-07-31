'use client'

import { useState, useEffect } from 'react'
import { Clock, CheckCircle, Monitor, Eye, ZoomIn } from 'lucide-react'
import { useTask } from '@/context/TaskContext'

export default function StepsTab() {
  const { state } = useTask()
  const [screenshots, setScreenshots] = useState<Record<string, string | null>>({})
  const [loadingScreenshots, setLoadingScreenshots] = useState<Record<string, boolean>>({})
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null)

  // Auto-load screenshots for completed steps
  useEffect(() => {
    if (state.taskId && state.steps.length > 0 && state.taskStatus === 'finished') {
      console.log('🎬 [STEPS TAB] Task completed, starting to fetch screenshots for', state.steps.length, 'steps')
      state.steps.forEach((step, index) => {
        // Add a small delay between requests to avoid overwhelming the API
        setTimeout(() => fetchScreenshot(step.id), index * 500)
      })
    }
  }, [state.taskId, state.taskStatus, state.steps.length])

  // Function to fetch screenshot for a step
  const fetchScreenshot = async (stepId: string) => {
    if (!state.taskId || screenshots[stepId] !== undefined || loadingScreenshots[stepId]) {
      return // Already loaded, loading, or no task ID
    }

    setLoadingScreenshots(prev => ({ ...prev, [stepId]: true }))

    try {
      console.log('🖼️ [STEPS TAB] Fetching screenshot for step:', stepId)
      const response = await fetch(`/api/task/screenshots/${state.taskId}/${stepId}`)
      
      if (response.ok) {
        const contentType = response.headers.get('content-type')
        
        if (contentType?.startsWith('image/')) {
          // Direct image response
          const blob = await response.blob()
          const imageUrl = URL.createObjectURL(blob)
          setScreenshots(prev => ({ ...prev, [stepId]: imageUrl }))
          console.log('✅ [STEPS TAB] Screenshot loaded for step:', stepId)
        } else {
          // JSON response with screenshot URL
          const data = await response.json()
          if (data.screenshot_url) {
            setScreenshots(prev => ({ ...prev, [stepId]: data.screenshot_url }))
            console.log('✅ [STEPS TAB] Screenshot URL received for step:', stepId)
          } else {
            setScreenshots(prev => ({ ...prev, [stepId]: null }))
            console.log('❌ [STEPS TAB] No screenshot URL in response for step:', stepId)
          }
        }
      } else {
        setScreenshots(prev => ({ ...prev, [stepId]: null }))
        console.log('❌ [STEPS TAB] Failed to fetch screenshot for step:', stepId, response.status)
      }
    } catch (error) {
      console.error('❌ [STEPS TAB] Error fetching screenshot for step:', stepId, error)
      setScreenshots(prev => ({ ...prev, [stepId]: null }))
    } finally {
      setLoadingScreenshots(prev => ({ ...prev, [stepId]: false }))
    }
  }

  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString()
    } catch {
      return 'Unknown time'
    }
  }

  if (state.steps.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-dark-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Steps Yet</h3>
          <p className="text-gray-400">
            Automation steps and screenshots will appear here as the task progresses
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-dark-300 bg-dark-100">
        {/* Header with Live Browser suggestion */}
        <div className="mb-6 p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <Monitor className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-white font-medium">Live Browser View Available</h3>
              <p className="text-sm text-gray-300 mt-1">
                For real-time visual feedback, check out the <strong>Live Browser</strong> tab to see automation in action!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Steps Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Steps List */}
          <div className="space-y-4">
            {state.steps.map((step, index) => {
              const isCompleted = !!step.evaluation_previous_goal
              const isActive = index === state.steps.length - 1 && state.isRunning

              return (
                <div
                  key={step.id}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    isActive 
                      ? 'border-primary bg-primary/5 shadow-lg' 
                      : isCompleted 
                      ? 'border-green-500/30 bg-green-500/5' 
                      : 'border-dark-300 bg-dark-200'
                  }`}
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : isActive 
                          ? 'bg-primary text-white' 
                          : 'bg-dark-400 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-medium">{step.step}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">
                          Step {step.step}
                          {isActive && <span className="text-primary ml-2">(Active)</span>}
                          {isCompleted && <span className="text-green-400 ml-2">(Completed)</span>}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {step.url ? new URL(step.url).hostname : 'Processing...'}
                        </p>
                      </div>
                    </div>
                    
                    {isActive && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <span className="text-sm text-primary">In Progress</span>
                      </div>
                    )}
                  </div>

                  {/* Step Details */}
                  <div className="space-y-3">
                    {/* Previous Goal (What was accomplished) */}
                    {step.evaluation_previous_goal && (
                      <div className="bg-dark-300 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-green-400 mb-1">✅ Completed</h4>
                        <p className="text-gray-300 text-sm">{step.evaluation_previous_goal}</p>
                      </div>
                    )}

                    {/* Next Goal (What's planned) */}
                    {step.next_goal && (
                      <div className="bg-dark-300 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-blue-400 mb-1">🎯 Next Action</h4>
                        <p className="text-gray-300 text-sm">{step.next_goal}</p>
                      </div>
                    )}

                    {/* URL if available */}
                    {step.url && (
                      <div className="bg-dark-300 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-purple-400 mb-1">🌐 Current Page</h4>
                        <a 
                          href={step.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-300 text-sm hover:text-white underline"
                        >
                          {step.url}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Screenshot Section */}
                  <div className="mt-4">
                    {loadingScreenshots[step.id] ? (
                      <div className="bg-dark-400 rounded-lg h-48 flex items-center justify-center border-2 border-dashed border-dark-300">
                        <div className="text-center text-gray-500">
                          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-sm">Loading screenshot...</p>
                        </div>
                      </div>
                    ) : screenshots[step.id] ? (
                      <div className="relative group cursor-pointer" onClick={() => setSelectedScreenshot(screenshots[step.id]!)}>
                        <img 
                          src={screenshots[step.id]!} 
                          alt={`Screenshot from Step ${step.step}`}
                          className="w-full h-auto rounded-lg object-cover border border-dark-300 max-h-64"
                          onError={() => {
                            console.error('❌ [STEPS TAB] Image failed to load for step:', step.id)
                            setScreenshots(prev => ({ ...prev, [step.id]: null }))
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-black/20 transition-opacity rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="bg-black/50 p-2 rounded-full">
                            <ZoomIn className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">Click to enlarge</p>
                      </div>
                    ) : screenshots[step.id] === null ? (
                      <div className="bg-dark-400 rounded-lg h-32 flex items-center justify-center border-2 border-dashed border-dark-300">
                        <div className="text-center text-gray-500">
                          <div className="text-2xl mb-2">📸</div>
                          <p className="text-sm">Screenshot not available</p>
                          <p className="text-xs text-blue-400 font-medium">Try Live Browser tab</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-dark-400 rounded-lg h-32 flex items-center justify-center border-2 border-dashed border-dark-300">
                        <div className="text-center text-gray-500">
                          <div className="text-2xl mb-2">
                            <Eye className="w-6 h-6 mx-auto" />
                          </div>
                          <p className="text-sm">Screenshot from Step {step.step}</p>
                          <button 
                            onClick={() => fetchScreenshot(step.id)}
                            className="mt-2 px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary/80 transition-colors"
                          >
                            Load Screenshot
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Loading state for in-progress steps */}
                  {isActive && (
                    <div className="mt-3 flex items-center space-x-2 text-sm text-gray-400">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span>Executing step...</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Summary when task is complete */}
          {state.taskStatus === 'finished' && (
            <div className="mt-6 p-4 bg-green-600/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <h3 className="text-white font-medium">Task Completed Successfully</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    All {state.steps.length} steps have been executed. Screenshots are now available above, and you can check the Overview tab for results and the Files tab for downloads.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error state */}
          {(state.taskStatus === 'failed' || state.taskStatus === 'stopped') && (
            <div className="mt-6 p-4 bg-red-600/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
                <div>
                  <h3 className="text-white font-medium">Task {state.taskStatus === 'failed' ? 'Failed' : 'Stopped'}</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    The automation task encountered an issue. You can try starting a new task.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div className="relative max-w-6xl max-h-[90vh] overflow-auto">
            <img 
              src={selectedScreenshot} 
              alt="Enlarged screenshot" 
              className="w-full h-auto rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 