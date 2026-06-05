import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSettings } from 'react-icons/fi'
import '../styles/Header.css'

interface HeaderProps {
  pageTitle: string;
}

export default function Header({ pageTitle }: HeaderProps): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      {/* Profile trigger */}
      <div 
        className="profile-trigger" 
        onClick={() => navigate('/profile')}
        role="button"
        tabIndex={0}
      >
        <img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
          alt="Profile" 
          className="header-avatar"
        />
      </div>

      <h1 className="page-title">{pageTitle}</h1>

      {/* Settings Action */}
      <button 
        className="settings-btn" 
        onClick={() => navigate('/settings')} 
        aria-label="Settings"
      >
        <FiSettings />
      </button>
    </header>
  )
}