import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import '../styles/Auth.css'
import { FaBolt, FaArrowLeft, FaArrowRight, FaUserCheck, FaUserPlus } from 'react-icons/fa'

interface AuthProps {
    mode?: 'login' | 'register'
}

interface FormErrors {
    username?: string
    password?: string
    email?: string
    general?: string
}

export default function Auth({ mode = 'login' }: AuthProps) {
    const [form, setForm] = useState({ username: '', password: '', email: '' })
    const [errors, setErrors] = useState<FormErrors>({})
    const [loading, setLoading] = useState(false)

    // Consume decoupled atomic contexts instead of the old useApp()
    const { login, register } = useAuth()
    const { addToast } = useToast()

    const navigate = useNavigate()
    const isLogin = mode === 'login'

    const validate = () => {
        const e: FormErrors = {}
        if (!form.username.trim()) e.username = 'Username is required'
        else if (form.username.length < 3) e.username = 'Must be at least 3 characters'

        if (!form.password) e.password = 'Password is required'
        else if (form.password.length < 6) e.password = 'Must be at least 6 characters'

        if (!isLogin) {
            if (!form.email.trim()) e.email = 'Email is required'
            else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
        }
        return e
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }
        setLoading(true)
        try {
            if (isLogin) {
                await login(form.username, form.password)
                
                // Integrated the React Icon toast for Login
                addToast(
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaUserCheck color="#22c55e" /> Welcome back!
                    </span>,
                    'success'
                )
            } else {
                await register(form.username, form.password, form.email)
                
                // Integrated a matching React Icon toast for Registration
                addToast(
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaUserPlus color="#22c55e" /> Account created successfully!
                    </span>,
                    'success'
                )
            }
            navigate('/dashboard')
        } catch (err: any) {
            setErrors({ general: err.message || 'An unexpected error occurred' })
        } finally {
            setLoading(false)
        }
    }

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(f => ({ ...f, [k]: e.target.value }));
        setErrors(er => ({ ...er, [k]: '' }))
    }

    return (
        <div className="auth-page">
            <div className="bg-mesh" />
            <Link to="/" className="auth-back">
                <FaArrowLeft style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />Back to home
            </Link>

            <div className="auth-container fade-in">
                <div className="auth-logo">
                    <FaBolt style={{ color: '#eab308', marginRight: '6px' }} />
                    <span>FitTrack <strong>Pro</strong></span>
                </div>

                <h1 className="auth-title">{isLogin ? 'Welcome back' : 'Create account'}</h1>
                <p className="auth-sub">{isLogin ? 'Sign in to continue your journey' : 'Start tracking your fitness today'}</p>

                {errors.general && <div className="auth-error">{errors.general}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
                            {errors.email && <span className="form-error">{errors.email}</span>}
                        </div>
                    )}
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input type="text" value={form.username} onChange={set('username')} placeholder="johndoe" autoComplete="username" />
                        {errors.username && <span className="form-error">{errors.username}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" autoComplete={isLogin ? 'current-password' : 'new-password'} />
                        {errors.password && <span className="form-error">{errors.password}</span>}
                    </div>
                    <button type="submit" className="btn btn-primary btn-full mt-3" disabled={loading}>
                        {loading ? 'Please wait…' : (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                {isLogin ? 'Sign In' : 'Create Account'} <FaArrowRight />
                            </span>
                        )}
                    </button>
                </form>

                <p className="auth-switch">
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <Link to={isLogin ? '/register' : '/login'}>
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </Link>
                </p>
            </div>
        </div>
    )
}