'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Loader2, AlertCircle, ExternalLink, ZoomIn } from 'lucide-react'
import { useTask } from '@/context/TaskContext'

export default function StepsTab() {
  const { state } = useTask()
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null)
  const [screenshots, setScreenshots] = useState<Record<string, string | null>>({})
  const [loadingScreenshots, setLoadingScreenshots] = useState<Record<string, boolean>>({})

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'in-progress':
        return <Loader2 className="w-6 h-6 text-primary animate-spin" />
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />
      default:
        return <Clock className="w-6 h-6 text-gray-500" />
    }
  }

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

  // Effect to fetch screenshots when steps are available
  useEffect(() => {
    if (state.taskId && state.steps.length > 0 && state.taskStatus === 'finished') {
      console.log('🎬 [STEPS TAB] Task completed, starting to fetch screenshots for', state.steps.length, 'steps')
      state.steps.forEach((step, index) => {
        // Add a small delay between requests to avoid overwhelming the API
        setTimeout(() => fetchScreenshot(step.id), index * 500)
      })
    }
  }, [state.taskId, state.taskStatus, state.steps.length])

  if (state.steps.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-dark-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Steps Yet</h3>
          <p className="text-gray-400">
            Automation steps and screenshots will appear here during execution
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Automation Steps Timeline</h2>
        
        <div className="space-y-6">
          {state.steps.map((step, index) => {
            const isLast = index === state.steps.length - 1
            const isCompleted = state.taskStatus === 'finished' || index < state.steps.length - 1
            const isInProgress = state.taskStatus === 'running' && index === state.steps.length - 1
            
            return (
              <div key={step.id} className="relative">
                {/* Timeline Line */}
                {!isLast && (
                  <div className="absolute left-6 top-16 w-0.5 h-full bg-dark-300"></div>
                )}
                
                <div className={`bg-dark-200 border rounded-lg p-6 transition-all duration-300 ${
                  isInProgress
                    ? 'border-primary shadow-lg shadow-primary/20'
                    : isCompleted
                    ? 'border-green-500/30'
                    : 'border-dark-300'
                }`}>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getStepIcon(isCompleted ? 'completed' : isInProgress ? 'in-progress' : 'pending')}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`text-lg font-semibold ${
                          isCompleted ? 'text-green-400' :
                          isInProgress ? 'text-primary' :
                          'text-gray-300'
                        }`}>
                          Step {step.step}
                        </h3>
                        
                        <div className="flex items-center space-x-3 text-sm text-gray-400">
                          <span className="bg-dark-300 px-2 py-1 rounded text-xs">#{step.step}</span>
                        </div>
                      </div>
                      
                      {/* Next Goal */}
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-300 mb-1">Goal:</h4>
                        <p className="text-gray-200">{step.next_goal}</p>
                      </div>
                      
                      {/* Previous Goal Evaluation */}
                      {step.evaluation_previous_goal && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-1">Previous Step Result:</h4>
                          <p className="text-gray-400 text-sm">{step.evaluation_previous_goal}</p>
                        </div>
                      )}
                      
                      {/* URL */}
                      {step.url && step.url !== 'about:blank' && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Current Page:</h4>
                          <div className="bg-dark-300 rounded-lg p-3">
                            <div className="flex items-center space-x-2 text-sm">
                              <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" />
                              <a 
                                href={step.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 truncate"
                                title={step.url}
                              >
                                {step.url}
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Screenshot */}
                      <div className="relative">
                        {loadingScreenshots[step.id] ? (
                          <div className="bg-dark-400 rounded-lg h-48 flex items-center justify-center border-2 border-dashed border-dark-300">
                            <div className="text-center text-gray-500">
                              <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-primary" />
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
                          <div className="bg-dark-400 rounded-lg h-48 flex items-center justify-center border-2 border-dashed border-dark-300">
                            <div className="text-center text-gray-500">
                              <div className="text-4xl mb-2">📸</div>
                              <p className="text-sm">Screenshot from Step {step.step}</p>
                              <p className="text-xs text-gray-600 mt-1">Screenshot not available</p>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-dark-400 rounded-lg h-48 flex items-center justify-center border-2 border-dashed border-dark-300">
                            <div className="text-center text-gray-500">
                              <div className="text-4xl mb-2">📸</div>
                              <p className="text-sm">Screenshot from Step {step.step}</p>
                              <p className="text-xs text-gray-600 mt-1">Click to load screenshot</p>
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
                      {isInProgress && (
                        <div className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Loader2 className="w-5 h-5 text-primary animate-spin" />
                            <span className="text-primary">Executing step...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Task Summary */}
        {state.taskStatus === 'finished' && (
          <div className="mt-8 p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold text-green-400">Task Completed Successfully!</h3>
                <p className="text-gray-300">All {state.steps.length} automation steps have been completed.</p>
              </div>
            </div>
          </div>
        )}
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