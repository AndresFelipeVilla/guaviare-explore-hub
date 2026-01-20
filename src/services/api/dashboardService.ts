import { apiClient } from './client';
import { UserProfile, ReportSummary, AdminReport, ReportsStats, ReportFilters, ReportStatus, EmployeeReport } from '@/types/dashboard';

// ============================================
// Helper Functions
// ============================================

/**
 * Map backend status values (Spanish) to frontend enum (English)
 */
function mapBackendStatus(backendStatus: string): ReportStatus {
    const statusMap: Record<string, ReportStatus> = {
        'ENVIADO': 'SENT',
        'REVISADO': 'REVIEWED',
        'APROBADO': 'APPROVED',
        'RECHAZADO': 'REJECTED',
        'BORRADOR': 'DRAFT',
        // Also support English values in case backend changes
        'SENT': 'SENT',
        'REVIEWED': 'REVIEWED',
        'APPROVED': 'APPROVED',
        'REJECTED': 'REJECTED',
        'DRAFT': 'DRAFT',
    };

    return statusMap[backendStatus.toUpperCase()] || 'SENT';
}

// ============================================
// Dashboard API Service
// ============================================

export const dashboardService = {
    /**
     * Get current user profile
     * @returns User profile data
     */
    async getProfile(): Promise<UserProfile> {
        const response = await apiClient.get<UserProfile>('/api/users/profile');
        return response;
    },

    /**
     * Get latest reports for the current user
     * @returns Array of latest reports
     */
    async getLatestReports(): Promise<ReportSummary[]> {
        interface BackendReportSummary {
            reportId: string;
            title: string;
            description: string;
            createdAt: string;
            month?: string;
        }

        const response = await apiClient.get<BackendReportSummary[]>('/api/reports/latest');
        console.log('Latest reports response:', response);

        // Map backend reportId to frontend id
        return (response || []).map((item) => ({
            id: item.reportId,
            title: item.title || 'Sin título',
            description: item.description || '',
            createdAt: item.createdAt || new Date().toISOString(),
            month: item.month,
        }));
    },

    /**
     * Get all reports for admin review
     * @param filters - Optional filters for status and search
     * @returns Array of reports with employee info
     */
    async getAdminReports(filters?: ReportFilters): Promise<AdminReport[]> {
        try {
            let url = '/api/reports/summary';
            const params = new URLSearchParams();
            if (filters?.status) {
                params.append('status', filters.status);
            }
            if (filters?.search) {
                params.append('search', filters.search);
            }
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            // Backend returns a paginated response
            interface BackendReportItem {
                reportId: string;
                title: string;
                employee: string;
                status: string;
                sentAt?: string;
                createdAt?: string;
                description?: string;
            }

            interface BackendReportsResponse {
                content: BackendReportItem[];
                page: number;
                size: number;
                totalElements: number;
                totalPages: number;
            }

            const response = await apiClient.get<BackendReportsResponse>(url);
            console.log('Backend response:', response);

            // Map backend fields to frontend format
            const mappedReports: AdminReport[] = (response.content || []).map((item) => ({
                id: item.reportId,
                title: item.title || 'Sin título',
                description: item.description || '',
                status: mapBackendStatus(item.status || 'SENT'),
                employeeName: item.employee || 'Usuario desconocido',
                employeePosition: undefined,
                createdAt: item.createdAt || new Date().toISOString(),
                sentAt: item.sentAt,
            }));

            console.log('Mapped reports:', mappedReports);
            return mappedReports;
        } catch (error) {
            console.error('Error fetching admin reports:', error);
            // Return empty array instead of mock data to clearly show the error
            return [];
        }
    },

    /**
     * Get reports statistics for admin dashboard
     * @returns Statistics object with counts by status
     */
    async getReportsStats(): Promise<ReportsStats> {
        try {
            const response = await apiClient.get<ReportsStats>('/api/reports/stats');
            return response;
        } catch (error) {
            // Return mock data for development
            console.warn('Reports stats endpoint not available, using mock data');
            return {
                total: 24,
                draft: 3,
                sent: 8,
                reviewed: 5,
                approved: 6,
                rejected: 2,
            };
        }
    },

    /**
     * Get reports for the current employee
     * GET /api/reports
     * @returns Array of reports belonging to the current user
     */
    async getMyReports(): Promise<EmployeeReport[]> {
        try {
            // Backend response structure for employee reports
            interface BackendReport {
                reportId: string;
                title: string;
                description: string;
                activities?: string;
                objective?: string;
                evidencieLink?: string;
                status: string;
                createdAt: string;
                updatedAt?: string;
                sentAt?: string;
            }

            // Backend puede devolver array directo O respuesta paginada
            interface PaginatedResponse {
                content: BackendReport[];
                page: number;
                size: number;
                totalElements: number;
                totalPages: number;
            }

            const response = await apiClient.get<BackendReport[] | PaginatedResponse>('/api/reports');
            console.log('My reports response:', response);

            // Extraer el array de reportes (soporta array directo o paginado)
            const reportsArray: BackendReport[] = Array.isArray(response)
                ? response
                : (response?.content || []);

            // Map backend fields to frontend format
            const mappedReports: EmployeeReport[] = reportsArray.map((item) => ({
                id: item.reportId,
                title: item.title || 'Sin título',
                description: item.description || '',
                activities: item.activities,
                objective: item.objective,
                evidencieLink: item.evidencieLink,
                status: mapBackendStatus(item.status || 'DRAFT'),
                createdAt: item.createdAt || new Date().toISOString(),
                updatedAt: item.updatedAt,
                sentAt: item.sentAt,
            }));

            return mappedReports;
        } catch (error) {
            console.error('Error fetching my reports:', error);
            return [];
        }
    },
};
