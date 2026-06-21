import { useState, useEffect } from 'react'
import '../styles/Workouts.css'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext';
import { useAchievement } from '../contexts/AchievementContext';
import { workoutService } from '../services/workoutService';
import { apiService } from '../services/apiService';
import { CountdownTimer, Stopwatch } from '../components/Timers';
import { FiPlus } from 'react-icons/fi';

const CATEGORIES = ['Strength', 'Cardio', 'Core', 'Flexibility', 'Sports', 'Other'] as const;

// Interfaces for structured component data types
interface WorkoutEntry {
  id: number;
  exercise: string;
  category: string;
  sets: number | null;
  reps: number | null;
  duration: number | null;
  timestamp?: string;
}

interface ExerciseSuggestion {
  name: string;
  category: string;
}

interface FormState {
  exercise: string;
  sets: string;
  reps: string;
  duration: string;
  category: string;
}

export default function Workouts() {
  const { user } = useAuth() as { user: any };
  const { addToast } = useToast();
  const { unlockAchievement } = useAchievement();

  const [entries, setEntries] = useState<WorkoutEntry[]>([])
  const [showForm, setShowForm] = useState<boolean>(false)
  const [form, setForm] = useState<FormState>({ exercise: '', sets: '', reps: '', duration: '', category: 'Strength' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [timerTab, setTimerTab] = useState<'stopwatch' | 'countdown'>('stopwatch')
  const [exerciseSuggestions, setExerciseSuggestions] = useState<ExerciseSuggestion[]>([])
  const [exSearch, setExSearch] = useState<string>('')

  const load = async () => {
    if (!user) return
    const data = await workoutService.getAll(user.id)
    setEntries(data)
  }

  useEffect(() => { load() }, [user])

  useEffect(() => {
    apiService.getExercises(exSearch).then((res: any) => {
      setExerciseSuggestions(res ?? [])
    })
  }, [exSearch])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.exercise.trim()) e.exercise = 'Exercise name required'
    if (!form.category) e.category = 'Category required'
    if (form.sets && (isNaN(+form.sets) || +form.sets < 0)) e.sets = 'Invalid sets'
    if (form.reps && (isNaN(+form.reps) || +form.reps < 0)) e.reps = 'Invalid reps'
    if (form.duration && (isNaN(+form.duration) || +form.duration < 0)) e.duration = 'Invalid duration'
    return e
  }

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    await workoutService.add(user.id, {
      exercise: form.exercise,
      category: form.category,
      sets: form.sets ? +form.sets : null,
      reps: form.reps ? +form.reps : null,
      duration: form.duration ? +form.duration : null
    })

    addToast('Workout logged! 💪', 'success')
    await unlockAchievement('first_workout') // Fixed signature to context layer structure
    setForm({ exercise: '', sets: '', reps: '', duration: '', category: 'Strength' })
    setErrors({});
    setShowForm(false)
    load()
  }

  const handleDelete = async (id: number) => {
    await workoutService.delete(id)
    load()
  }

  const handleSetChange = (k: keyof FormState) => (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [k]: ev.target.value }));
    setErrors(er => ({ ...er, [k]: '' }))
  }

  const today = new Date().toISOString().split('T')[0]
  const todayWorkouts = entries.filter(e => e.timestamp?.startsWith(today))

  return (
    <div className="page-container fade-in">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="page-title">Workouts</h1>
          <p className="page-subtitle">{todayWorkouts.length} exercises today</p>
        </div>
        <button className="btn btn-primary btn-sm btn-add-action" onClick={() => setShowForm(true)}>
          <FiPlus size={20} />
          <span>Add Workout</span>
        </button>
      </div>

      {/* Timers */}
      <div className="card mb-4">
        <div className="tabs mb-4">
          <div className={`tab ${timerTab === 'stopwatch' ? 'active' : ''}`} onClick={() => setTimerTab('stopwatch')}>⏱ Stopwatch</div>
          <div className={`tab ${timerTab === 'countdown' ? 'active' : ''}`} onClick={() => setTimerTab('countdown')}>⏳ Countdown</div>
        </div>
        {timerTab === 'stopwatch' ? <Stopwatch /> : <CountdownTimer />}
      </div>

      {/* Exercise Search */}
      <div className="card mb-4">
        <div className="section-title">Exercise Library</div>
        <input placeholder="🔍 Search exercises…" value={exSearch} onChange={e => setExSearch(e.target.value)} className="mb-3" />
        <div className="exercise-grid">
          {exerciseSuggestions.slice(0, 12).map(ex => (
            <button key={ex.name} className="exercise-chip"
              onClick={() => { setForm(f => ({ ...f, exercise: ex.name, category: ex.category })); setShowForm(true) }}>
              <strong>{ex.name}</strong>
              <span>{ex.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Today */}
      {entries.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">💪</div><p>No workouts yet. Get moving!</p></div>
      ) : (
        <div className="workout-list">
          {entries.map(e => (
            <div key={e.id} className="workout-item card card-sm">
              <div className="workout-left">
                <span className="workout-cat-icon">{catIcon(e.category)}</span>
                <div>
                  <div className="workout-name">{e.exercise}</div>
                  <div className="workout-meta">
                    {e.sets && <span>{e.sets} sets</span>}
                    {e.reps && <span> · {e.reps} reps</span>}
                    {e.duration && <span> · {e.duration}min</span>}
                    <span> · {e.category}</span>
                    <span> · {formatDate(e.timestamp)}</span>
                  </div>
                </div>
              </div>
              <button className="btn btn-ghost btn-icon text-sm" onClick={() => handleDelete(e.id)}>🗑️</button>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div className="modal">
            <h2 className="modal-title">Log Workout</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="form-group">
                <label className="form-label">Exercise Name</label>
                <input value={form.exercise} onChange={handleSetChange('exercise')} placeholder="e.g. Bench Press" />
                {errors.exercise && <span className="form-error">{errors.exercise}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select value={form.category} onChange={handleSetChange('category')}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Sets</label>
                  <input type="number" min="0" value={form.sets} onChange={handleSetChange('sets')} placeholder="3" />
                  {errors.sets && <span className="form-error">{errors.sets}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Reps</label>
                  <input type="number" min="0" value={form.reps} onChange={handleSetChange('reps')} placeholder="12" />
                  {errors.reps && <span className="form-error">{errors.reps}</span>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Duration (minutes)</label>
                <input type="number" min="0" value={form.duration} onChange={handleSetChange('duration')} placeholder="30" />
                {errors.duration && <span className="form-error">{errors.duration}</span>}
              </div>
              <div className="flex gap-2 mt-2">
                <button type="submit" className="btn btn-primary flex-1">Log Workout</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function catIcon(cat: string) {
  const icons: Record<string, string> = { Strength: '🏋️', Cardio: '🏃', Core: '🎯', Flexibility: '🧘', Sports: '⚽', Other: '💪' }
  return icons[cat] || '💪'
}

function formatDate(ts: string | number | Date | undefined) {
  if (!ts) return ''
  const d = new Date(ts)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}