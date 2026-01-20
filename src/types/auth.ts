// ============================================
// Request Types
// ============================================

export interface LoginRequest {
    email: string;
    password: string;
}

export interface BossRegistrationRequest {
    name: string;
    email: string;
    password: string;
    position: string;
    department: string;
    bossCode: string;
}

export interface EmployeeRegistrationRequest {
    name: string;
    email: string;
    password: string;
    position: string;
    department: string;
    managerBossCode: string;
}

// ============================================
// Response Types
// ============================================

export interface LoginResponse {
    token?: string;
    message?: string;
    user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        position?: string;
    };
}

export interface RegistrationResponse {
    message: string;
    token?: string;
    user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        position?: string;
    };
}

// ============================================
// Error Types
// ============================================

export interface AuthError {
    message: string;
    code?: string;
    field?: string;
}

// ============================================
// State Management Types
// ============================================

export type UserType = 'boss' | 'employee';

export interface AuthState {
    isLoading: boolean;
    error: AuthError | null;
    success: boolean;
}

// ============================================
// Form Validation Types
// ============================================

export interface ValidationError {
    field: string;
    message: string;
}

export interface FormValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}
