import { ThemeProvider } from "./ThemeContext";
import { ToastProvider } from "./ToastContext";
import { AuthProvider } from "./AuthContext";
import { UserProfileProvider } from "./UserProfileContext";
import { AchievementProvider } from "./AchievementContext";
import type { ReactNode } from "react";

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
                    <UserProfileProvider>
                        <AchievementProvider>
                            {children}
                        </AchievementProvider>
                    </UserProfileProvider>
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}