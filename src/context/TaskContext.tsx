// Context for managing task execution state and actions
'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

// Browser Use API Step structure
export interface TaskStep {
  id: string
  step: number
  evaluation_previous_goal: string
  next_goal: string
  url: string
}

export interface GeneratedFile {
  id: string
  name: string
  type: 'pdf' | 'excel' | 'json' | 'zip' | 'image'
  size: string
  url: string
  description: string
  createdAt: string
}

export interface TaskState {
  isRunning: boolean
  steps: TaskStep[]
  currentStepIndex: number
  generatedFiles: GeneratedFile[]
  executionSummary: string | null
  startTime: string | null
  endTime: string | null
  taskId: string | null
  taskStatus: string | null
  output: any | null
  liveUrl: string | null
  publicShareUrl: string | null
}

export type TaskAction =
  | { type: 'START_TASK'; taskId: string }
  | { type: 'UPDATE_TASK_STATUS'; taskData: any }
  | { type: 'ADD_FILE'; file: GeneratedFile }
  | { type: 'COMPLETE_TASK'; summary: string }
  | { type: 'RESET_TASK' }

const initialState: TaskState = {
  isRunning: false,
  steps: [],
  currentStepIndex: 0,
  generatedFiles: [],
  executionSummary: null,
  startTime: null,
  endTime: null,
  taskId: null,
  taskStatus: null,
  output: null,
  liveUrl: null,
  publicShareUrl: null
}

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'START_TASK':
      return {
        ...state,
        isRunning: true,
        taskId: action.taskId,
        startTime: new Date().toISOString(),
        endTime: null,
        executionSummary: null,
        steps: [],
        generatedFiles: [],
        taskStatus: 'created',
        output: null,
        liveUrl: null,
        publicShareUrl: null
      }
    case 'UPDATE_TASK_STATUS':
      return {
        ...state,
        taskStatus: action.taskData.taskStatus,
        steps: action.taskData.steps || [],
        output: action.taskData.output,
        liveUrl: action.taskData.liveUrl,
        publicShareUrl: action.taskData.publicShareUrl
      }
    case 'ADD_FILE':
      return {
        ...state,
        generatedFiles: [...state.generatedFiles, action.file]
      }
    case 'COMPLETE_TASK':
      return {
        ...state,
        isRunning: false,
        executionSummary: action.summary,
        endTime: new Date().toISOString()
      }
    case 'RESET_TASK':
      return initialState
    
    default:
      return state
  }
}

interface TaskContextType {
  state: TaskState
  dispatch: React.Dispatch<TaskAction>
  startTask: (companyName: string, website?: string) => Promise<void>
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  const startTask = async (companyName: string, website?: string) => {
    try {
      // This will be called from the hook, which will handle the API call
      // The hook will dispatch START_TASK with the taskId
    } catch (error) {
      console.error('Failed to start task:', error)
    }
  }

  return (
    <TaskContext.Provider value={{ state, dispatch, startTask }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTask() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider')
  }
  return context
} 