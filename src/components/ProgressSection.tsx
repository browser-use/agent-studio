'use client'

import { CheckCircle, Clock, Loader2, AlertCircle, Play } from 'lucide-react'
import { useTask } from '@/context/TaskContext'

export default function ProgressSection() {
  const { state } = useTask()

  const getTaskStatusDisplay = () => {
    switch (state.taskStatus) {
      case 'created':
        return { icon: Clock, color: 'text-blue-500', text: 'Task Created' }
      case 'running':
        return { icon: Loader2, color: 'text-primary animate-spin', text: 'Running' }
      case 'finished':
        return { icon: CheckCircle, color: 'text-green-500', text: 'Completed' }
      case 'failed':
      case 'stopped':
        return { icon: AlertCircle, color: 'text-red-500', text: 'Failed' }
      case 'paused':
        return { icon: Clock, color: 'text-yellow-500', text: 'Paused' }
      default:
        return { icon: Clock, color: 'text-gray-500', text: 'Ready' }
    }
  }

  if (!state.isRunning && !state.taskId) {
    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Real-time Progress</h3>
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">Task progress will appear here once started</p>
        </div>
      </div>
    )
  }

  const statusDisplay = getTaskStatusDisplay()
  const StatusIcon = statusDisplay.icon

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Real-time Progress</h3>
      
      {/* Task Status */}
      <div className="mb-4 p-3 bg-dark-300 rounded-lg">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-400">Task Status:</span>
          <div className="flex items-center space-x-2">
            <StatusIcon className={`w-4 h-4 ${statusDisplay.color}`} />
            <span className="text-white">{statusDisplay.text}</span>
          </div>
        </div>
        
        {state.startTime && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Started:</span>
            <span className="text-white">
              {new Date(state.startTime).toLocaleTimeString()}
            </span>
          </div>
        )}
        
        {state.endTime && (
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">Duration:</span>
            <span className="text-white">
              {Math.floor((new Date(state.endTime).getTime() - new Date(state.startTime!).getTime()) / 1000)}s
            </span>
          </div>
        )}

        {state.liveUrl && (
          <div className="mt-2">
            <a 
              href={state.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 text-sm flex items-center space-x-1"
            >
              <Play className="w-3 h-3" />
              <span>Watch Live</span>
            </a>
          </div>
        )}
      </div>

      {/* Steps from Browser Use */}
      {state.steps.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300 sticky top-0 bg-dark-200 py-2 -mx-6 px-6 z-10">Automation Steps</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {state.steps.map((step, index) => (
            <div
              key={step.id}
              className="p-3 rounded-lg border bg-dark-300 border-dark-400"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-6 h-6 bg-primary/20 border border-primary rounded-full flex items-center justify-center">
                    <span className="text-xs text-primary font-medium">{step.step}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-300 mb-1">
                    {step.evaluation_previous_goal || step.next_goal}
                  </p>
                  {step.url && (
                    <a 
                      href={step.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:text-primary/80 truncate block"
                    >
                      {step.url}
                    </a>
                  )}
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 