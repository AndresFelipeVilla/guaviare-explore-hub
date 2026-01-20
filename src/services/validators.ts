import { ValidationError, FormValidationResult } from '@/types/auth';

// ============================================
// Email Validation
// ============================================

export function validateEmail(email: string): ValidationError | null {
    if (!email || email.trim() === '') {
        return {
            field: 'email',
            message: 'El correo electrónico es obligatorio',
        };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            field: 'email',
            message: 'El formato del correo electrónico no es válido',
        };
    }

    return null;
}

// ============================================
// Password Validation
// ============================================

export function validatePassword(password: string): ValidationError | null {
    if (!password || password.trim() === '') {
        return {
            field: 'password',
            message: 'La contraseña es obligatoria',
        };
    }

    if (password.length < 6) {
        return {
            field: 'password',
            message: 'La contraseña debe tener al menos 6 caracteres',
        };
    }

    return null;
}

// ============================================
// Required Field Validation
// ============================================

export function validateRequired(value: string, fieldName: string): ValidationError | null {
    if (!value || value.trim() === '') {
        return {
            field: fieldName,
            message: `${fieldName} es obligatorio`,
        };
    }

    return null;
}

// ============================================
// Form Validators
// ============================================

export function validateLoginForm(email: string, password: string): FormValidationResult {
    const errors: ValidationError[] = [];

    const emailError = validateEmail(email);
    if (emailError) errors.push(emailError);

    const passwordError = validatePassword(password);
    if (passwordError) errors.push(passwordError);

    return {
        isValid: errors.length === 0,
        errors,
    };
}

export function validateBossRegistrationForm(data: {
    name: string;
    email: string;
    password: string;
    position: string;
    department: string;
    bossCode: string;
}): FormValidationResult {
    const errors: ValidationError[] = [];

    // Validate required fields
    const nameError = validateRequired(data.name, 'Nombre');
    if (nameError) errors.push(nameError);

    const emailError = validateEmail(data.email);
    if (emailError) errors.push(emailError);

    const passwordError = validatePassword(data.password);
    if (passwordError) errors.push(passwordError);

    const positionError = validateRequired(data.position, 'Cargo');
    if (positionError) errors.push(positionError);

    const departmentError = validateRequired(data.department, 'Departamento');
    if (departmentError) errors.push(departmentError);

    const bossCodeError = validateRequired(data.bossCode, 'Código de Jefe');
    if (bossCodeError) errors.push(bossCodeError);

    return {
        isValid: errors.length === 0,
        errors,
    };
}

export function validateEmployeeRegistrationForm(data: {
    name: string;
    email: string;
    password: string;
    position: string;
    department: string;
    managerBossCode: string;
}): FormValidationResult {
    const errors: ValidationError[] = [];

    // Validate required fields
    const nameError = validateRequired(data.name, 'Nombre');
    if (nameError) errors.push(nameError);

    const emailError = validateEmail(data.email);
    if (emailError) errors.push(emailError);

    const passwordError = validatePassword(data.password);
    if (passwordError) errors.push(passwordError);

    const positionError = validateRequired(data.position, 'Cargo');
    if (positionError) errors.push(positionError);

    const departmentError = validateRequired(data.department, 'Departamento');
    if (departmentError) errors.push(departmentError);

    const managerCodeError = validateRequired(data.managerBossCode, 'Código del Jefe');
    if (managerCodeError) errors.push(managerCodeError);

    return {
        isValid: errors.length === 0,
        errors,
    };
}
