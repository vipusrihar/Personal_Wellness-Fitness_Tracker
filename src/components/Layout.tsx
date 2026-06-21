import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import '../styles/Layout.css'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout(): React.JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-content-wrapper">
        {/* Mobile header — hidden on desktop */}
        <Header
          pageTitle="FitTrack"
          onMenuOpen={() => setSidebarOpen(true)}
        />

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
