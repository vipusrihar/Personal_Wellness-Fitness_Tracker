import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Toast } from '../types/Toast'

interface ToastContextValue {
    toasts: Toast[]
    addToast: (message: ReactNode, type?: Toast["type"]) => void
    removeToast: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = useCallback((message: ReactNode, type: Toast["type"] = "info") => {
        const id = Date.now()
        setToasts(t => [...t, { id, message, type }])

        setTimeout(() => {
            setToasts(t => t.filter(x => x.id !== id))
        }, 3500)
    }, [])

    const removeToast = useCallback((id: number) => {
        setToasts(t => t.filter(x => x.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used within ToastProvider')
    return ctx
}