import { useState } from 'react'
import '../styles/Settings.css'
import {
  FiSun, FiMoon, FiDownload, FiTrash2, 
  FiWifi, FiDatabase, FiInfo
} from 'react-icons/fi'
import { exportData, resetData } from '../services/dataService'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useToast } from '../contexts/ToastContext'

export default function Settings() {
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
      {/* Header Block */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="page-title" style={{ margin: 0 }}>Settings</h1>
        </div>
        <p className="page-subtitle">Customize your FitTrack experience</p>
      </div>

      {/* Appearance */}
      <div className="card">
        <div className="section-title mb-3">
          {theme === 'dark' ? <FiMoon /> : <FiSun />} Appearance
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-label">Theme</div>
            <div className="settings-desc">Switch between dark and light mode</div>
          </div>
          <button className="btn btn-secondary flex items-center gap-2" onClick={toggleTheme}>
            {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>

      {/* Network */}
      <div className="card">
        <div className="section-title mb-3">
          <FiWifi /> Network & Sync
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-label">Connection Status</div>
            <div className="settings-desc flex items-center">
              <span className={`online-dot ${isOnline ? 'online' : 'offline'}`} />
              {isOnline ? 'Connected to internet' : 'Working offline — data syncs when reconnected'}
            </div>
          </div>
        </div>
        <div className="settings-row mt-3">
          <div>
            <div className="settings-label">Offline Mode</div>
            <div className="settings-desc">FitTrack works fully offline. All data is stored locally on your device.</div>
          </div>
          <span className="chip chip-blue">Active</span>
        </div>
      </div>

      {/* Data Management */}
      <div className="card">
        <div className="section-title mb-3">
          <FiDatabase /> Data Management
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-label">Export Data</div>
            <div className="settings-desc">Download all your fitness data as a JSON file</div>
          </div>
          <button
            className="btn btn-secondary flex items-center gap-2"
            onClick={handleExport}
            disabled={exporting}>
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
              className="btn btn-danger-outline flex items-center gap-2"
              onClick={() => setConfirmReset(true)}>
              <FiTrash2 size={16} />
              <span>Reset</span>
            </button>
          ) : (
            <div className="confirm-btns">
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirmReset(false)}>
                Cancel
              </button>
              <button className="btn btn-danger btn-sm" onClick={handleReset} disabled={resetting}>
                {resetting ? 'Resetting...' : 'Confirm Reset'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* About */}
      <div className="card">
        <div className="section-title mb-3">
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