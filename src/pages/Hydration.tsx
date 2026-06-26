import { useState, useEffect } from 'react'
import '../styles/Hydration.css'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext';
import { useAchievement } from '../contexts/AchievementContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { hydrationService } from '../services/hydrationService';
import ProgressRing from '../components/ProgressiveRing';
import { MdWaterDrop } from 'react-icons/md';
import { FiTrash2, FiPlus, FiTarget, FiActivity, FiClock } from 'react-icons/fi';

// Interface for individual water logs
interface HydrationEntry {
  id: number;
  amount: number;
  timestamp: string | number | Date;
}

const QUICK_AMOUNTS = [150, 250, 350, 500, 750]

export default function Hydration() {
  const { user } = useAuth() as { user: any }; 
  const { profile } = useUserProfile();
  const { addToast } = useToast();
  const { unlockAchievement } = useAchievement()

  const [entries, setEntries] = useState<HydrationEntry[]>([])
  const [custom, setCustom] = useState<string>('')
  const [error, setError] = useState<string>('')

  const load = async () => {
    if (!user) return
    const data = await hydrationService.getToday(user.id)
    setEntries(data)
  }

  useEffect(() => { load() }, [user])

  const goal = profile?.waterGoal || 2500
  const total = entries.reduce((s, e) => s + (e.amount || 0), 0)
  const pct = Math.min(100, (total / goal) * 100)

  // Added explicit type for 'amount'
  const addWater = async (amount: number) => {
    if (!amount || amount <= 0 || amount > 5000) {
      setError('Enter a valid amount (1–5000ml)');
      return
    }
    await hydrationService.add(user.id, +amount)
    addToast(
      <span className="flex items-center gap-1">
        +{amount}ml logged! <MdWaterDrop style={{ color: '#3182ce' }} />
      </span>,
      'success'
    );
    if (total + +amount >= goal) await unlockAchievement(user.id)
    setCustom('');
    setError('')
    load()
  }

  // Added explicit type for 'id'
  const handleDelete = async (id: number) => {
    await hydrationService.delete(id)
    load()
  }

  return (
    <div className="page-container fade-in">
      <h1 className="page-title">Hydration</h1>
      <p className="page-subtitle mb-4">Track your daily water intake</p>

      {/* Big ring */}
      <div className="hydration-hero card">
        <ProgressRing size={180} strokeWidth={14} percent={pct} color="#3182ce">
          <div className="text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <MdWaterDrop size={28} style={{ color: '#3182ce', marginBottom: '4px' }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>{total}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ml</div>
          </div>
        </ProgressRing>
        
        <div className="hydration-stats">
          <div className="h-stat">
            <span className="label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiActivity size={14} /> Consumed
            </span>
            <span className="h-val" style={{ color: '#3182ce' }}>{total}ml</span>
          </div>
          <div className="h-stat">
            <span className="label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiTarget size={14} /> Goal
            </span>
            <span className="h-val">{goal}ml</span>
          </div>
          <div className="h-stat">
            <span className="label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiClock size={14} /> Remaining
            </span>
            <span className="h-val" style={{ color: total >= goal ? 'var(--accent-2)' : 'var(--text-primary)' }}>
              {total >= goal ? 'Goal Met! 🎉' : `${goal - total}ml`}
            </span>
          </div>
          <div className="h-pct-bar">
            <div style={{ height: 6, background: 'var(--bg-surface)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: '#3182ce', borderRadius: 3, transition: 'width 0.8s', boxShadow: '0 0 12px rgba(49,130,206,0.5)' }} />
            </div>
            <div className="text-sm text-muted mt-2">{Math.round(pct)}% of daily goal</div>
          </div>
        </div>
      </div>

      {/* Quick add */}
      <div className="card mt-4">
        <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <FiPlus size={16} />
          <span>Quick Add</span>
        </div>
        <div className="quick-buttons">
          {QUICK_AMOUNTS.map(a => (
            <button key={a} className="quick-btn btn btn-secondary" onClick={() => addWater(a)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <MdWaterDrop style={{ color: '#3182ce' }} /> {a}ml
            </button>
          ))}
        </div>
        <div className="custom-add mt-3" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="number" placeholder="Custom amount (ml)"
            value={custom} onChange={e => { setCustom(e.target.value); setError('') }}
            min="1" max="5000"
            style={{ maxWidth: 200 }}
          />
          <button className="btn btn-primary btn-sm" onClick={() => addWater(+custom)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <FiPlus size={14} />
            <span>Add</span>
          </button>
        </div>
        {error && <span className="form-error mt-2">{error}</span>}
      </div>

      {/* Today's log */}
      {entries.length > 0 && (
        <div className="card mt-4">
          <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <FiClock size={16} />
            <span>Today's Log</span>
          </div>
          <div className="water-log">
            {entries.slice().reverse().map(e => (
              <div key={e.id} className="water-entry" style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
                <div className="water-icon" style={{ marginRight: '12px', display: 'flex', alignItems: 'center' }}>
                  <MdWaterDrop size={20} style={{ color: '#3182ce' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>{e.amount}ml</div>
                  <div className="text-muted text-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiClock size={12} />
                    <span>{new Date(e.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <button 
                  className="btn btn-ghost btn-icon text-sm ml-auto" 
                  onClick={() => handleDelete(e.id)}
                  title="Delete log"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}