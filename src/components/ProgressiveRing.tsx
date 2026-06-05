export default function ProgressRing({ size = 120, strokeWidth = 10, percent = 0, color = '#63b3ed', children }: any) {
    const r = (size - strokeWidth) / 2
    const circ = 2 * Math.PI * r
    const offset = circ - (Math.min(percent, 100) / 100) * circ

    return (
        <div className="progress-ring-wrap" style={{ width: size, height: size }}>
            <svg width={size} height={size}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                    stroke="var(--bg-surface)" strokeWidth={strokeWidth} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                    stroke={color} strokeWidth={strokeWidth}
                    strokeDasharray={circ} strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 6px ${color}66)` }}
                />
            </svg>
            <div className="progress-ring-label">{children}</div>
        </div>
    )
}
