'use client'

import { useState } from 'react'
import { Play, Loader2, RotateCcw } from 'lucide-react'
import { useTask } from '@/context/TaskContext'
import { getAppConfig } from '@/config/automation-tasks'
import ProgressSection from './ProgressSection'

export default function Sidebar() {
  const { state, dispatch } = useTask()
  const [companyName, setCompanyName] = useState('')
  const [website, setWebsite] = useState('')
  const appConfig = getAppConfig()

  const handleStartResearch = async () => {
    if (companyName.trim()) {
      try {
        // Call API directly and get taskId
        const response = await fetch('/api/task/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companyName: companyName.trim(),
            website: website.trim() || undefined
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to start research')
        }

        const data = await response.json()
        
        console.log('🚀 Task started with taskId:', data.taskId)
        
        // Start task with taskId
        dispatch({ 
          type: 'START_TASK', 
                    taskId: data.taskId 
        })

      } catch (error) {
        console.error('Failed to start research:', error)
        alert('Failed to start research. Please check your configuration and try again.')
      }
    }
  }

  const handleReset = () => {
    dispatch({ type: 'RESET_TASK' })
    setCompanyName('')
    setWebsite('')
  }

  return (
    <div className="w-[400px] bg-dark-200 border-r border-dark-300 flex flex-col">
      {/* Logo/Branding Section */}
      <div className="p-6 border-b border-dark-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🤖</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{appConfig.title}</h1>
            <p className="text-gray-400 text-sm">{appConfig.branding.companyName}</p>
          </div>
        </div>
        
        <div className="bg-dark-300 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-white mb-2">{appConfig.branding.tagline}</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            {appConfig.description}
          </p>
        </div>
      </div>

      {/* Input Form Section */}
      <div className="p-6 border-b border-dark-300">
        <div className="space-y-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
              Company Name *
            </label>
            <input
              id="company"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. OpenAI, Stripe, Notion"
              className="w-full px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={state.isRunning}
            />
          </div>
          
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-2">
              Website (optional)
            </label>
            <input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://company.com"
              className="w-full px-3 py-2 bg-dark-300 border border-dark-400 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={state.isRunning}
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleStartResearch}
              disabled={!companyName.trim() || state.isRunning}
              className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-dark-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {state.isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{state.isRunning ? 'Researching...' : 'Start Research'}</span>
            </button>
            
            {(state.isRunning || state.steps.length > 0) && (
              <button
                onClick={handleReset}
                disabled={state.isRunning}
                className="bg-dark-400 hover:bg-dark-300 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                title="Reset Research"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="flex-1 overflow-hidden">
        <ProgressSection />
      </div>
    </div>
  )
} 