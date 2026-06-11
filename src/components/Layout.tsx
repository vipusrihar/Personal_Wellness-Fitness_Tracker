import React from 'react'
import { Outlet } from 'react-router-dom'
import '../styles/Layout.css'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import Header from './Header'

export default function Layout(): React.JSX.Element {
  return (
    <div className="app-layout">
      {/* Sidebar for Desktop layouts */}
      <Sidebar />
      
      <div className="app-content-wrapper">
        {/* Header sits naturally at the top */}
        <Header pageTitle="Fitness Tracker" />
        
        {/* Main scrollable content view */}
        <main className="app-main">
          <Outlet />
        </main>
      </div>

      {/* Navigation sits naturally at the bottom */}
      <BottomNav />
    </div>
  )
}