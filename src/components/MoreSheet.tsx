import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiTrendingUp, FiUser, FiSettings, FiX } from 'react-icons/fi'
import '../styles/MoreSheet.css'

interface MoreSheetProps {
  open: boolean
  onClose: () => void
}

const MORE_ITEMS = [
  { to: '/progress',  icon: <FiTrendingUp />, label: 'Progress',  desc: 'Charts & history' },
  { to: '/profile',   icon: <FiUser />,       label: 'Profile',   desc: 'Goals & body stats' },
  { to: '/settings',  icon: <FiSettings />,   label: 'Settings',  desc: 'App preferences' },
]

export default function MoreSheet({ open, onClose }: MoreSheetProps) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const sheetRef  = useRef<HTMLDivElement>(null)

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Trap focus inside when open
  useEffect(() => {
    if (open) sheetRef.current?.focus()
  }, [open])

  // Close sheet when navigation completes (route changed)
  useEffect(() => {
    if (open) onClose()
    // Only run on location change, not on open toggle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const handleNavigate = (to: string) => {
    navigate(to)
    // onClose fires via the location effect above — no double call needed
  }

  return (
    <div
      className={`more-backdrop ${open ? 'open' : ''}`}
      onClick={handleBackdropClick}
      aria-hidden={!open}
    >
      <div
        ref={sheetRef}
        className={`more-sheet ${open ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="More navigation options"
        tabIndex={-1}
      >
        {/* Handle bar */}
        <div className="sheet-handle" />

        {/* Header */}
        <div className="sheet-header">
          <span className="sheet-title">More</span>
          <button className="sheet-close" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        {/* Nav items */}
        <div className="sheet-items">
          {MORE_ITEMS.map(item => {
            const isActive = location.pathname.startsWith(item.to)
            return (
              <button
                key={item.to}
                className={`sheet-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavigate(item.to)}
              >
                <span className={`sheet-item-icon ${isActive ? 'active' : ''}`}>
                  {item.icon}
                </span>
                <span className="sheet-item-text">
                  <span className="sheet-item-label">{item.label}</span>
                  <span className="sheet-item-desc">{item.desc}</span>
                </span>
                {isActive && <span className="sheet-item-dot" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}