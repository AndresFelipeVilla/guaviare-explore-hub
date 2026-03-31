// ============================================
// Dashboard Types
// ============================================

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
    position?: string;
    department?: string;
}

export interface ReportSummary {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    month?: string;
}

export interface LatestReportsResponse {
    reports: ReportSummary[];
}

// ============================================
// Admin Dashboard Types
// ============================================

// Estados posibles de un informe
export type ReportStatus = 'DRAFT' | 'SENT' | 'APPROVED' | 'RETURNED';

// Mapeo de estados a español
export const ReportStatusLabels: Record<ReportStatus, string> = {
    DRAFT: 'Borrador',
    SENT: 'Enviado',
    APPROVED: 'Aprobado',
    RETURNED: 'Devuelto',
};

// Informe completo con información del empleado para admin
export interface AdminReport {
    id: string;
    title: string;
    description: string;
    status: ReportStatus;
    employeeName: string;
    employeePosition?: string;
    createdAt: string;
    sentAt?: string;
}

// Parámetros de filtro para informes
export interface ReportFilters {
    status?: ReportStatus;
    search?: string;
}

// Respuesta paginada de informes para admin
export interface AdminReportsResponse {
    reports: AdminReport[];
    totalCount: number;
    page: number;
    pageSize: number;
}

// Estadísticas de informes
export interface ReportsStats {
    total: number;
    draft: number;
    sent: number;
    approved: number;
    returned: number;
}

// ============================================
// Employee Reports Types
// ============================================

// Informe completo para vista del empleado
export interface EmployeeReport {
    id: string;
    title: string;
    description: string;
    activities?: string;
    objective?: string;
    evidencieLink?: string;
    status: ReportStatus;
    observation?: string;
    createdAt: string;
    updatedAt?: string;
    sentAt?: string;
}

// ============================================
// Pagination Types
// ============================================

// Generic paginated response type
export interface PagedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

// Specific paged responses
export type PagedAdminReports = PagedResponse<AdminReport>;
export type PagedEmployeeReports = PagedResponse<EmployeeReport>;
