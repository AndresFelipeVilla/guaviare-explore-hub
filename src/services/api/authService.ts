import { apiClient } from './client';
import {
    LoginRequest,
    LoginResponse,
    BossRegistrationRequest,
    EmployeeRegistrationRequest,
    RegistrationResponse,
} from '@/types/auth';

// ============================================
// Authentication API Service
// ============================================

export const authService = {
    /**
     * Login with email and password
     * @param credentials - User email and password
     * @returns Login response with token and user data
     */
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await apiClient.postPublic<LoginResponse>(
            '/api/auth/login',
            credentials
        );

        // Store token if present
        if (response.token) {
            localStorage.setItem('authToken', response.token);

            // If user data is in the response, store it
            if (response.user) {
                localStorage.setItem('userData', JSON.stringify(response.user));
            } else {
                // Try to fetch user profile after login
                try {
                    const profile = await apiClient.get<{
                        id: string;
                        name: string;
                        email: string;
                        role: string;
                        position?: string;
                    }>('/api/users/profile');
                    localStorage.setItem('userData', JSON.stringify(profile));
                } catch {
                    // If profile fetch fails, that's OK - dashboard will use fallback
                    console.warn('Could not fetch profile after login');
                }
            }
        }

        return response;
    },

    /**
     * Register a new boss user
     * @param data - Boss registration data
     * @returns Registration response
     */
    async registerBoss(data: BossRegistrationRequest): Promise<RegistrationResponse> {
        const registrationKey = import.meta.env.VITE_BOSS_REGISTRATION_KEY || '';
        const response = await apiClient.postPublic<RegistrationResponse>(
            '/api/auth/boss',
            data,
            { 'X-Registration-Key': registrationKey }
        );

        // Auto-login: store token if registration returns it
        if (response.token) {
            localStorage.setItem('authToken', response.token);
        }

        // Auto-login: store user data if registration returns it
        if (response.user) {
            localStorage.setItem('userData', JSON.stringify(response.user));
        }

        return response;
    },

    /**
     * Register a new employee user
     * @param data - Employee registration data
     * @returns Registration response
     */
    async registerEmployee(data: EmployeeRegistrationRequest): Promise<RegistrationResponse> {
        const response = await apiClient.postPublic<RegistrationResponse>(
            '/api/auth/employee',
            data
        );

        // Auto-login: store token if registration returns it
        if (response.token) {
            localStorage.setItem('authToken', response.token);
        }

        // Auto-login: store user data if registration returns it
        if (response.user) {
            localStorage.setItem('userData', JSON.stringify(response.user));
        }

        return response;
    },

    /**
     * Logout - clear stored authentication data
     */
    logout(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    },

    /**
     * Check if user is authenticated
     * @returns true if auth token exists
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem('authToken');
    },

    /**
     * Get current auth token
     * @returns auth token or null
     */
    getToken(): string | null {
        return localStorage.getItem('authToken');
    },

    /**
     * Get stored user data
     * @returns user data object or null
     */
    getUser(): { id: string; email: string; name: string; role: string; position?: string } | null {
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch {
                return null;
            }
        }
        return null;
    },
};

