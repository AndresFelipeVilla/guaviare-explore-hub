import { AuthError } from '@/types/auth';

// ============================================
// Configuration
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8084';

// ============================================
// Custom Error Class
// ============================================

export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public code?: string,
        public field?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// ============================================
// HTTP Client
// ============================================

interface RequestOptions {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: unknown;
    headers?: Record<string, string>;
    skipAuth?: boolean; // Skip adding auth token (for public endpoints like registration)
}

async function request<T>(endpoint: string, options: RequestOptions): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Add auth token if available and not skipped
    if (!options.skipAuth) {
        const token = localStorage.getItem('authToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    try {
        const response = await fetch(url, {
            method: options.method,
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined,
        });


        // Handle non-OK responses
        if (!response.ok) {
            let errorMessage = 'An error occurred';
            let errorData: AuthError | null = null;

            try {
                errorData = await response.json();
                errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
            } catch {
                errorMessage = `Error: ${response.status} ${response.statusText}`;
            }

            throw new ApiError(
                errorMessage,
                response.status,
                errorData?.code,
                errorData?.field
            );
        }

        // Handle empty responses (204 No Content)
        if (response.status === 204) {
            return {} as T;
        }

        // Parse JSON response
        const data = await response.json();
        return data as T;
    } catch (error) {
        // Network errors or fetch failures
        if (error instanceof ApiError) {
            throw error;
        }

        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new ApiError(
                'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.',
                0,
                'NETWORK_ERROR'
            );
        }

        throw new ApiError(
            'Error inesperado. Por favor, intenta de nuevo.',
            0,
            'UNKNOWN_ERROR'
        );
    }
}

// ============================================
// Exported HTTP Methods
// ============================================

export const apiClient = {
    get: <T>(endpoint: string, headers?: Record<string, string>) =>
        request<T>(endpoint, { method: 'GET', headers }),

    post: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
        request<T>(endpoint, { method: 'POST', body, headers }),

    // Public POST - doesn't send auth token (for registration, login, etc.)
    postPublic: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
        request<T>(endpoint, { method: 'POST', body, headers, skipAuth: true }),

    put: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
        request<T>(endpoint, { method: 'PUT', body, headers }),

    delete: <T>(endpoint: string, headers?: Record<string, string>) =>
        request<T>(endpoint, { method: 'DELETE', headers }),

    patch: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
        request<T>(endpoint, { method: 'PATCH', body, headers }),
};


// ============================================
// Utility Functions
// ============================================

export const getApiBaseUrl = () => API_BASE_URL;
