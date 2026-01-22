import { apiClient } from './client';
import { UserProfile, ReportSummary, AdminReport, ReportsStats, ReportFilters, ReportStatus, EmployeeReport, PagedAdminReports, PagedEmployeeReports } from '@/types/dashboard';

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
     * @param page - Page number (0-indexed)
     * @param size - Number of items per page
     * @param filters - Optional filters for status and search
     * @returns Paged response with reports and metadata
     */
    async getAdminReports(page: number = 0, size: number = 10, filters?: ReportFilters): Promise<PagedAdminReports> {
        try {
            let url = '/api/reports/summary';
            const params = new URLSearchParams();

            // Add pagination parameters
            params.append('page', page.toString());
            params.append('size', size.toString());

            // Add filters if provided
            if (filters?.status) {
                params.append('status', filters.status);
            }
            if (filters?.search) {
                params.append('query', filters.search);
            }

            url += `?${params.toString()}`;

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

            // SMART PAGINATION FIX (Backend Workaround)
            const currentCount = mappedReports.length;
            const responsePage = response.page;
            const responseSize = response.size;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const totalElements = response.totalElements ?? (response as any).total ?? 0;

            const calculatedMinTotal = (responsePage * responseSize) + currentCount;
            const adjustedTotal = (currentCount >= responseSize)
                ? Math.max(totalElements, calculatedMinTotal + 1)
                : Math.max(totalElements, calculatedMinTotal);

            const adjustedTotalPages = Math.ceil(adjustedTotal / responseSize);

            // Return full paged response
            return {
                content: mappedReports,
                page: responsePage,
                size: responseSize,
                totalElements: adjustedTotal,
                totalPages: adjustedTotalPages,
            };
        } catch (error) {
            console.error('Error fetching admin reports:', error);
            // Return empty paged response
            return {
                content: [],
                page: 0,
                size: size,
                totalElements: 0,
                totalPages: 0,
            };
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
     * @param page - Page number (0-indexed)
     * @param size - Number of items per page
     * @param filters - Optional filters for status and search
     * @returns Paged response with reports and metadata
     */
    async getMyReports(page: number = 0, size: number = 3, filters?: ReportFilters): Promise<PagedEmployeeReports> {
        try {
            let url = '/api/reports';
            const params = new URLSearchParams();

            // Add pagination parameters
            params.append('page', page.toString());
            params.append('size', size.toString());

            // Add filters if provided
            if (filters?.status) {
                params.append('status', filters.status);
            }
            if (filters?.search) {
                params.append('query', filters.search);
            }

            url += `?${params.toString()}`;

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

            // Backend paginated response (loose typing to handle variations)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await apiClient.get<any>(url);
            console.log('My reports response (Employee):', response);

            // Robustly map pagination fields
            const responsePage = response.page ?? response.number ?? 0;
            const responseSize = response.size ?? 3;
            const totalElements = response.totalElements ?? response.total ?? response.total_elements ?? 0;
            const totalPages = response.totalPages ?? response.total_pages ?? 0;
            const content = response.content ?? response.data ?? [];

            // Map backend fields to frontend format
            const mappedReports: EmployeeReport[] = Array.isArray(content)
                ? content.map((item: BackendReport) => ({
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
                }))
                : [];

            console.log('Pagination Metadata (Employee):', { page: responsePage, size: responseSize, totalElements, totalPages });

            /**
             * SMART PAGINATION FIX (Backend Workaround)
             * The backend is returning wrong totalElements (e.g., 3 instead of 15).
             * Logic: If we received a full page of results (content.length === size),
             * we assume there is at least one more page available.
             */
            const currentCount = mappedReports.length;
            const calculatedMinTotal = (responsePage * responseSize) + currentCount;

            // If full page received, ensure total allows for next page
            const adjustedTotal = (currentCount >= responseSize)
                ? Math.max(totalElements, calculatedMinTotal + 1)
                : Math.max(totalElements, calculatedMinTotal);

            const adjustedTotalPages = Math.ceil(adjustedTotal / responseSize);

            // Return full paged response
            return {
                content: mappedReports,
                page: responsePage,
                size: responseSize,
                totalElements: adjustedTotal,
                totalPages: adjustedTotalPages,
            };
        } catch (error) {
            console.error('Error fetching my reports:', error);
            // Return empty paged response
            return {
                content: [],
                page: 0,
                size: size,
                totalElements: 0,
                totalPages: 0,
            };
        }
    },
};
