'use client'

import { useState, useEffect } from 'react'
import { FileText, Camera, Download, Monitor } from 'lucide-react'
import OverviewTab from './tabs/OverviewTab'
import StepsTab from './tabs/StepsTab'
import FilesTab from './tabs/FilesTab'
import LiveBrowserTab from './tabs/LiveBrowserTab'
import { useTask } from '@/context/TaskContext'

type TabType = 'overview' | 'steps' | 'files' | 'live'

const tabs = [
  { id: 'overview' as TabType, label: 'Overview', icon: FileText },
  { id: 'live' as TabType, label: 'Live Browser', icon: Monitor },
  { id: 'steps' as TabType, label: 'Steps & Screenshots', icon: Camera },
  { id: 'files' as TabType, label: 'Files & Downloads', icon: Download },
]

export default function MainContent() {
  const { state } = useTask()
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  // Auto-switch to Live Browser tab when live URL becomes available
  useEffect(() => {
    if (state.liveUrl && state.isRunning && activeTab === 'overview') {
      setActiveTab('live')
    }
  }, [state.liveUrl, state.isRunning, activeTab])

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />
      case 'live':
        return <LiveBrowserTab />
      case 'steps':
        return <StepsTab />
      case 'files':
        return <FilesTab />
      default:
        return <OverviewTab />
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-dark-100">
      {/* Tab Navigation */}
      <div className="border-b border-dark-300 bg-dark-200">
        <div className="flex space-x-1 p-1 mx-6 mt-6">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-dark-300'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
                {/* Add live indicator for Live Browser tab */}
                {tab.id === 'live' && state.liveUrl && state.isRunning && (
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </button>
            )
          })}
        </div>
        <div className="h-px bg-dark-300 mt-4" />
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  )
} 