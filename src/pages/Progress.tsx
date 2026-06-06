import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import '../styles/Progress.css'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { measurementService } from '../services/measurement'
import { calorieService } from '../services/calorieService'
import { workoutService } from '../services/workoutService'

// Interfaces for structured TypeScript support
interface Measurement {
  id: number;
  timestamp?: string;
  weight?: number;
  chest?: number;
  waist?: number;
  arms?: number;
}

interface ChartData {
  date: string;
  weight?: number;
  cals?: number;
  count?: number;
}

interface FormState {
  weight: string;
  chest: string;
  waist: string;
  arms: string;
}

type TabType = 'weight' | 'calories' | 'workouts';

export default function Progress() {
  const { user } = useAuth() as { user: any };
  const { addToast } = useToast();
  
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [calorieHistory, setCalorieHistory] = useState<ChartData[]>([])
  const [workoutHistory, setWorkoutHistory] = useState<ChartData[]>([])
  const [showForm, setShowForm] = useState<boolean>(false)
  const [form, setForm] = useState<FormState>({ weight: '', chest: '', waist: '', arms: '' })
  const [tab, setTab] = useState<TabType>('weight')

  const load = async () => {
    if (!user) return
    const [m, c, w] = await Promise.all([
      measurementService.getAll(user.id),
      calorieService.getAll(user.id),
      workoutService.getAll(user.id)
    ])
    setMeasurements(m)
    
    // Aggregate calories by day (last 14 days)
    const calMap: Record<string, number> = {}
    c.forEach((entry: any) => {
      const day = entry.timestamp?.split('T')[0]
      if (day) calMap[day] = (calMap[day] || 0) + entry.calories
    })
    setCalorieHistory(Object.entries(calMap).slice(-14).map(([date, cals]) => ({ date: fmtDate(date), cals })))
    
    // Workouts per day
    const workMap: Record<string, number> = {}
    w.forEach((entry: any) => {
      const day = entry.timestamp?.split('T')[0]
      if (day) workMap[day] = (workMap[day] || 0) + 1
    })
    setWorkoutHistory(Object.entries(workMap).slice(-14).map(([date, count]) => ({ date: fmtDate(date), count })))
  }

  useEffect(() => { load() }, [user])

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const data: Partial<Omit<Measurement, 'id' | 'timestamp'>> = {}
    if (form.weight) data.weight = +form.weight
    if (form.chest) data.chest = +form.chest
    if (form.waist) data.waist = +form.waist
    if (form.arms) data.arms = +form.arms
    
    if (!Object.keys(data).length) return
    await measurementService.add(user.id, data)
    addToast('Measurements saved! 📏', 'success')
    setForm({ weight: '', chest: '', waist: '', arms: '' })
    setShowForm(false)
    load()
  }

  const handleDelete = async (id: number) => { 
    await measurementService.delete(id)
    load() 
  }

  const weightData: ChartData[] = measurements
    .filter(m => m.weight)
    .map(m => ({ date: fmtDate(m.timestamp?.split('T')[0]), weight: m.weight }))

  const tooltipStyle = {
    background: 'var(--bg-elevated)', 
    border: '1px solid var(--border)',
    borderRadius: 8, 
    color: 'var(--text-primary)', 
    fontSize: '0.85rem'
  }

  return (
    <div className="page-container fade-in">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="page-title">Progress</h1>
          <p className="page-subtitle">Track your body & fitness journey</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Add Measurements</button>
      </div>

      {/* Chart tabs */}
      <div className="tabs mb-4" style={{ maxWidth: 400 }}>
        {(['weight', 'calories', 'workouts'] as TabType[]).map(t => (
          <div key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t}</div>
        ))}
      </div>

      {/* Charts */}
      {tab === 'weight' && (
        <div className="card mb-4">
          <div className="section-title">Weight Trend</div>
          {weightData.length < 2 ? (
            <div className="empty-state" style={{ padding: '24px' }}><p>Log measurements to see your weight trend.</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} domain={['auto', 'auto']} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="weight" stroke="var(--accent-1)" strokeWidth={2} dot={{ r: 4, fill: 'var(--accent-1)' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {tab === 'calories' && (
        <div className="card mb-4">
          <div className="section-title">Daily Calories (14 days)</div>
          {calorieHistory.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px' }}><p>Log meals to see calorie history.</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={calorieHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="cals" fill="var(--accent-3)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {tab === 'workouts' && (
        <div className="card mb-4">
          <div className="section-title">Workouts per Day (14 days)</div>
          {workoutHistory.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px' }}><p>Log workouts to see your activity history.</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={workoutHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="var(--accent-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* Measurements log */}
      {measurements.length > 0 && (
        <div className="card">
          <div className="section-title">Measurement History</div>
          <div className="measure-table">
            <div className="measure-header">
              <span>Date</span><span>Weight</span><span>Chest</span><span>Waist</span><span>Arms</span><span></span>
            </div>
            {measurements.slice().reverse().map(m => (
              <div key={m.id} className="measure-row">
                <span>{fmtDate(m.timestamp?.split('T')[0])}</span>
                <span>{m.weight ? `${m.weight}kg` : '—'}</span>
                <span>{m.chest ? `${m.chest}cm` : '—'}</span>
                <span>{m.waist ? `${m.waist}cm` : '—'}</span>
                <span>{m.arms ? `${m.arms}cm` : '—'}</span>
                <button className="btn btn-ghost btn-icon text-sm" onClick={() => handleDelete(m.id)}>🗑️</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div className="modal">
            <h2 className="modal-title">Add Measurements</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input type="number" step="0.1" min="0" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} placeholder="70.5" />
                </div>
                <div className="form-group">
                  <label className="form-label">Chest (cm)</label>
                  <input type="number" step="0.1" min="0" value={form.chest} onChange={e => setForm(f => ({ ...f, chest: e.target.value }))} placeholder="95" />
                </div>
                <div className="form-group">
                  <label className="form-label">Waist (cm)</label>
                  <input type="number" step="0.1" min="0" value={form.waist} onChange={e => setForm(f => ({ ...f, waist: e.target.value }))} placeholder="80" />
                </div>
                <div className="form-group">
                  <label className="form-label">Arms (cm)</label>
                  <input type="number" step="0.1" min="0" value={form.arms} onChange={e => setForm(f => ({ ...f, arms: e.target.value }))} placeholder="35" />
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button type="submit" className="btn btn-primary flex-1">Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function fmtDate(str: string | undefined) {
  if (!str) return ''
  const d = new Date(str + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}