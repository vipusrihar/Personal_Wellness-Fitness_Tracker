import React from 'react'
import { FiMenu } from 'react-icons/fi'
import '../styles/Header.css'

interface HeaderProps {
  pageTitle: string
  onMenuOpen: () => void
}

export default function Header({ pageTitle, onMenuOpen }: HeaderProps): React.JSX.Element {
  return (
    <header className="app-header">
      <button
        className="hamburger-btn"
        onClick={onMenuOpen}
        aria-label="Open menu"
      >
        <FiMenu />
      </button>

      <h1 className="page-title">{pageTitle}</h1>

      {/* Spacer mirrors hamburger width to keep title visually centred */}
      <div className="header-spacer" aria-hidden="true" />
    </header>
  )
}
