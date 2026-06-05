import { NavLink } from 'react-router-dom'
import '../styles/BottomNav.css'
import {
  FiHome,
  FiActivity,
  FiDroplet,
  FiTrendingUp,
} from 'react-icons/fi'
import { GiWeightLiftingUp } from 'react-icons/gi'

// Cut down to the 5 absolute essentials for daily usage
const navItems = [
  { to: '/dashboard', icon: <FiHome />, label: 'Home' },
  { to: '/calories', icon: <FiActivity />, label: 'Calories' },
  { to: '/hydration', icon: <FiDroplet />, label: 'Water' }, // Shortened label for layout breathing room
  { to: '/workouts', icon: <GiWeightLiftingUp />, label: 'Workouts' },
  { to: '/progress', icon: <FiTrendingUp />, label: 'Progress' },
  // Option: Swap progress for a "More" tab if Profile/Settings must live in the nav
  // { to: '/more', icon: <FiMenu />, label: 'More' } 
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <NavLink 
          key={item.to} 
          to={item.to} 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <div className="icon-wrapper">
            {item.icon}
          </div>
          <span className="nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}