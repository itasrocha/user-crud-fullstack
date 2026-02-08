import axios from 'axios';
import type { AuthTokens, LoginCredentials, RegisterData, User } from '../types/types';

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthTokens> {
        const formData = new URLSearchParams();
        formData.append('username', credentials.email);
        formData.append('password', credentials.password);

        const { data } = await axios.post<AuthTokens>(`${API_URL}/v1/auth/login`, formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        return data;
    },

    async register(userData: RegisterData): Promise<AuthTokens> {
        const { data } = await axios.post<AuthTokens>(`${API_URL}/v1/auth/register`, userData);
        return data;
    },

    async refreshToken(refreshToken: string): Promise<AuthTokens> {
        const { data } = await axios.post<AuthTokens>(`${API_URL}/v1/auth/refresh`, {
            refresh_token: refreshToken,
        });
        return data;
    },

    async getCurrentUser(accessToken: string): Promise<User> {
        const { data } = await axios.get<User>(`${API_URL}/v1/auth/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return data;
    },
};
