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
export type ReportStatus = 'DRAFT' | 'SENT' | 'REVIEWED' | 'APPROVED' | 'REJECTED';

// Mapeo de estados a español
export const ReportStatusLabels: Record<ReportStatus, string> = {
    DRAFT: 'Borrador',
    SENT: 'Enviado',
    REVIEWED: 'Revisado',
    APPROVED: 'Aprobado',
    REJECTED: 'Rechazado',
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
    reviewed: number;
    approved: number;
    rejected: number;
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
    createdAt: string;
    updatedAt?: string;
    sentAt?: string;
}

