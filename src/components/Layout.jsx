import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { useTheme } from '../context/ThemeContext'

const Layout = ({children}) => {
  return (
    <div className="min-h-screen bg-bg text-text-primary transition-colors duration-300">
      <Header/> 
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 h-[calc(100vh-56px)] overflow-y-auto custom-scrollbar">
            {children}
        </main>

      </div>
    </div>
  )
}

export default Layout
