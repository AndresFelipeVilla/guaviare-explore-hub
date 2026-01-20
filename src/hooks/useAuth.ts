import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/api/authService';
import {
    LoginRequest,
    BossRegistrationRequest,
    EmployeeRegistrationRequest,
    LoginResponse,
    RegistrationResponse,
} from '@/types/auth';
import { ApiError } from '@/services/api/client';
import { toast } from 'sonner';

// ============================================
// Login Hook
// ============================================

export function useLogin() {
    return useMutation({
        mutationFn: (credentials: LoginRequest) => authService.login(credentials),
        onSuccess: (data: LoginResponse) => {
            toast.success(data.message || '¡Inicio de sesión exitoso!');
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Error al iniciar sesión');
        },
    });
}

// ============================================
// Boss Registration Hook
// ============================================

export function useRegisterBoss() {
    return useMutation({
        mutationFn: (data: BossRegistrationRequest) => authService.registerBoss(data),
        onSuccess: (data: RegistrationResponse) => {
            toast.success(data.message || '¡Registro de jefe exitoso!');
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Error al registrar jefe');
        },
    });
}

// ============================================
// Employee Registration Hook
// ============================================

export function useRegisterEmployee() {
    return useMutation({
        mutationFn: (data: EmployeeRegistrationRequest) => authService.registerEmployee(data),
        onSuccess: (data: RegistrationResponse) => {
            toast.success(data.message || '¡Registro de empleado exitoso!');
        },
        onError: (error: ApiError) => {
            toast.error(error.message || 'Error al registrar empleado');
        },
    });
}

// ============================================
// Logout Hook
// ============================================

export function useLogout() {
    return () => {
        authService.logout();
        toast.success('Sesión cerrada exitosamente');
    };
}

// ============================================
// Check Authentication Status
// ============================================

export function useIsAuthenticated() {
    return authService.isAuthenticated();
}
