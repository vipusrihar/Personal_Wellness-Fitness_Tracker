export default function ProgressBar({ value = 0, max = 100, color = 'var(--gradient-1)', height = 8 }) {
    const pct = Math.min(100, (value / max) * 100)
    return (
        <div className="progress-bar-wrap" style={{ height }}>
            <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color, height }} />
        </div>
    )
}
