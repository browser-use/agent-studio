import { useEffect, useRef } from 'react'
import { useTask } from '@/context/TaskContext'
import { browserUseApi } from '@/lib/browserUseApi'
import type { GeneratedFile } from '@/context/TaskContext'

const generateMockSummary = (companyName: string) => {
  return `# ${companyName} Analysis Summary

## Company Overview
${companyName} is an innovative technology company that has established itself as a significant player in its market segment. Based on our comprehensive analysis, the company demonstrates strong fundamentals and promising growth trajectory.

## Key Findings
- **Market Position**: Well-positioned in a growing market segment
- **Financial Health**: Strong revenue growth and sustainable business model
- **Team**: Experienced leadership with proven track record
- **Technology**: Innovative solutions with competitive advantages

## Investment Recommendation
Based on our analysis, ${companyName} represents a compelling opportunity with strong growth potential and solid fundamentals.

*Analysis completed at ${new Date().toLocaleDateString()}*`
}

const processOutputFiles = async (outputFiles: string[], taskId: string, dispatch: any) => {
  if (!outputFiles || outputFiles.length === 0) return

  console.log('🗂️ Processing output files:', outputFiles)

  for (const fileName of outputFiles) {
    try {
      const downloadData = await browserUseApi.getFileDownloadUrl(taskId, fileName)
      
      const file: GeneratedFile = {
        id: `${taskId}-${fileName}`,
        name: fileName,
        type: fileName.includes('.pdf') ? 'pdf' : 
              fileName.includes('.xlsx') || fileName.includes('.csv') ? 'excel' :
              fileName.includes('.json') ? 'json' :
              fileName.includes('.zip') ? 'zip' : 'image',
        size: '2.1 MB', // Browser Use API doesn't provide file size
        url: downloadData.download_url,
        description: `Generated file: ${fileName}`,
        createdAt: new Date().toISOString()
      }

      dispatch({ type: 'ADD_FILE', file })
    } catch (error) {
      console.error('❌ Error processing file:', fileName, error)
    }
  }
}

const generateSummaryFromOutput = (taskData: any): string => {
  // Try to parse structured output
  if (taskData.output) {
    try {
      const parsedOutput = typeof taskData.output === 'string' ? JSON.parse(taskData.output) : taskData.output
      
      if (parsedOutput.company_overview?.name) {
        return generateMockSummary(parsedOutput.company_overview.name)
      }
    } catch (error) {
      console.log('Could not parse structured output, using mock summary')
    }
  }
  
  return generateMockSummary('the analyzed company')
}

export function useTaskExecution() {
  const { state, dispatch } = useTask()
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Clear polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  // Start polling when we have a taskId and the task is running
  useEffect(() => {
    if (state.taskId && state.isRunning) {
      console.log('🚀 Task started, beginning polling for taskId:', state.taskId)
      startPolling(state.taskId)
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [state.taskId, state.isRunning])

  const startPolling = (taskId: string) => {
    const pollInterval = 3000 // Poll every 3 seconds
    
    console.log('🔄 Starting polling for taskId:', taskId)

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const pollTimestamp = new Date().toISOString()
        console.log('📡 [FRONTEND POLLING] Starting poll for task:', {
          taskId,
          timestamp: pollTimestamp,
          pollInterval: '3000ms'
        })
        
        const taskData = await browserUseApi.getTaskStatus(taskId)
        
        console.log('📥 [FRONTEND POLLING] Received response:', {
          taskId,
          timestamp: new Date().toISOString(),
          responseReceived: !!taskData
        })
        
        console.log('📊 Received task data:', {
          status: taskData.status,
          steps: taskData.steps?.length || 0,
          output_files: taskData.output_files?.length || 0,
          live_url: taskData.live_url,
          live_url_type: typeof taskData.live_url,
          live_url_available: !!taskData.live_url,
          public_share_url: taskData.public_share_url
        })

        // Log when live_url becomes available
        if (taskData.live_url && typeof taskData.live_url === 'string' && taskData.live_url.length > 0) {
          console.log('🎥 Live URL now available:', taskData.live_url)
        }
        
        // Update task status and steps
        dispatch({
          type: 'UPDATE_TASK_STATUS',
          taskData: {
            taskStatus: taskData.status,
            steps: taskData.steps || [],
            output: taskData.output,
            liveUrl: taskData.live_url,
            outputFiles: taskData.output_files || [],
            finishedAt: taskData.finished_at,
            publicShareUrl: taskData.public_share_url
          }
        })

        // Process output files
        if (taskData.output_files && taskData.output_files.length > 0) {
          await processOutputFiles(taskData.output_files, taskId, dispatch)
        }

        // Handle task completion
        if (taskData.status === 'finished') {
          clearPolling()
          const summary = generateSummaryFromOutput(taskData)
          dispatch({ type: 'COMPLETE_TASK', summary })
        }
        
        // Handle task failure/stop
        if (taskData.status === 'failed' || taskData.status === 'stopped') {
          clearPolling()
          dispatch({ type: 'COMPLETE_TASK', summary: 'Task was stopped or failed.' })
        }

      } catch (error) {
        console.error('❌ [FRONTEND POLLING] Error polling task status:', {
          taskId,
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : error,
          errorType: error instanceof Error ? error.constructor.name : typeof error
        })
        // Continue polling unless it's a persistent error
      }
    }, pollInterval)
  }

  const clearPolling = () => {
    if (pollingIntervalRef.current) {
      console.log('⏹️ Clearing polling interval')
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }

  return null
} 