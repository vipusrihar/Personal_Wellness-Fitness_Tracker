import { useEffect, useRef } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useUserProfile } from '../contexts/UserProfileContext'
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

import {
  FiHome, FiActivity, FiDroplet, FiTrendingUp,
  FiUser, FiSettings, FiLogOut, FiMoon, FiSun, FiX
} from 'react-icons/fi'
import { GiWeightLiftingUp } from 'react-icons/gi'
import { MdWhatshot } from 'react-icons/md';

import '../styles/Sidebar.css'

const navItems = [
  { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
  { to: '/calories', icon: <FiActivity />, label: 'Calories' },
  { to: '/hydration', icon: <FiDroplet />, label: 'Hydration' },
  { to: '/workouts', icon: <GiWeightLiftingUp />, label: 'Workouts' },
  { to: '/progress', icon: <FiTrendingUp />, label: 'Progress' },
  { to: '/profile', icon: <FiUser />, label: 'Profile' },
  { to: '/settings', icon: <FiSettings />, label: 'Settings' },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout, isOnline } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { streak } = useUserProfile();
  const navigate = useNavigate()
  const location = useLocation()
  const sidebarRef = useRef<HTMLElement>(null)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Close on route change (mobile)
  useEffect(() => {
    onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  // Focus sidebar when it opens
  useEffect(() => {
    if (open) sidebarRef.current?.focus()
  }, [open])

  // Prevent body scroll when drawer is open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop — mobile only */}
      <div
        className={`sidebar-backdrop ${open ? 'open' : ''}`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Backdrop — mobile only */}
      {open && (
        <div
          className="sidebar-backdrop open"
          onClick={onClose} /* Simple and guaranteed to catch the click */
          role="presentation"
        />
      )}

      <aside
        ref={sidebarRef}
        className={`sidebar ${open ? 'open' : ''}`}
        aria-label="Main navigation"
        tabIndex={-1}
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">
              <FiActivity />
            </span>
            <div className="logo-title">FitTrack</div>
          </div>

          {/* Close button — mobile only */}
          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="user-name">{user?.username}</div>
            <div className="user-meta">
              <span className={`online-dot ${isOnline ? 'online' : 'offline'}`} />
              {isOnline ? 'Online' : 'Offline'}
              {streak > 0 && (
                <span className="streak-badge">
                  <MdWhatshot /> {streak}
                </span>
              )}
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="btn btn-ghost btn-sm w-full"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <><FiSun /> Light Mode</> : <><FiMoon /> Dark Mode</>}
          </button>
          <button
            className="btn btn-ghost btn-sm w-full"
            onClick={handleLogout}
          >
            <FiLogOut /> Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
