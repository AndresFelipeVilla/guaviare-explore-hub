import { apiClient } from './client';
import {
    CreateReportRequest,
    CreateReportResponse,
    UpdateReportRequest,
    UpdateReportResponse,
    SubmitReportResponse,
    ReportDetailsResponse,
    Report,
} from '@/types/report';

// ============================================
// Report API Service
// ============================================

export const reportService = {
    /**
     * Create a new report
     * POST /api/reports
     * @param data - Report data to create
     * @returns Created report with reportId
     */
    async createReport(data: CreateReportRequest): Promise<CreateReportResponse> {
        const response = await apiClient.post<CreateReportResponse>('/api/reports', data);
        return response;
    },

    /**
     * Update an existing report
     * PUT /api/reports/{reportId}
     * @param reportId - ID of the report to update
     * @param data - Updated report data
     * @returns Updated report
     */
    async updateReport(reportId: string, data: UpdateReportRequest): Promise<UpdateReportResponse> {
        const response = await apiClient.put<UpdateReportResponse>(`/api/reports/${reportId}`, data);
        return response;
    },

    /**
     * Submit a report for review
     * POST /api/reports/{reportId}/submissions
     * @param reportId - ID of the report to submit
     * @returns Submission confirmation
     */
    async submitReport(reportId: string): Promise<SubmitReportResponse> {
        const response = await apiClient.post<SubmitReportResponse>(`/api/reports/${reportId}/submissions`);
        return response;
    },

    /**
     * Delete a report (only allowed for DRAFT status)
     * DELETE /api/reports/{reportId}
     * @param reportId - ID of the report to delete
     */
    async deleteReport(reportId: string): Promise<void> {
        await apiClient.delete(`/api/reports/${reportId}`);
    },

    /**
     * Get report details for "Ver Detalles" page
     * GET /api/reports/details/{reportId}
     * @param reportId - ID of the report to fetch
     * @returns Report details including responsible, status, dates
     */
    async getReportDetails(reportId: string): Promise<ReportDetailsResponse> {
        const response = await apiClient.get<ReportDetailsResponse>(`/api/reports/details/${reportId}`);
        return response;
    },

    /**
     * Get a single report by ID for editing
     * GET /api/reports/{reportId}
     * @param reportId - ID of the report to fetch
     * @returns Full report data for editing form
     */
    async getReportById(reportId: string): Promise<Report> {
        const response = await apiClient.get<Report>(`/api/reports/${reportId}`);
        return response;
    },
};

