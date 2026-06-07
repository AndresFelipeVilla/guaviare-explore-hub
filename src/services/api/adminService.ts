import { apiClient } from './client';

// ============================================
// Admin API Service
// ============================================

export const adminService = {
    /**
     * Cambia (rota) la clave de registro de jefes.
     * Requiere un usuario autenticado con rol ADMIN; el token se envía automáticamente.
     * @param newKey - La nueva clave (mínimo 8 caracteres)
     */
    async changeRegistrationKey(newKey: string): Promise<{ message: string }> {
        return apiClient.put<{ message: string }>('/api/admin/registration-key', { newKey });
    },
};
