import { useState } from 'react'

import { Toaster } from "@/components/ui/toast"

import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import MainContainer from './layout/MainContainer'
import HeaderContainer from './layout/HeaderContainer'
import FooterContainer from './layout/FooterContainer'

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
