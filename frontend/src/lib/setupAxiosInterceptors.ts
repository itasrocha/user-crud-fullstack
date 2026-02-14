import axios from 'axios';
import authAxios from '../features/auth/api/authAxios';
import { toaster } from '../components/ui/toaster';

interface HandledError {
    urlPattern: string;
    status: number;
}

const HANDLED_ERRORS: HandledError[] = [
    { urlPattern: '/auth/login', status: 401 },
    { urlPattern: '/auth/register', status: 409 },
];

function isHandled(url: string | undefined, status: number | undefined): boolean {
    if (!url || !status) return false;
    return HANDLED_ERRORS.some(
        (entry) => url.includes(entry.urlPattern) && status === entry.status
    );
}

function showErrorToast(error: unknown): void {
    if (!axios.isAxiosError(error)) return;

    const status = error.response?.status;
    const detail = error.response?.data?.detail;

    if (status) {
        toaster.create({
            title: `Erro ${status}`,
            description: detail || error.message,
            type: 'error',
        });
    } else {
        toaster.create({
            title: 'Erro',
            description: 'Não foi possível conectar ao servidor.',
            type: 'error',
        });
    }
}

function createErrorInterceptor() {
    return (error: unknown) => {
        if (axios.isAxiosError(error)) {
            const url = error.config?.url;
            const status = error.response?.status;

            const isAuthRefreshHandled = status === 401 && error.config?.headers?.Authorization;

            if (!isHandled(url, status) && !isAuthRefreshHandled) {
                showErrorToast(error);
            }
        }

        return Promise.reject(error);
    };
}

export function setupAxiosInterceptors(): void {
    axios.interceptors.response.use(undefined, createErrorInterceptor());
    authAxios.interceptors.response.use(undefined, createErrorInterceptor());
}
