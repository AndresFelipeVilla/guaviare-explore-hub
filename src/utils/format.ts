/**
 * Utility functions for formatting and display
 * Extracted from duplicate implementations across the codebase
 */

/**
 * Map of role codes to Spanish display names
 */
const ROLE_MAP: Record<string, string> = {
    'EMPLOYEE': 'Empleado',
    'EMPLEADO': 'Empleado',
    'BOSS': 'Jefe',
    'JEFE': 'Jefe',
    'ADMIN': 'Administrador',
};

/**
 * Translate role code to Spanish display name
 * @param role - Role code (e.g., 'EMPLOYEE', 'BOSS', 'ADMIN')
 * @returns Spanish translation of the role
 */
export function formatRole(role: string): string {
    return ROLE_MAP[role?.toUpperCase()] || role;
}

/**
 * Get time-based greeting in Spanish
 * @returns Greeting based on current hour
 */
export function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
}

/**
 * Extract first name from full name
 * @param fullName - Full name string
 * @returns First name or fallback
 */
export function getFirstName(fullName?: string): string {
    if (!fullName) return 'Usuario';
    return fullName.split(' ')[0];
}

/**
 * Generate initials from a name (max 2 characters)
 * @param name - Full name string
 * @returns Uppercase initials (e.g., "JD" for "John Doe")
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}
