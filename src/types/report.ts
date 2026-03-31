// ============================================
// Report Types
// ============================================

/**
 * Request payload for creating a new report
 */
export interface CreateReportRequest {
    title: string;
    description: string;
    activities: string;
    objective: string;
    evidencieLink: string;
}

/**
 * Request payload for updating an existing report
 */
export interface UpdateReportRequest {
    title: string;
    description: string;
    activities: string;
    objective: string;
    evidencieLink: string;
}

/**
 * Response from creating a report
 */
export interface CreateReportResponse {
    reportId: string;
    title?: string;
    description?: string;
    activities?: string;
    objective?: string;
    evidencieLink?: string;
    status?: string;
    createdAt?: string;
}

/**
 * Response from updating a report
 */
export interface UpdateReportResponse {
    reportId: string;
    title?: string;
    description?: string;
    activities?: string;
    objective?: string;
    evidencieLink?: string;
    status?: string;
    updatedAt?: string;
}

/**
 * Response from submitting a report
 */
export interface SubmitReportResponse {
    reportId: string;
    status: string;
    submittedAt?: string;
    message?: string;
}

/**
 * Full report data structure
 */
export interface Report {
    reportId: string;
    title: string;
    description: string;
    activities: string;
    objective: string;
    evidencieLink: string;
    status: 'DRAFT' | 'SENT' | 'REVIEWED' | 'APPROVED' | 'RETURNED';
    createdAt: string;
    updatedAt?: string;
    submittedAt?: string;
}

/**
 * Response from GET /api/reports/details/{reportId}
 * Used for the "Ver Detalles" page and "Edit Report" form
 */
export interface ReportDetailsResponse {
    reportId: string;
    title: string;
    description: string;
    activities: string;
    objective: string;
    evidencieLink: string;
    responsible: string;
    status: 'DRAFT' | 'SENT' | 'REVIEWED' | 'APPROVED' | 'RETURNED';
    observation?: string;
    sentAt?: string;
    updatedAt?: string;
}

/**
 * Request payload for returning a report with an observation
 */
export interface ReturnReportRequest {
    observation: string;
}
