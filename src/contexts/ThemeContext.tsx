import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface ThemeContextValue {
    theme: string
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState(() => localStorage.getItem("fit_track_theme") || "dark")

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('fit_track_theme', theme)
    }, [theme])

    const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark")

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
    return ctx
}