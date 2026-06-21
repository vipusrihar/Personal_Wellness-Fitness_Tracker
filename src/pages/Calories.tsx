import { useState, useEffect } from 'react'
import ProgressBar from '../components/ProgressBar'
import '../styles/Calories.css'
import { useToast } from '../contexts/ToastContext'
import { useAchievement } from '../contexts/AchievementContext'
import { calorieService } from '../services/calorieService'
import { useAuth } from '../contexts/AuthContext'
import { useUserProfile } from '../contexts/UserProfileContext'
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiCoffee, FiSun, FiMoon, FiZap, FiTarget, FiTrendingUp, FiGrid, } from 'react-icons/fi'
import type { Calorie } from '../types/Calorie'

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Drink', 'Other'] as const;
type CategoryType = typeof CATEGORIES[number];

interface FormState {
  meal: string;
  category: CategoryType | string;
  calories: string;
}

interface FormErrors {
  meal?: string;
  calories?: string;
}

export default function Calories() {
  const { user } = useAuth() as { user: any };
  const { profile } = useUserProfile();
  const { addToast } = useToast();
  const { unlockAchievement } = useAchievement();

  // Declaring states with custom Type Generics
  const [entries, setEntries] = useState<Calorie[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<Calorie | null>(null);
  const [form, setForm] = useState<FormState>({ meal: '', category: 'Breakfast', calories: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [search, setSearch] = useState<string>('');
  const [filterCat, setFilterCat] = useState<string>('All');

  const load = async () => {
    if (!user?.id) return;
    try {
      const data = await calorieService.getAll(user.id);
      setEntries(data || []);
    } catch (err) {
      console.error("Failed to load entries:", err);
    }
  };

  useEffect(() => {
    load();
  }, [user]);

  const today = new Date().toISOString().split('T')[0];
  const todayEntries = entries.filter(e => e.timestamp?.startsWith(today));
  const total = todayEntries.reduce((s, e) => s + (e.calories || 0), 0);
  const goal = profile?.calorieGoal || 2000;

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.meal.trim()) e.meal = 'Meal name required';
    if (!form.calories || isNaN(+form.calories) || +form.calories <= 0) {
      e.calories = 'Enter a valid calorie amount';
    }
    if (+form.calories > 10000) e.calories = 'Value too high';
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!user?.id) return;

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      if (editItem && editItem.id !== undefined) {
        await calorieService.update(editItem.id, { meal: form.meal, category: form.category, calories: +form.calories });
        addToast('Meal updated ✓', 'success');
      } else {
        await calorieService.add(user.id, form.meal, form.category, +form.calories);
        addToast('Meal logged! 🥗', 'success');
        await unlockAchievement('first_meal');
      }
      setForm({ meal: '', category: 'Breakfast', calories: '' });
      setErrors({});
      setShowForm(false);
      setEditItem(null);
      load();
    } catch (err) {
      addToast('An error occurred. Please try again.', 'error');
    }
  };

  const handleEdit = (item: Calorie) => {
    setEditItem(item);
    setForm({ meal: item.meal, category: item.category, calories: String(item.calories) });
    setShowForm(true);
  };

  const handleDelete = async (id: number | undefined) => {
    if (id === undefined) return;
    try {
      await calorieService.delete(id);
      addToast('Entry deleted', 'info');
      load();
    } catch (err) {
      console.error("Failed to delete entry:", err);
    }
  };

  const filtered = entries.filter(e => {
    const matchSearch = e.meal?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || e.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleInputChange = (k: keyof FormState) => (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [k]: ev.target.value }));
    setErrors(er => ({ ...er, [k]: '' }));
  };

  return (
    <div className="page-container fade-in">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="page-title">Calories</h1>
          <p className="page-subtitle">Track your daily nutrition</p>
        </div>
        <button
          className="btn btn-primary btn-sm btn-add-action"
          onClick={() => {
            setShowForm(true);
            setEditItem(null);
            setForm({ meal: '', category: 'Breakfast', calories: '' });
            setErrors({});
          }}
        >
          <FiPlus size={20} />
          <span>Add Meal</span>
        </button>
      </div>

      {/* Daily summary */}
      <div className="cal-summary card mb-4">
        <div className="cal-numbers">
          <div>
            <div className="label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiZap size={14} />
              Consumed
            </div>
            <div className="value-lg" style={{ color: 'var(--accent-3)' }}>{total}</div>
          </div>
          <div className="cal-slash">/</div>
          <div>
            <div className="label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiTarget size={14} />
              Goal
            </div>
            <div className="value-lg">{goal}</div>
          </div>
          <div>
            <div className="label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiTrendingUp size={14} />
              Remaining
            </div>
            <div className="value-lg" style={{ color: total > goal ? 'var(--accent-4)' : 'var(--accent-2)' }}>
              {Math.max(0, goal - total)}
            </div>
          </div>
        </div>
        <ProgressBar value={total} max={goal} color={total > goal ? 'var(--accent-4)' : 'var(--gradient-3)'} height={10} />
        <div className="mt-2 text-sm text-muted">{todayEntries.length} meals today · {Math.round((total / goal) * 100)}% of goal</div>
      </div>

      {/* Filters */}
      <div className="cal-filters mb-4">
        <div className="search-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <FiSearch
            className="search-icon"
            size={16}
            style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="cal-search"
            placeholder="Search meals..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
        <div className="cat-chips">
          {['All', ...CATEGORIES].map(c => (
            <button key={c} className={`chip ${filterCat === c ? 'chip-amber' : ''}`} onClick={() => setFilterCat(c)}>{c}</button>
          ))}
        </div>
      </div>

      {/* Entries list */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FiCoffee size={48} />
          </div>
          <p>No meals yet. Add your first meal!</p>
        </div>
      ) : (
        <div className="entries-list">
          {filtered.map(e => (
            <div key={e.id} className="entry-item card card-sm">
              <div className="entry-left">
                <span className="entry-cat-icon">{catIcon(e.category)}</span>
                <div>
                  <div className="entry-name">{e.meal}</div>
                  <div className="entry-meta">{e.category} · {formatTime(e.timestamp)}</div>
                </div>
              </div>
              <div className="entry-right">
                <span className="entry-cal">{e.calories} kcal</span>
                <button
                  className="btn btn-ghost btn-icon text-sm"
                  onClick={() => handleEdit(e)}
                  title="Edit"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  className="btn btn-ghost btn-icon text-sm"
                  onClick={() => handleDelete(e.id)}
                  title="Delete"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div className="modal">
            <h2 className="modal-title">{editItem ? 'Edit Meal' : 'Add Meal'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="form-group">
                <label className="form-label">Meal Name</label>
                <input value={form.meal} onChange={handleInputChange('meal')} placeholder="e.g. Grilled Chicken" />
                {errors.meal && <span className="form-error">{errors.meal}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select value={form.category} onChange={handleInputChange('category')}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Calories (kcal)</label>
                <input type="number" value={form.calories} onChange={handleInputChange('calories')} placeholder="350" min="1" max="9999" />
                {errors.calories && <span className="form-error">{errors.calories}</span>}
              </div>
              <div className="flex gap-2 mt-2">
                <button type="submit" className="btn btn-primary flex-1">{editItem ? 'Update' : 'Add Meal'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setEditItem(null) }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function catIcon(cat: string) {
  const icons: Record<string, React.ReactNode> = {
    Breakfast: <FiSun size={18} />,
    Lunch: <FiSun size={18} />,
    Dinner: <FiMoon size={18} />,
    Snack: <FiZap size={18} />,
    Drink: <FiCoffee size={18} />,
    Other: <FiGrid size={18} />,
  };

  return icons[cat] || <FiGrid size={18} />;
}

function formatTime(ts?: string): string {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}