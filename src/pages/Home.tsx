import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import type { IconType } from 'react-icons'
import { LuUtensils, LuDroplet, LuDumbbell, LuTrophy, LuCloudOff, LuFootprints, LuLeaf } from "react-icons/lu";
import { MdOutlineWbTwilight, MdOutlineBed, MdOutlineInsertChartOutlined } from "react-icons/md";
import { FiSun, FiMoon } from 'react-icons/fi'
import "../styles/Home.css";
import { BsHeartPulseFill } from 'react-icons/bs';
import { useTheme } from '../contexts/ThemeContext';

interface Feature {
    icon: IconType // Changed from string to IconType for strict type safety
    title: string
    desc: string
}

interface Tip {
    icon: IconType
    tip: string
}

const features: Feature[] = [
    { icon: LuUtensils, title: 'Calorie Tracking', desc: 'Log your daily meals, track macronutrient distributions, and keep an ongoing record of your nutritional intake.' },
    { icon: LuDroplet, title: 'Hydration Goals', desc: 'Log water consumption throughout the day and check your progress against your baseline fluid targets.' },
    { icon: LuDumbbell, title: 'Workout Logger', desc: 'Record exercise sets, weight, and repetition counts, supported by a built-in rest timer and stopwatch.' },
    { icon: MdOutlineInsertChartOutlined, title: 'Progress Analytics', desc: 'Review your activity historical history with simple data charts, weekly metrics summaries, and personal milestones.' },
    { icon: LuTrophy, title: 'Achievements', desc: 'Stay accountable over time by monitoring consistent active streaks and marking key fitness milestones.' },
    { icon: LuCloudOff, title: 'Offline First', desc: 'Operates entirely without network connections. Your health logs reside locally on your device storage.' },
]

const tips: Tip[] = [
    { icon: MdOutlineWbTwilight, tip: 'Drink water first thing in the morning to kickstart your metabolism and rehydrate after sleep.' },
    { icon: LuLeaf, tip: 'Fill half your plate with vegetables at every meal for optimal nutrition and satiety signals.' },
    { icon: MdOutlineBed, tip: '7–9 hours of sleep is essential for muscle recovery, hormone balance, and weight management.' },
    { icon: LuFootprints, tip: '10,000 steps a day can significantly reduce cardiovascular disease risk and improve mood.' },
]

