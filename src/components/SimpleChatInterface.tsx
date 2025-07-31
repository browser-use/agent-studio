'use client'

import React, { useState, useEffect } from 'react'
import { Send, Bot, User, FileText, Download, Loader2 } from 'lucide-react'
import { useTask } from '@/context/TaskContext'
import { getAppConfig } from '@/config/automation-tasks'

export default function SimpleChatInterface() {
  const { state, dispatch } = useTask()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{
    id: string
    type: 'user' | 'bot' | 'system'
    content: string
    files?: any[]
  }>>([])

  const appConfig = getAppConfig()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    // Start the automation task
    try {
      console.log('🚀 Starting automation task for:', input.trim())
      
      const response = await fetch('/api/task/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: input.trim(),
          website: ''
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to start automation')
      }

      const data = await response.json()
      
      dispatch({ 
        type: 'START_TASK',
        taskId: data.taskId 
      })

      // Add system message for task started
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: 'Starting automation...'
      }])

    } catch (error) {
      console.error('Failed to start automation:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error starting the automation. Please try again.'
      }])
    }
  }

  // Get current step status for loading message
  const getCurrentStepMessage = () => {
    if (!state.isRunning) return null

    if (state.steps.length === 0) {
      return 'Initializing automation...'
    }

    const currentStep = state.steps[state.steps.length - 1]
    const stepNumber = currentStep.step
    const totalSteps = state.taskStatus === 'finished' ? state.steps.length : '?'
    
    // Use the step description from Browser Use API
    const stepDescription = currentStep.next_goal || currentStep.evaluation_previous_goal || 'Processing...'
    
    return `Step ${stepNumber}/${totalSteps}: ${stepDescription}`
  }

  // Update messages when task completes
  useEffect(() => {
    if (state.taskStatus === 'finished' && state.executionSummary) {
      const botResponse = {
        id: (Date.now() + 2).toString(),
        type: 'bot' as const,
        content: state.executionSummary,
        files: state.generatedFiles
      }

      setMessages(prev => {
        // Remove any system loading messages
        const filteredMessages = prev.filter(msg => msg.type !== 'system')
        return [...filteredMessages, botResponse]
      })
    } else if (state.taskStatus === 'failed' || state.taskStatus === 'stopped') {
      setMessages(prev => {
        const filteredMessages = prev.filter(msg => msg.type !== 'system')
        return [...filteredMessages, {
          id: (Date.now() + 2).toString(),
          type: 'bot',
          content: 'The automation task encountered an issue and was stopped. Please try again with different parameters.'
        }]
      })
    }
  }, [state.taskStatus, state.executionSummary, state.generatedFiles])

  // Update system message when steps change
  useEffect(() => {
    if (state.isRunning) {
      const currentStepMessage = getCurrentStepMessage()
      if (currentStepMessage) {
        setMessages(prev => {
          // Remove previous system messages and add new one
          const filteredMessages = prev.filter(msg => msg.type !== 'system')
          return [...filteredMessages, {
            id: `system-${Date.now()}`,
            type: 'system',
            content: currentStepMessage
          }]
        })
      }
    }
  }, [state.steps, state.isRunning, state.taskStatus])

  const handleFileDownload = (file: any) => {
    window.open(file.url, '_blank')
  }

  return (
    <div className="flex flex-col h-screen bg-dark-400">
      {/* Header */}
      <div className="bg-dark-300 border-b border-dark-200 p-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
            <img 
              src="/images/logo.png" 
              alt="Browser Use Logo"
              className="w-5 h-5 object-contain"
            />
          </div>
          <h1 className="text-xl font-semibold text-white">{appConfig.branding.companyName}</h1>
        </div>
        <p className="text-sm text-gray-400 mt-1">{appConfig.instructions.simple}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
              <img 
                src="/images/logo.png" 
                alt="Browser Use Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Welcome to {appConfig.branding.companyName}</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {appConfig.description}
            </p>
            <div className="mt-6 text-sm text-gray-500">
              <p>Examples:</p>
              {appConfig.examples.map((example, index) => (
                <p key={index} className="mt-1">"{example}"</p>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-4xl flex items-start space-x-3 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user'
                    ? 'bg-primary'
                    : message.type === 'system'
                    ? 'bg-blue-600'
                    : 'bg-dark-200 border border-dark-100'
                }`}
              >
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : message.type === 'system' ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Bot className="w-4 h-4 text-primary" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={`rounded-lg p-4 ${
                  message.type === 'user'
                    ? 'bg-primary text-white'
                    : message.type === 'system'
                    ? 'bg-blue-600/20 border border-blue-500/30 text-blue-300'
                    : 'bg-dark-200 border border-dark-100 text-white'
                }`}
              >
                <div className="text-sm whitespace-pre-line">
                  {message.content}
                </div>

                {/* Files */}
                {message.files && message.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-gray-300 font-medium">Generated Files:</p>
                    {message.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between bg-dark-300 rounded p-2"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="text-xs text-white">{file.name}</span>
                          <span className="text-xs text-gray-400">({file.size})</span>
                        </div>
                        <button
                          onClick={() => handleFileDownload(file)}
                          className="text-primary hover:text-primary/80 p-1"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-dark-300 border-t border-dark-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={appConfig.instructions.simple}
            disabled={state.isRunning}
            className="flex-1 bg-dark-100 border border-dark-200 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || state.isRunning}
            className="bg-primary hover:bg-primary/90 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
        
        {state.isRunning && (
          <div className="mt-2 text-xs text-gray-400">
            Automation is running... This may take a few minutes.
          </div>
        )}
      </div>
    </div>
  )
} 