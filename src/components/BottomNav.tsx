import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import '../styles/BottomNav.css'
import {
  FiHome,
  FiActivity,
  FiDroplet,
  FiMoreHorizontal,
} from 'react-icons/fi'
import { GiWeightLiftingUp } from 'react-icons/gi'
import MoreSheet from './MoreSheet'

const navItems = [
  { to: '/dashboard', icon: <FiHome />, label: 'Home' },
  { to: '/calories', icon: <FiActivity />, label: 'Calories' },
  { to: '/hydration', icon: <FiDroplet />, label: 'Water' },
  { to: '/workouts', icon: <GiWeightLiftingUp />, label: 'Workouts' },
]

// Pages that live inside the More sheet — used to highlight the More tab
// when the user is on one of these routes
const MORE_ROUTES = ['/progress', '/profile', '/settings']

export default function BottomNav() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const location = useLocation()

  const moreIsActive = MORE_ROUTES.some(r => location.pathname.startsWith(r))

  return (
    <>
      <nav className="bottom-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="icon-wrapper">{item.icon}</div>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}

        {/* More tab — not a NavLink, just a button that opens the sheet */}
        <button
          className={`nav-item more-tab ${moreIsActive || sheetOpen ? 'active' : ''}`}
          onClick={() => setSheetOpen(true)}
          aria-label="More options"
          aria-expanded={sheetOpen}
        >
          <div className="icon-wrapper">
            <FiMoreHorizontal />
          </div>
          <span className="nav-label">More</span>
        </button>
      </nav>

      <MoreSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  )
}