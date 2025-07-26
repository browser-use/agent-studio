'use client'

import Sidebar from '@/components/Sidebar'
import MainContent from '@/components/MainContent'
import SimpleChatInterface from '@/components/SimpleChatInterface'
import { TaskProvider } from '@/context/TaskContext'
import { useTaskExecution } from '@/hooks/useTaskExecution'
import { isSimpleMode } from '@/lib/uiMode'

function AppContent() {
  useTaskExecution()

  if (isSimpleMode()) {
    return <SimpleChatInterface />
  }

  return (
    <div className="flex h-screen bg-dark-100">
      <Sidebar />
      <MainContent />
    </div>
  )
}

export default function Home() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  )
} 