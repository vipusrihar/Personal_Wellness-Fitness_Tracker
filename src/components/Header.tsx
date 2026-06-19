import React from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../contexts/ThemeContext'
import '../styles/Header.css'

interface HeaderProps {
  pageTitle: string;
}

export default function Header({ pageTitle }: HeaderProps): React.JSX.Element {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">

      <h1 className="page-title">{pageTitle}</h1>

      <button
        className="theme-toggle-btn"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? <FiSun /> : <FiMoon />}
      </button>
    </header>
  )
}