import { useState } from 'react'
import { Tab } from '@/components/atoms'

export const UserSectionTabs = () => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="flex w-[300px] ring-2 ring-outline-variant mb-4 rounded">
      <Tab isActive={activeTab === 0} onClick={() => setActiveTab(0)}>
        Operadores
      </Tab>
      <Tab isActive={activeTab === 1} onClick={() => setActiveTab(1)}>
        Supervisores
      </Tab>
    </div>
  )
}