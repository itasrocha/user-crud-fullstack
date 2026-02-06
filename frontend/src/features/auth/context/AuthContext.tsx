import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AuthContextType, User, LoginCredentials, RegisterData } from '../types/types';
import { authService } from '../api/auth.service';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../api/authAxios';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = user !== null;

    useEffect(() => {
        const initAuth = async () => {
            const accessToken = getAccessToken();
            if (accessToken) {
                try {
                    const userData = await authService.getCurrentUser(accessToken);
                    setUser(userData);
                } catch {
                    const refreshToken = getRefreshToken();
                    if (refreshToken) {
                        try {
                            const tokens = await authService.refreshToken(refreshToken);
                            setTokens(tokens.access_token, tokens.refresh_token);
                            const userData = await authService.getCurrentUser(tokens.access_token);
                            setUser(userData);
                        } catch {
                            clearTokens();
                        }
                    }
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = useCallback(async (credentials: LoginCredentials) => {
        const tokens = await authService.login(credentials);
        setTokens(tokens.access_token, tokens.refresh_token);
        const userData = await authService.getCurrentUser(tokens.access_token);
        setUser(userData);
    }, []);

    const register = useCallback(async (data: RegisterData) => {
        const tokens = await authService.register(data);
        setTokens(tokens.access_token, tokens.refresh_token);
        const userData = await authService.getCurrentUser(tokens.access_token);
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        clearTokens();
        setUser(null);
    }, []);

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
