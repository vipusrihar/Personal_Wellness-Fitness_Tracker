import { Link } from 'react-router-dom'
import '../styles/Home.css'

const features = [
    { icon: '🥗', title: 'Calorie Tracking', desc: 'Log meals and monitor your daily nutrition with smart categorization.' },
    { icon: '💧', title: 'Hydration Goals', desc: 'Track water intake with beautiful progress rings and quick-add buttons.' },
    { icon: '💪', title: 'Workout Logger', desc: 'Record exercises with built-in stopwatch and countdown timer.' },
    { icon: '📊', title: 'Progress Analytics', desc: 'Visualize your journey with detailed charts and trend analysis.' },
    { icon: '🏆', title: 'Achievements', desc: 'Unlock badges and maintain streaks to stay motivated every day.' },
    { icon: '📱', title: 'Offline First', desc: 'Works without internet. All data stays private on your device.' }
]

const tips = [
    { icon: '🌅', tip: 'Drink water first thing in the morning to kickstart your metabolism.' },
    { icon: '🥦', tip: 'Fill half your plate with vegetables at every meal for optimal nutrition.' },
    { icon: '😴', tip: '7–9 hours of sleep is essential for muscle recovery and weight management.' },
    { icon: '🚶', tip: '10,000 steps a day can significantly reduce cardiovascular disease risk.' }
]

export default function Home() {
    return (
        <div className="home">
            <div className="bg-mesh" />

            <nav className="home-nav">
                <div className="home-nav-inner">
                    <div className="logo-mark">
                        <span>⚡</span>
                        <span className="logo-text">FitTrack <strong>Pro</strong></span>
                    </div>
                    <div className="home-nav-actions">
                        <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                        <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-badge chip chip-blue">🚀 Premium Fitness Tracker</div>
                    <h1 className="hero-title">
                        Your Health,<br />
                        <span className="gradient-text">Tracked Perfectly</span>
                    </h1>
                    <p className="hero-desc">
                        FitTrack Pro combines calorie counting, hydration tracking, workout logging,
                        and progress analytics into one beautiful, offline-first app.
                    </p>
                    <div className="hero-actions">
                        <Link to="/register" className="btn btn-primary">Start Free Today →</Link>
                        <Link to="/login" className="btn btn-secondary">Sign In</Link>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat"><strong>100%</strong> <span>Offline</span></div>
                        <div className="hero-divider" />
                        <div className="hero-stat"><strong>0</strong> <span>Data Sold</span></div>
                        <div className="hero-divider" />
                        <div className="hero-stat"><strong>∞</strong> <span>Free</span></div>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="hero-card-stack">
                        <div className="hero-card hero-card-1">
                            <div className="hc-label">Today's Calories</div>
                            <div className="hc-value">1,840 <span>/ 2,000</span></div>
                            <div className="hc-bar"><div className="hc-fill" style={{ width: '92%' }} /></div>
                        </div>
                        <div className="hero-card hero-card-2">
                            <div className="hc-label">💧 Hydration</div>
                            <div className="hc-value">2.1L <span>/ 2.5L</span></div>
                            <div className="hc-bar"><div className="hc-fill" style={{ width: '84%', background: 'var(--accent-1)' }} /></div>
                        </div>
                        <div className="hero-card hero-card-3">
                            <div>🔥 <strong>12</strong> day streak</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Keep it up!</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="section features-section">
                <div className="section-inner">
                    <p className="section-eyebrow">Everything You Need</p>
                    <h2 className="section-heading">Built for real fitness goals</h2>
                    <div className="features-grid">
                        {features.map(f => (
                            <div key={f.title} className="feature-card card">
                                <div className="feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tips */}
            <section className="section tips-section">
                <div className="section-inner">
                    <p className="section-eyebrow">Healthy Living</p>
                    <h2 className="section-heading">Science-backed tips</h2>
                    <div className="tips-grid">
                        {tips.map(t => (
                            <div key={t.tip} className="tip-card card">
                                <span className="tip-icon">{t.icon}</span>
                                <p>{t.tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section cta-section">
                <div className="cta-inner card">
                    <h2>Ready to transform your health?</h2>
                    <p>Join thousands building better habits with FitTrack Pro.</p>
                    <Link to="/register" className="btn btn-primary">Create Free Account →</Link>
                </div>
            </section>

            <footer className="home-footer">
                <p>© 2025 FitTrack Pro · Built with ❤️ for a healthier world</p>
            </footer>
        </div>
    )
}
