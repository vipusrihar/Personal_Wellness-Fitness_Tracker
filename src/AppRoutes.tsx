
import { Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import { useToast } from "./contexts/ToastContext"
import ToastComponent from "./components/common/Toast"
import Home from "./pages/Home"
import Auth from "./pages/Auth"
import type { ReactNode } from "react"
import Dashboard from "./pages/Dasboard"

interface RouteGuardProps {
    children: ReactNode
}

function ProtectedRoute({ children }: RouteGuardProps) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="splash">
                <div className="splash-logo">⚡</div>
            </div>
        )
    }

    return user ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: RouteGuardProps) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="splash">
                <div className="splash-logo">⚡</div>
            </div>
        )
    }

    return user ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

export function AppRoutes() {
    // Extracted target states from their atomic contexts
    const { toasts, removeToast } = useToast()

    return (
        <>
            <Routes>
                <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
                <Route path="/login" element={<PublicRoute><Auth mode="login" /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Auth mode="register" /></PublicRoute>} />


                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                
            </Routes>

            <div className="toast-container">
                {toasts.map(t => (
                    <ToastComponent
                        key={t.id}
                        toast={t}
                        onClose={() => removeToast(t.id)}
                    />
                ))}
            </div>
        </>
    )
}