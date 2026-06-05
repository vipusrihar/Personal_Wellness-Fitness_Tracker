import { NavLink, useNavigate } from 'react-router-dom'
import { useUserProfile } from '../contexts/UserProfileContext'
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

import {
  FiHome,
  FiActivity,
  FiDroplet,
  FiTrendingUp,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMoon,
  FiSun
} from 'react-icons/fi'
import { GiWeightLiftingUp } from 'react-icons/gi'

import '../styles/Sidebar.css'

const navItems = [
  { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
  { to: '/calories', icon: <FiActivity />, label: 'Calories' },
  { to: '/hydration', icon: <FiDroplet />, label: 'Hydration' },
  { to: '/workouts', icon: <GiWeightLiftingUp />, label: 'Workouts' },
  { to: '/progress', icon: <FiTrendingUp />, label: 'Progress' },
  { to: '/profile', icon: <FiUser />, label: 'Profile' },
  { to: '/settings', icon: <FiSettings />, label: 'Settings' }
]

export default function Sidebar() {
  const { user, logout, isOnline } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { streak } = useUserProfile();
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="sidebar">

      <div className="sidebar-header">
        <div className="sidebar-logo">

          <span className="logo-icon">
            <FiActivity />
          </span>

          <div>
            <div className="logo-title">FitTrack</div>
            <div className="logo-sub">Pro</div>
          </div>

        </div>
      </div>

      <div className="sidebar-user">

        <div className="user-avatar">
          {user?.username?.[0]?.toUpperCase()}
        </div>

        <div>

          <div className="user-name">
            {user?.username}
          </div>

          <div className="user-meta">

            <span className={`online-dot ${isOnline ? 'online' : 'offline'}`} />

            {isOnline ? 'Online' : 'Offline'}

            {streak > 0 && (
              <span className="streak-badge">
                🔥 {streak}
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

            <span className="sidebar-icon">
              {item.icon}
            </span>

            <span>{item.label}</span>

          </NavLink>

        ))}

      </nav>

      <div className="sidebar-footer">

        <button
          className="btn btn-ghost btn-sm w-full"
          onClick={toggleTheme}
        >
          {theme === 'dark'
            ? <><FiSun /> Light Mode</>
            : <><FiMoon /> Dark Mode</>
          }
        </button>

        <button
          className="btn btn-ghost btn-sm w-full"
          onClick={handleLogout}
        >
          <FiLogOut />
          Sign Out
        </button>

      </div>

    </aside>
  )
}