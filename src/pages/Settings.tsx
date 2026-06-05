import { useState } from 'react'
import '../styles/Settings.css'
import {
  FiSun,
  FiMoon,
  FiDownload,
  FiTrash2,
  FiSettings,
  FiWifi,
  FiDatabase,
  FiInfo
} from 'react-icons/fi'
import { exportData, resetData } from '../services/dataService'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useToast } from '../contexts/ToastContext'

export default function Settings() {
  // Corrected structural types context destructuring 
  const { user, isOnline } = useAuth() as { user: any; isOnline: boolean };
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast()
  const [resetting, setResetting] = useState<boolean>(false)
  const [exporting, setExporting] = useState<boolean>(false)
  const [confirmReset, setConfirmReset] = useState<boolean>(false)

  const handleExport = async () => {
    if (!user?.id) return
    setExporting(true)
    try {
      const data = await exportData(user.id)
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `fittrack-export-${new Date().toISOString().split('T')[0]}.json`
      a.click()

      URL.revokeObjectURL(url)
      addToast('Data exported successfully!', 'success')
    } catch (err) {
      console.error(err)
      addToast('Export failed', 'error')
    } finally {
      setExporting(false)
    }
  }

  const handleReset = async () => {
    if (!user?.id) return
    setResetting(true)
    try {
      await resetData(user.id)
      setConfirmReset(false)
      addToast('All data has been reset.', 'success')
    } catch (err) {
      console.error(err)
      addToast('Reset failed', 'error')
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="page-container fade-in">
      <div className="flex items-center gap-2 mb-1">
        <FiSettings className="text-xl" />
        <h1 className="page-title" style={{ margin: 0 }}>Settings</h1>
      </div>
      <p className="page-subtitle mb-4">Customize your FitTrack Pro experience</p>

      {/* Appearance */}
      <div className="card mb-3">
        <div className="section-title mb-3" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {theme === 'dark' ? <FiMoon /> : <FiSun />} Appearance
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-label">Theme</div>
            <div className="settings-desc">Switch between dark and light mode</div>
          </div>
          <button
            className="btn btn-secondary"
            onClick={toggleTheme}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>

      {/* Network */}
      <div className="card mb-3">
        <div className="section-title mb-3" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiWifi /> Network & Sync
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-label">Connection Status</div>
            <div className="settings-desc" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              <span
                className={`online-dot ${isOnline ? 'online' : 'offline'}`}
                style={{ display: 'inline-block', marginRight: '8px', borderRadius: '50%', width: '8px', height: '8px' }}
              />
              {isOnline ? 'Connected to internet' : 'Working offline — data syncs when reconnected'}
            </div>
          </div>
        </div>
        <div className="settings-row mt-3">
          <div>
            <div className="settings-label">Offline Mode</div>
            <div className="settings-desc">FitTrack Pro works fully offline. All data is stored locally on your device.</div>
          </div>
          <span className="chip chip-blue">Active</span>
        </div>
      </div>

      {/* Data */}
      <div className="card mb-3">
        <div className="section-title mb-3" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiDatabase /> Data Management
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-label">Export Data</div>
            <div className="settings-desc">Download all your fitness data as a JSON file</div>
          </div>
          <button
            className="btn btn-secondary"
            onClick={handleExport}
            disabled={exporting}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FiDownload size={16} />
            <span>{exporting ? 'Exporting...' : 'Export'}</span>
          </button>
        </div>
        <div className="divider mt-3 mb-3" />
        <div className="settings-row">
          <div>
            <div className="settings-label danger-text">Reset All Data</div>
            <div className="settings-desc">Permanently delete all your tracking data. This cannot be undone.</div>
          </div>
          {!confirmReset ? (
            <button
              className="btn btn-danger-outline"
              onClick={() => setConfirmReset(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FiTrash2 size={16} />
              <span>Reset</span>
            </button>
          ) : (
            <div className="confirm-btns" style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirmReset(false)}>
                Cancel
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleReset}
                disabled={resetting}
              >
                {resetting ? 'Resetting...' : 'Confirm Reset'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* About */}
      <div className="card">
        <div className="section-title mb-3" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiInfo /> About
        </div>
        <div className="about-row"><span>Version</span><span>1.0.0</span></div>
        <div className="about-row"><span>Account</span><span>{user?.username || 'Local Profile'}</span></div>
        <div className="about-row"><span>Storage</span><span>IndexedDB (Local)</span></div>
        <div className="about-row"><span>Auth</span><span>Local (Offline-first)</span></div>
      </div>
    </div>
  )
}