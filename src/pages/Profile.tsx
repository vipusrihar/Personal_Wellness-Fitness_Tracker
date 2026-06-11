import { useState, useEffect } from 'react'
import '../styles/Profile.css'
import { FiActivity, FiCheckCircle, FiUser, FiTarget, FiAward, FiEdit3 } from 'react-icons/fi'
import { useUserProfile } from '../contexts/UserProfileContext';
import { useToast } from '../contexts/ToastContext';
import { FaFireFlameCurved, FaWeightScale } from 'react-icons/fa6';

const GOALS = [
  { value: 'lose', label: 'Lose Weight', icon: <FaFireFlameCurved /> },
  { value: 'maintain', label: 'Maintain Weight', icon: <FaWeightScale /> },
  { value: 'gain', label: 'Gain Muscle', icon: <FiAward /> },
  { value: 'custom', label: 'Custom...', icon: <FiEdit3 /> }
] as const;

type GoalValue = typeof GOALS[number]['value'];

interface ProfileFormState {
  name: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  goal: GoalValue | string;
  customGoalText: string;
  waterGoal: string;
  calorieGoal: string;
}

interface ProfileErrors {
  age?: string;
  weight?: string;
  height?: string;
  waterGoal?: string;
  calorieGoal?: string;
  customGoalText?: string;
}

