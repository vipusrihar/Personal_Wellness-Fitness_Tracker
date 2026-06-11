import { Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import { useToast } from "./contexts/ToastContext"
import ToastComponent from "./components/Toast"
import Home from "./pages/Home"
import Auth from "./pages/Auth"
import type { ReactNode } from "react"
import Dashboard from "./pages/Dashboard"
import Layout from "./components/Layout"
import Calories from "./pages/Calories"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings"
import Workouts from "./pages/Workouts"
import Progress from "./pages/Progress"
import Hydration from "./pages/Hydration"

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
                
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="calories" element={<Calories />} />
                    <Route path="hydration" element={<Hydration />} />
                    <Route path="workouts" element={<Workouts />} />
                    <Route path="progress" element={<Progress />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />

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