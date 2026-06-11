import { useState, useEffect, useRef, type ChangeEvent } from 'react'
import '../styles/Timers.css';

// 1. STOPWATCH COMPONENT
export function Stopwatch() {
  const [time, setTime] = useState<number>(0)
  const [running, setRunning] = useState<boolean>(false)
  const interval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (running) {
      interval.current = setInterval(() => setTime(t => t + 10), 10)
    } else if (interval.current) {
      clearInterval(interval.current)
    }
    
    return () => {
      if (interval.current) clearInterval(interval.current)
    }
  }, [running])

  const fmt = (ms: number): string => {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const cs = Math.floor((ms % 1000) / 10)
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
  }

  return (
    <div className="timer-widget">
      <div className="timer-display">{fmt(time)}</div>
      <div className="timer-controls">
        <button 
          className={`btn ${running ? 'btn-danger' : 'btn-primary'}`} 
          onClick={() => setRunning(r => !r)}
        >
          {running ? '⏸ Pause' : '▶ Start'}
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={() => { setRunning(false); setTime(0) }}
        >
          ↺ Reset
        </button>
      </div>
    </div>
  )
}

// 2. COUNTDOWN TIMER COMPONENT
export function CountdownTimer() {
  const [minutes, setMinutes] = useState<number>(3)
  const [seconds, setSeconds] = useState<number>(0)
  const [totalMs, setTotalMs] = useState<number | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [running, setRunning] = useState<boolean>(false)
  const interval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (running) {
      interval.current = setInterval(() => {
        setRemaining(r => {
          if (r === null || r <= 100) {
            setRunning(false)
            if (interval.current) clearInterval(interval.current)
            return 0
          }
          return r - 100
        })
      }, 100)
    } else if (interval.current) {
      clearInterval(interval.current)
    }

    return () => {
      if (interval.current) clearInterval(interval.current)
    }
  }, [running]) // Look! No 'remaining' dependency here anymore.

  const start = () => {
    const ms = (minutes * 60 + seconds) * 1000
    if (ms <= 0) return
    setTotalMs(ms)
    setRemaining(ms)
    setRunning(true)
  }

  const reset = () => {
    setRunning(false)
    setRemaining(null)
    setTotalMs(null)
  }

  const fmt = (ms: number | null): string => {
    if (ms == null) {
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  // Sanitizes manual input so users can't type negative numbers
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>, max: number) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const val = Math.max(0, Math.min(max, Number(e.target.value) || 0))
      setter(val)
    }
  }

  const pct = totalMs && remaining != null ? (remaining / totalMs) * 100 : 100
  const isFinished = remaining === 0

  return (
    <div className="timer-widget">
      {!running && remaining == null && (
        <div className="countdown-setup">
          <div className="time-inputs">
            <input 
              type="number" 
              min="0" 
              max="99" 
              value={minutes} 
              onChange={handleInputChange(setMinutes, 99)} 
            />
            <span className="time-colon">:</span>
            <input 
              type="number" 
              min="0" 
              max="59" 
              value={seconds} 
              onChange={handleInputChange(setSeconds, 59)} 
            />
          </div>
          <div className="time-labels"><span>min</span><span>sec</span></div>
        </div>
      )}

      {(running || remaining != null) && (
        <div className="countdown-display">
          <div 
            className="timer-display" 
            style={{ color: isFinished ? 'var(--accent-4)' : remaining! < 10000 ? 'var(--accent-3)' : 'var(--text-primary)' }}
          >
            {isFinished ? 'Done! 🎉' : fmt(remaining)}
          </div>
          <div className="countdown-bar">
            <div style={{ height: 6, background: 'var(--bg-surface)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: pct < 20 ? 'var(--accent-4)' : 'var(--accent-2)', borderRadius: 3, transition: 'width 0.1s linear' }} />
            </div>
          </div>
        </div>
      )}

      <div className="timer-controls">
        {!running && remaining == null && (
          <button className="btn btn-primary" onClick={start}>▶ Start</button>
        )}
        {running && (
          <button className="btn btn-secondary" onClick={() => setRunning(false)}>⏸ Pause</button>
        )}
        {!running && remaining != null && !isFinished && (
          <button className="btn btn-primary" onClick={() => setRunning(true)}>▶ Resume</button>
        )}
        {(running || remaining != null) && (
          <button className="btn btn-secondary" onClick={reset}>↺ Reset</button>
        )}
      </div>
    </div>
  )
}