export default function Profile() {
  const { profile, updateProfile, calculateBMI, getBMICategory } = useUserProfile();
  const { addToast } = useToast();

  const [form, setForm] = useState<ProfileFormState>({
    name: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    goal: 'maintain',
    customGoalText: '',
    waterGoal: '2500',
    calorieGoal: '2000'
  })
  const [saved, setSaved] = useState<boolean>(false)
  const [errors, setErrors] = useState<ProfileErrors>({})

  useEffect(() => {
    if (profile) {
      const isPreset = GOALS.some(g => g.value === profile.goal && g.value !== 'custom');

      setForm({
        name: profile.name || '',
        age: profile.age ? String(profile.age) : '',
        gender: profile.gender || '',
        weight: profile.weight ? String(profile.weight) : '',
        height: profile.height ? String(profile.height) : '',
        goal: isPreset ? (profile.goal || 'maintain') : 'custom',
        customGoalText: isPreset ? '' : (profile.goal || ''),
        waterGoal: profile.waterGoal ? String(profile.waterGoal) : '2500',
        calorieGoal: profile.calorieGoal ? String(profile.calorieGoal) : '2000'
      })
    }
  }, [profile])

  const validate = (): ProfileErrors => {
    const e: ProfileErrors = {}
    if (form.age && (+form.age < 10 || +form.age > 120)) e.age = 'Age must be 10–120'
    if (form.weight && (+form.weight < 20 || +form.weight > 500)) e.weight = 'Weight must be 20–500 kg'
    if (form.height && (+form.height < 50 || +form.height > 250)) e.height = 'Height must be 50–250 cm'
    if (form.waterGoal && (+form.waterGoal < 500 || +form.waterGoal > 10000)) e.waterGoal = 'Water goal must be 500–10000 ml'
    if (form.calorieGoal && (+form.calorieGoal < 500 || +form.calorieGoal > 10000)) e.calorieGoal = 'Calorie goal must be 500–10000'
    if (form.goal === 'custom' && !form.customGoalText.trim()) e.customGoalText = 'Please type your custom goal'
    return e
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    try {
      const finalGoalValue = form.goal === 'custom' ? form.customGoalText.trim() : form.goal;

      await updateProfile({
        name: form.name,
        age: form.age ? +form.age : null,
        gender: form.gender,
        weight: form.weight ? +form.weight : null,
        height: form.height ? +form.height : null,
        goal: finalGoalValue,
        waterGoal: form.waterGoal ? +form.waterGoal : 2500,
        calorieGoal: form.calorieGoal ? +form.calorieGoal : 2000
      })
      addToast('Profile updated! ✓', 'success')
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      setErrors({})
    } catch (err) {
      console.error("Failed to update profile", err)
    }
  }

  const handleInputChange = (k: keyof ProfileFormState) => (
    ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm(f => ({ ...f, [k]: ev.target.value }))
    setErrors(er => ({ ...er, [k]: '' }))
  }

  const bmi = calculateBMI()
  const bmiCat = getBMICategory()

  return (
    <div className="page-container fade-in">
      <h1 className="page-title">Profile</h1>
      <p className="page-subtitle mb-4">Your personal health information</p>

      {/* BMI Card */}
      {bmi && (
        <div className="bmi-display card mb-4">
          <div className="bmi-header">
            <div>
              <div className="label">BMI Index</div>
              <div className="bmi-big" style={{ color: bmiCat?.color }}>{bmi}</div>
              <span className="chip mt-2" style={{ background: `${bmiCat?.color}22`, color: bmiCat?.color, borderColor: `${bmiCat?.color}44` }}>
                {bmiCat?.label}
              </span>
            </div>
            <div className="bmi-scale">
              <div className="bmi-scale-bar">
                <div className="bmi-indicator" style={{ left: `${Math.min(98, Math.max(2, ((+bmi - 10) / 30) * 100))}%` }} />
              </div>
              <div className="bmi-scale-labels">
                <span>Under</span><span>Normal</span><span>Over</span><span>Obese</span>
              </div>
            </div>
          </div>
          <div className="divider" />
          <div className="label mb-2" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FiActivity size={14} /> Health Suggestions
          </div>
          {bmiCat?.suggestions?.map((s: string, i: number) => (
            <div key={i} className="suggestion-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
              <FiCheckCircle size={14} style={{ color: bmiCat?.color || 'var(--text-muted)' }} />
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiUser /> Personal Information
        </div>
        <div className="flex flex-col gap-3">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <input value={form.name} onChange={handleInputChange('name')} placeholder="Your name" />
            </div>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input type="number" value={form.age} onChange={handleInputChange('age')} placeholder="25" min="10" max="120" />
              {errors.age && <span className="form-error">{errors.age}</span>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select value={form.gender} onChange={handleInputChange('gender')}>
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input type="number" step="0.1" value={form.weight} onChange={handleInputChange('weight')} placeholder="70" />
              {errors.weight && <span className="form-error">{errors.weight}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input type="number" step="0.1" value={form.height} onChange={handleInputChange('height')} placeholder="175" />
              {errors.height && <span className="form-error">{errors.height}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Fitness Goal</label>
            <div className="goal-options mb-2">
              {GOALS.map(g => (
                <button
                  key={g.value}
                  type="button"
                  className={`goal-btn ${form.goal === g.value ? 'active' : ''}`}
                  onClick={() => setForm(f => ({ ...f, goal: g.value }))}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {g.icon}
                  <span>{g.label}</span>
                </button>
              ))}
            </div>

            {form.goal === 'custom' && (
              <div className="custom-goal-input-wrapper fade-in mt-2">
                <input
                  type="text"
                  value={form.customGoalText}
                  onChange={handleInputChange('customGoalText')}
                  placeholder="Type your specific fitness or health goal here..."
                  className={errors.customGoalText ? 'input-error' : ''}
                />
                {errors.customGoalText && <span className="form-error">{errors.customGoalText}</span>}
              </div>
            )}
          </div>

          <div className="divider" />

          <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiTarget /> Daily Goals
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Calorie Goal (kcal)</label>
              <input type="number" value={form.calorieGoal} onChange={handleInputChange('calorieGoal')} placeholder="2000" />
              {errors.calorieGoal && <span className="form-error">{errors.calorieGoal}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Water Goal (ml)</label>
              <input type="number" value={form.waterGoal} onChange={handleInputChange('waterGoal')} placeholder="2500" />
              {errors.waterGoal && <span className="form-error">{errors.waterGoal}</span>}
            </div>
          </div>
          <button type="submit" className={`btn ${saved ? 'btn-secondary' : 'btn-primary'} mt-2`}>
            {saved ? '✓ Saved!' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}