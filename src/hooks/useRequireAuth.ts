import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/api/authService';

/**
 * Allowed role types for access control
 */
type Role = 'EMPLOYEE' | 'EMPLEADO' | 'BOSS' | 'JEFE' | 'ADMIN';

/**
 * Admin/Boss role identifiers
 */
const ADMIN_ROLES: Role[] = ['BOSS', 'JEFE', 'ADMIN'];

/**
 * Employee role identifiers
 */
const EMPLOYEE_ROLES: Role[] = ['EMPLOYEE', 'EMPLEADO'];

interface UseRequireAuthOptions {
    /**
     * Roles allowed to access the page.
     * If not specified, any authenticated user can access.
     */
    allowedRoles?: Role[];
    /**
     * Where to redirect if authentication fails.
     * @default '/auth'
     */
    redirectTo?: string;
    /**
     * Where to redirect employees when they try to access admin pages.
     * @default '/dashboard'
     */
    employeeRedirect?: string;
    /**
     * Where to redirect admins when they try to access employee-only pages.
     * @default '/admin/informes'
     */
    adminRedirect?: string;
}

interface UseRequireAuthResult {
    /**
     * Current user data from storage
     */
    user: ReturnType<typeof authService.getUser>;
    /**
     * Whether the user is authenticated
     */
    isAuthenticated: boolean;
    /**
     * Whether the user has an admin/boss role
     */
    isAdmin: boolean;
    /**
     * Whether the user has an employee role
     */
    isEmployee: boolean;
}

/**
 * Hook to protect routes and check authentication/authorization
 * Automatically redirects if not authenticated or unauthorized
 * 
 * @example
 * // Basic usage - require any authenticated user
 * const { user, isAdmin } = useRequireAuth();
 * 
 * @example
 * // Require admin role
 * useRequireAuth({ allowedRoles: ['BOSS', 'ADMIN'] });
 * 
 * @example
 * // Employee-only page
 * useRequireAuth({ allowedRoles: ['EMPLOYEE'] });
 */
export function useRequireAuth(options: UseRequireAuthOptions = {}): UseRequireAuthResult {
    const {
        allowedRoles,
        redirectTo = '/auth',
        employeeRedirect = '/dashboard',
        adminRedirect = '/admin/informes',
    } = options;

    const navigate = useNavigate();
    const user = authService.getUser();
    const isAuthenticated = authService.isAuthenticated();

    const userRole = user?.role?.toUpperCase() as Role | undefined;
    const isAdmin = userRole ? ADMIN_ROLES.includes(userRole) : false;
    const isEmployee = userRole ? EMPLOYEE_ROLES.includes(userRole) : false;

    useEffect(() => {
        // Not authenticated - redirect to login
        if (!isAuthenticated) {
            navigate(redirectTo);
            return;
        }

        // If allowedRoles is specified, check if user has the required role
        if (allowedRoles && allowedRoles.length > 0 && userRole) {
            const hasRequiredRole = allowedRoles.some(
                role => role.toUpperCase() === userRole
            );

            if (!hasRequiredRole) {
                // Redirect based on user type
                if (isAdmin) {
                    navigate(adminRedirect);
                } else {
                    navigate(employeeRedirect);
                }
            }
        }
    }, [navigate, isAuthenticated, userRole, allowedRoles, redirectTo, employeeRedirect, adminRedirect, isAdmin]);

    return {
        user,
        isAuthenticated,
        isAdmin,
        isEmployee,
    };
}