const photoStrip = [
    { src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=440&q=75&fit=crop', alt: 'gym workout' },
    { src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=440&q=75&fit=crop', alt: 'running outdoors' },
    { src: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=440&q=75&fit=crop', alt: 'healthy food' },
    { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=440&q=75&fit=crop', alt: 'yoga stretch' },
    { src: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=440&q=75&fit=crop', alt: 'weight training' },
    { src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=440&q=75&fit=crop', alt: 'nutrition meal' },
    { src: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=440&q=75&fit=crop', alt: 'fitness tracker' },
    { src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=440&q=75&fit=crop', alt: 'cycling' },
]

interface Particle {
    x: number
    y: number
    size: number
    vx: number
    vy: number
    alpha: number
    color: string
}

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouseRef = useRef({ x: 0, y: 0 })
    const animRef = useRef<number>(0)
    const { theme, toggleTheme } = useTheme()

    // Animated particle canvas background
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')!
        let W = 0, H = 0
        const particles: Particle[] = []

        function resize() {
            W = canvas!.width = window.innerWidth
            H = canvas!.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        function makeParticle(): Particle {
            return {
                x: Math.random() * W,
                y: Math.random() * H,
                size: Math.random() * 1.5 + 0.3,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                alpha: Math.random() * 0.4 + 0.1,
                color: Math.random() > 0.5 ? '124,58,237' : '59,130,246',
            }
        }

        for (let i = 0; i < 160; i++) particles.push(makeParticle())

        function draw() {
            ctx.clearRect(0, 0, W, H)

            // Mouse glow
            const g1 = ctx.createRadialGradient(mouseRef.current.x, mouseRef.current.y, 0, mouseRef.current.x, mouseRef.current.y, 500)
            g1.addColorStop(0, 'rgba(124,58,237,0.08)')
            g1.addColorStop(1, 'transparent')
            ctx.fillStyle = g1
            ctx.fillRect(0, 0, W, H)

            // Ambient glow top-right
            const g2 = ctx.createRadialGradient(W * 0.8, H * 0.15, 0, W * 0.8, H * 0.15, 400)
            g2.addColorStop(0, 'rgba(168,85,247,0.07)')
            g2.addColorStop(1, 'transparent')
            ctx.fillStyle = g2
            ctx.fillRect(0, 0, W, H)

            particles.forEach((p, i) => {
                // Move
                p.x += p.vx
                p.y += p.vy

                // Mouse repel
                const dx = p.x - mouseRef.current.x
                const dy = p.y - mouseRef.current.y
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < 120) {
                    p.x += (dx / dist) * 1.5
                    p.y += (dy / dist) * 1.5
                }

                // Wrap around
                if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
                    const fresh = makeParticle()
                    particles[i] = fresh
                    return
                }

                // Draw dot
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(${p.color},${p.alpha})`
                ctx.fill()

                // Draw connecting lines
                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j]
                    const dx2 = p.x - q.x
                    const dy2 = p.y - q.y
                    const d = Math.sqrt(dx2 * dx2 + dy2 * dy2)
                    if (d < 90) {
                        ctx.beginPath()
                        ctx.moveTo(p.x, p.y)
                        ctx.lineTo(q.x, q.y)
                        ctx.strokeStyle = `rgba(124,58,237,${0.06 * (1 - d / 90)})`
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                }
            })

            animRef.current = requestAnimationFrame(draw)
        }

        draw()

        const handleMouse = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY }
        }
        window.addEventListener('mousemove', handleMouse)

        return () => {
            cancelAnimationFrame(animRef.current)
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', handleMouse)
        }
    }, [])

    // Scroll-reveal observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        ; (e.target as HTMLElement).classList.add('visible')
                    }
                })
            },
            { threshold: 0.1 }
        )
        document.querySelectorAll('.feat-card, .tip-card').forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [])

    // Progress bar animation on mount
    useEffect(() => {
        const timeout = setTimeout(() => {
            document.querySelectorAll<HTMLElement>('.prog-fill').forEach((el) => {
                const target = el.dataset.width ?? '0%'
                el.style.width = target
            })
        }, 600)
        return () => clearTimeout(timeout)
    }, [])

    // FIX: smooth-scroll handler for the "View features" button
    const scrollToFeatures = () => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="home-page">
            {/* Animated canvas background */}
            <canvas ref={canvasRef} className="bg-canvas" />

            {/* NAV */}
            <nav className="home-nav">
                <div className="logo">
                    <div className="logo-dot" />
                    FitTrack
                </div>
                <div className="nav-links">
                    <button
                        className="btn-theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
                    </button>
                    <Link to="/login" className="btn-ghost-nav">Sign In</Link>
                    <Link to="/register" className="btn-nav-cta">Sign Up</Link>
                </div>
            </nav>

            {/* HERO */}
            <section className="hero">
                <div className="hero-left">
                    <div className="hero-pill">
                        <span className="pill-dot" />
                        Fitness Tracker
                    </div>
                    <h1 className="hero-h">
                        Log Metrics,<br />
                        <span className="grad-text">Monitor Daily Progress</span>
                    </h1>
                    <p className="hero-p">
                        FitTrack combines caloric logs, fluid intake counts, and exercise tracking into a local interface that works offline without tracking your data.
                    </p>
                    <div className="hero-btns">
                        <Link to="/register" className="btn-primary-lg">Get Started <span>→</span></Link>
                        <Link to="/login" className="btn-outline-lg">Sign In</Link>
                    </div>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-num">100%</span>
                            <span className="stat-label">Local execution</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <span className="stat-num">0</span>
                            <span className="stat-label">External tracking</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <span className="stat-num">∞</span>
                            <span className="stat-label">Open utility</span>
                        </div>
                    </div>
                </div>

                <div className="hero-right">
                    {/* Card 1: Calories */}
                    <div className="float-card fc1">
                        <div className="card-lbl">Today's Calories</div>
                        <div className="card-val">
                            1,840 <span className="card-sub">/ 2,000 kcal</span>
                        </div>
                        <div className="prog-bar">
                            <div className="prog-fill prog-purple" data-width="92%" style={{ width: 0 }} />
                        </div>
                        <div className="macro-row">
                            <span>🥩 Protein 42%</span>
                            <span>🍞 Carbs 38%</span>
                            <span>🥑 Fat 20%</span>
                        </div>
                    </div>

                    <div className="float-card fc2">
                        <div className="card-lbl">💧 Hydration</div>
                        <div className="card-val">
                            2.1L <span className="card-sub">/ 2.5L goal</span>
                        </div>
                        <div className="prog-bar">
                            <div className="prog-fill prog-blue" data-width="84%" style={{ width: 0 }} />
                        </div>
                    </div>

                    {/* Card 3: Streak */}
                    <div className="float-card fc3">
                        <div className="streak-row">
                            <span className="fire">🔥</span>
                            <div>
                                <div className="streak-num">12</div>
                                <div className="streak-txt">day streak</div>
                            </div>
                            <div className="streak-badge">+2 this week</div>
                        </div>
                    </div>

                    {/* Card 4: Steps */}
                    <div className="float-card fc4">
                        <div className="steps-row">
                            <div>
                                <div className="card-lbl">Steps</div>
                                <div className="steps-val">8,432</div>
                            </div>
                            <span className="steps-icon">🚶</span>
                        </div>
                        <div className="prog-bar">
                            <div className="prog-fill prog-green" data-width="84%" style={{ width: 0 }} />
                        </div>
                        <div className="steps-note">84% of daily goal</div>
                    </div>
                </div>
            </section>

            {/* PHOTO STRIP */}
            <div className="photo-strip">
                <div className="strip-track">
                    {[...photoStrip, ...photoStrip].map((img, idx) => (
                        <img
                            key={idx}
                            className="strip-img"
                            src={img.src}
                            alt={img.alt}
                            loading="lazy"
                        />
                    ))}
                </div>
            </div>

            <div className="gradient-divider" />

            {/* FEATURES */}
            <section className="section" id="features">
                <div className="section-inner">
                    <p className="eyebrow">What's included</p>
                    <h2 className="section-h">Tools that actually help</h2>
                    <p className="section-desc">
                        Six features that cover the basics — logging, tracking, and
                        seeing how you're doing over time.
                    </p>
                    <div className="features-grid">
                        {features.map((f, idx) => {
                            const IconComponent = f.icon;
                            return (
                                <div
                                    key={f.title}
                                    className="feat-card"
                                    style={{ animationDelay: `${idx * 0.07}s` } as React.CSSProperties}
                                >
                                    <div className="feat-icon-wrap">
                                        <IconComponent size={24} className="text-violet-500" />
                                    </div>
                                    <h3>{f.title}</h3>
                                    <p>{f.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <div className="gradient-divider" />

            {/* PHOTO FEATURE */}
            <section className="section">
                <div className="photo-feature">
                    <div className="photo-collage">
                        <img className="p-img pi1" src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80&fit=crop" alt="workout" />
                        <img className="p-img pi2" src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80&fit=crop" alt="nutrition" />
                        <img className="p-img pi3" src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80&fit=crop" alt="athlete" />
                        <div className="collage-overlay">
                            <div className="co-label">Weekly Progress</div>
                            <div className="co-value">+4.2kg muscle gained</div>
                            <div className="co-trend">↑ 12% from last month</div>
                        </div>
                    </div>

                    <div className="photo-feature-text">
                        <p className="eyebrow">Functional Model</p>
                        <h2 className="section-h" style={{ marginBottom: '1rem' }}>
                            Minimalist and<br />functional
                        </h2>
                        <p className="photo-feature-desc">
                            The architecture minimizes operational friction, focusing instead on data entry accuracy and record visibility.
                        </p>
                        <div className="feature-list">
                            {[
                                { n: '01', title: 'Streamlined Entry', desc: 'Add parameters directly from input modals without navigating nested submenus.' },
                                { n: '02', title: 'Day Counters', desc: 'Basic consecutive entry logs designed to trace compliance and adherence.' },
                                { n: '03', title: 'Data Summaries', desc: 'Aggregated view blocks highlighting points of divergence or stability.' },
                                { n: '04', title: 'Local Client Storage', desc: 'Files and values persist directly on native database systems inside the browser.' },
                            ].map((item) => (
                                <div key={item.n} className="f-item">
                                    <div className="f-num">{item.n}</div>
                                    <div className="f-text">
                                        <h4>{item.title}</h4>
                                        <p>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div className="gradient-divider" />

            {/* TIPS */}
            <section className="section">
                <div className="section-inner">
                    <p className="eyebrow">Healthy Living</p>
                    <h2 className="section-h">Science-backed tips</h2>
                    <div className="tips-bento">
                        {tips.map((t, idx) => {
                            const TipIconComponent = t.icon;
                            return (
                                <div
                                    key={t.tip}
                                    className="tip-card"
                                    style={{ animationDelay: `${idx * 0.08}s` } as React.CSSProperties}
                                >
                                    <span className="tip-icon">
                                        <TipIconComponent size={22} className="text-blue-400" />
                                    </span>
                                    <p>{t.tip}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section">
                <div className="section-inner">
                    <div className="cta-wrap">
                        <div className="cta-glow" />
                        <p className="eyebrow" style={{ position: 'relative' }}>Initialize</p>
                        <h2 className="cta-h">
                            Access your dashboard
                        </h2>
                        <p className="cta-p">
                            No mandatory registration profiles required to test tracking structures locally.
                        </p>
                        <div className="cta-btns">
                            <Link to="/register" className="btn-primary-lg">Create Account →</Link>
                            <button className="btn-outline-lg" onClick={scrollToFeatures}>
                                View Features
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="home-footer">
                <p>© 2026 FitTrack · Built with <BsHeartPulseFill /> for a healthier world</p>
            </footer>
        </div>
    )
}