import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { userService } from "../services/userService"
import type { User } from "../types/User"

interface AuthContextValue {
    user: User | null
    loading: boolean
    isOnline: boolean
    login: (username: string, password: string) => Promise<User>
    register: (username: string, password: string, email: string) => Promise<User>
    logout: () => void
    setUserState: (user: User | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isOnline, setIsOnline] = useState(navigator.onLine)

    useEffect(() => {
        const checkRealInternet = async () => {
            if (!navigator.onLine) {
                setIsOnline(false);
                return;
            }

            try {
                // Ping a small, fast endpoint or public icon to verify actual traffic flow
                // Use a cache-busting timestamp query parameter so the browser doesn't fake a success response
                await fetch("https://www.google.com/favicon.ico", {
                    mode: 'no-cors',
                    cache: 'no-store'
                });
                setIsOnline(true);
            } catch (error) {
                setIsOnline(false); // Connected to Wi-Fi, but no real internet throughput!
            }
        };

        const handleOnline = () => checkRealInternet();
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Run an initial check on mount
        checkRealInternet();

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const login = useCallback(async (username: string, password: string): Promise<User> => {
        const u = await userService.login(username, password)
        setUser(u)
        localStorage.setItem("fit_track_session", JSON.stringify({ userId: u.id }))
        return u
    }, [])

    const register = useCallback(async (username: string, password: string, email: string) => {
        await userService.create(username, password, email)
        return login(username, password)
    }, [login])

    const logout = useCallback(() => {
        setUser(null)
        localStorage.removeItem("fit_track_session")
    }, [])

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const stored = localStorage.getItem("fit_track_session")
                if (!stored) return

                const { userId } = JSON.parse(stored)
                const restoredUser = await userService.getById(userId)

                if (restoredUser) {
                    setUser(restoredUser)
                }
            } catch (error) {
                console.error("Session restore failed", error)
                localStorage.removeItem("fit_track_session")
            } finally {
                setLoading(false)
            }
        }
        restoreSession()
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isOnline,
            login,
            register,
            logout,
            setUserState: setUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}