import type { User, UserCreate } from '../../users/types/user';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends UserCreate {}

export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export type { User };

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
}
