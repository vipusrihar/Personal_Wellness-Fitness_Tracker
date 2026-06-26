import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Dashboard.css'
import { useAuth } from '../contexts/AuthContext'
import { useUserProfile } from '../contexts/UserProfileContext'
import { useAchievement } from '../contexts/AchievementContext'
import { BADGES } from '../constants/badges'
import { calorieService } from '../services/calorieService'
import { hydrationService } from '../services/hydrationService'
import { workoutService } from '../services/workoutService'
import { apiService } from '../services/apiService'
import ProgressRing from '../components/ProgressiveRing'

import {
    FiActivity, FiTrendingUp, FiAward,
    FiCoffee, FiSun, FiMoon,
} from 'react-icons/fi'
import { GiWeightLiftingUp } from 'react-icons/gi'
import { MdLocalFireDepartment } from 'react-icons/md'
import type { Calorie } from '../types/Calorie'
import { FaArrowRight } from 'react-icons/fa'

interface HydrationItem {
    id: string | number
    amount: number
}

interface WorkoutItem {
    id: string | number
    [key: string]: any
}

interface Quote {
    text: string
    author: string
}

export default function Dashboard() {
    const { user } = useAuth()
    const { profile, streak, calculateBMI, getBMICategory } = useUserProfile()
    const { achievements } = useAchievement()

    const [calories, setCalories] = useState<Calorie[]>([])
    const [hydration, setHydration] = useState<HydrationItem[]>([])
    const [workouts, setWorkouts] = useState<WorkoutItem[]>([])
    const [quote, setQuote] = useState<Quote | null>(null)

    useEffect(() => {
        if (!user?.id) return

        Promise.all([
            calorieService.getToday(user.id),
            hydrationService.getToday(user.id),
            workoutService.getToday(user.id),
            apiService.getQuote()
        ])
            .then(([c, h, w, q]) => {
                setCalories(c || [])
                setHydration(h || [])
                setWorkouts(w || [])
                setQuote(q || null)
            })
            .catch(err => console.error("Error fetching dashboard data:", err))
    }, [user])

    const totalCalories = calories.reduce((s, c) => s + (c.calories || 0), 0)
    const totalWater = hydration.reduce((s, h) => s + (h.amount || 0), 0)

    const calorieGoal = profile?.calorieGoal || 2000
    const waterGoal = profile?.waterGoal || 2500

    const calPct = Math.min(100, (totalCalories / calorieGoal) * 100)
    const waterPct = Math.min(100, (totalWater / waterGoal) * 100)

    const bmi = calculateBMI()
    const bmiCat = getBMICategory()
    const unlockedIds = new Set(achievements?.map(a => a.badgeId) || [])

    function getGreeting(): string {
        const h = new Date().getHours()
        if (h < 12) return 'morning'
        if (h < 18) return 'afternoon'
        return 'evening'
    }

    function getGreetingIcon() {
        const h = new Date().getHours()
        if (h < 12) return <FiSun />
        if (h < 18) return <FiActivity />
        return <FiMoon />
    }

    return (
        <div className="page-container dashboard fade-in">
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">
                        Good {getGreeting()},
                        <span className="greeting-name"> {user?.username || 'Guest'} <span className="greeting-icon">
                            {getGreetingIcon()}
                        </span></span>
                    </h1>
                    <p className="page-subtitle">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                {streak > 0 && (
                    <div className="streak-pill">
                        <MdLocalFireDepartment />
                        {streak} day streak
                    </div>
                )}
            </div>

            {/* Quote */}
            {quote && (
                <div className="quote-card card">
                    <p className="quote-text">"{quote.text}"</p>
                    <p className="quote-author">— {quote.author}</p>
                </div>
            )}

            {/* Summary rings */}
            <div className="rings-row">
                <div className="ring-card card">
                    <ProgressRing size={100} strokeWidth={9} percent={calPct} color="var(--accent-3)">
                        <div className="ring-inner">
                            <div className="ring-inner-value">
                                {Math.round(calPct)}%
                            </div>
                            <div className="ring-inner-unit"> CALS  </div>
                        </div>
                    </ProgressRing>
                    <div className="ring-info">
                        <div className="ring-label">Calories</div>
                        <div className="ring-value">{totalCalories} <span>/ {calorieGoal}</span></div>
                        <Link to="/calories" className="ring-link">
                            Add meal <FaArrowRight />
                        </Link>
                    </div>
                </div>

                <div className="ring-card card">
                    <ProgressRing size={100} strokeWidth={9} percent={waterPct} color="var(--accent-2)">
                        <div className="ring-inner">
                            <div className="ring-inner-value">
                                {Math.round(waterPct)}%
                            </div>
                            <div className="ring-inner-unit">H₂O</div>
                        </div>
                    </ProgressRing>
                    <div className="ring-info">
                        <div className="ring-label">Hydration</div>
                        <div className="ring-value">{totalWater}ml <span>/ {waterGoal}ml</span></div>
                        <Link to="/hydration" className="ring-link">
                            Add water <FaArrowRight />
                        </Link>
                    </div>
                </div>

                <div className="ring-card card">
                    <ProgressRing size={100} strokeWidth={9} percent={Math.min(100, (workouts.length / 3) * 100)} color="var(--accent-1)">
                        <div className="ring-inner">
                            <div className="ring-inner-value ring-inner-value-lg">
                                {workouts.length}
                            </div>
                            <div className="ring-inner-unit">SETS</div>
                        </div>
                    </ProgressRing>
                    <div className="ring-info">
                        <div className="ring-label">Workouts</div>
                        <div className="ring-value">{workouts.length} <span>today</span></div>
                        <Link to="/workouts" className="ring-link">
                            Log workout <FaArrowRight />
                        </Link>
                    </div>
                </div>
            </div>

            {/* BMI Card */}
            {bmi && (
                <div className="bmi-card card">
                    <div className="bmi-left">
                        <div className="label">BMI Index</div>
                        <div className="bmi-value" style={{ color: bmiCat?.color }}>{bmi}</div>
                        <div className="chip mt-2" style={{ background: `${bmiCat?.color}22`, color: bmiCat?.color, borderColor: `${bmiCat?.color}44` }}>
                            {bmiCat?.label}
                        </div>
                    </div>
                    <div className="bmi-right">
                        <div className="label mb-2">Suggestions</div>
                        {bmiCat?.suggestions?.map((s: string, i: number) => (
                            <div key={i} className="bmi-suggestion">
                                <FiTrendingUp className="suggestion-icon" />
                                {s}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Stats grid */}
            <div className="grid-2 mt-4">
                <div className="stat-card">
                    <div className="stat-icon">
                        <FiCoffee />
                    </div>
                    <div className="stat-value">{calories.length}</div>
                    <div className="stat-label">Meals Today</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <GiWeightLiftingUp />
                    </div>
                    <div className="stat-value">{workouts.length}</div>
                    <div className="stat-label">Exercises Today</div>
                </div>
            </div>

            {/* Achievements */}
            <div className="card mt-4">
                <div className="section-title">
                    <FiAward />
                    Achievements
                </div>
                <div className="achievements-grid">
                    {BADGES?.map(b => {
                        const IconComponent = b.icon;
                        return (
                            <div key={b.id} className={`badge-item ${unlockedIds.has(b.id) ? 'unlocked' : 'locked'}`} title={b.desc}>
                                <span className="badge-icon">
                                    <IconComponent />
                                </span>
                                <span className="badge-label">{b.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Recent calories */}
            {calories.length > 0 && (
                <div className="card mt-4">
                    <div className="section-title">Recent Meals</div>
                    {calories.slice(-4).reverse().map(c => (
                        <div key={c.id} className="recent-item">
                            <div>
                                <div className="recent-name">{c.meal}</div>
                                <div className="recent-meta">{c.category}</div>
                            </div>
                            <div className="recent-val">{c.calories} kcal</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}