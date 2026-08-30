import { useState } from 'react'

import { Toaster } from "@/components/ui/toast"

import './App.css'
import MainContainer from './layout/MainContainer'
import HeaderContainer from './layout/HeaderContainer'
import FooterContainer from './layout/FooterContainer'
import '@/i18n'

export type FooterTab = "map" | "food" | "news";

function App() {
  const [activeTab, setActiveTab] = useState<FooterTab>("map");

  return (
    <>
      <HeaderContainer />

      <MainContainer activeTab={activeTab} />

      <FooterContainer
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <Toaster />
      
    </>
  )
}

export default App
