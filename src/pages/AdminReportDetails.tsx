import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, FileDown, Loader2, AlertCircle, Calendar, User, FileText, Clock } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import StatusBadge from '@/components/dashboard/StatusBadge';
import ReportPDF from '@/components/pdf/ReportPDF';
import { dashboardService } from '@/services/api/dashboardService';
import { reportService } from '@/services/api/reportService';
import { authService } from '@/services/api/authService';
import { toast } from 'sonner';
import { ReportStatus } from '@/types/dashboard';


export default function AdminReportDetails() {
    const navigate = useNavigate();
    const { reportId } = useParams<{ reportId: string }>();

    // Get stored user data as initial fallback
    const storedUser = authService.getUser();

    // Check authentication and role
    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/auth');
            return;
        }

        // Redirect employees to their dashboard
        const role = storedUser?.role?.toUpperCase();
        if (role === 'EMPLOYEE' || role === 'EMPLEADO') {
            navigate('/dashboard');
        }
    }, [navigate, storedUser?.role]);

    // Fetch user profile
    const { data: profile } = useQuery({
        queryKey: ['profile'],
        queryFn: () => dashboardService.getProfile(),
        enabled: authService.isAuthenticated(),
    });

    // Fetch report details
    const { data: report, isLoading, error } = useQuery({
        queryKey: ['reportDetails', reportId],
        queryFn: () => reportService.getReportDetails(reportId!),
        enabled: !!reportId && authService.isAuthenticated(),
    });

    // Use API data if available, otherwise use stored data
    const userName = profile?.name || storedUser?.name || 'Administrador';
    const userRole = profile?.role || storedUser?.role || 'BOSS';
    const userPosition = profile?.position || storedUser?.position || '';

    // Format role for display
    const formatRole = (role: string) => {
        const roleMap: Record<string, string> = {
            'EMPLOYEE': 'Empleado',
            'BOSS': 'Jefe',
            'ADMIN': 'Administrador',
        };
        return roleMap[role?.toUpperCase()] || role;
    };

    // Format date for display
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No disponible';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    // Map backend status to frontend status
    const mapStatus = (status: string): ReportStatus => {
        const statusMap: Record<string, ReportStatus> = {
            'ENVIADO': 'SENT',
            'BORRADOR': 'DRAFT',
            'REVISADO': 'REVIEWED',
            'APROBADO': 'APPROVED',
            'RECHAZADO': 'REJECTED',
            'SENT': 'SENT',
            'DRAFT': 'DRAFT',
            'REVIEWED': 'REVIEWED',
            'APPROVED': 'APPROVED',
            'REJECTED': 'REJECTED',
        };
        return statusMap[status?.toUpperCase()] || 'SENT';
    };

    // Get status label in Spanish
    const getStatusLabel = (status: string): string => {
        const labelMap: Record<string, string> = {
            'DRAFT': 'Borrador',
            'BORRADOR': 'Borrador',
            'SENT': 'Enviado',
            'ENVIADO': 'Enviado',
            'REVIEWED': 'Revisado',
            'REVISADO': 'Revisado',
            'APPROVED': 'Aprobado',
            'APROBADO': 'Aprobado',
            'REJECTED': 'Rechazado',
            'RECHAZADO': 'Rechazado',
        };
        return labelMap[status?.toUpperCase()] || status;
    };

    // Handle PDF generation
    const handleGeneratePDF = async () => {
        if (!report) {
            toast.error('No hay datos del informe disponibles');
            return;
        }

        try {
            toast.info('Generando PDF...');

            // Generate PDF blob
            const blob = await pdf(<ReportPDF report={report} />).toBlob();

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Informe_${report.title.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;

            // Trigger download
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success('PDF generado exitosamente');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Error al generar el PDF');
        }
    };


    // Handle back navigation - goes back to admin reports list
    const handleBack = () => {
        navigate('/admin/informes');
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Admin Sidebar */}
            <AdminSidebar
                userName={userName}
                userRole={userPosition || formatRole(userRole)}
            />

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-lg font-semibold text-gray-800">
                            Secretaría de Cultura y Turismo
                        </h1>
                        <p className="text-sm text-gray-500">Departamento del Guaviare</p>
                    </div>
                </header>

                {/* Back Button and Actions */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Volver a Informes de Empleados</span>
                    </button>

                    <button
                        onClick={handleGeneratePDF}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                        <FileDown className="w-5 h-5" />
                        Generar PDF
                    </button>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                            <p className="text-gray-500">Cargando detalles del informe...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="p-6 rounded-xl bg-red-50 border border-red-200">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-lg font-semibold text-red-800 mb-1">
                                    Error al cargar el informe
                                </h3>
                                <p className="text-red-600 text-sm">
                                    No se pudo obtener los detalles del informe. Por favor, verifica tu conexión e intenta de nuevo.
                                </p>
                                <button
                                    onClick={handleBack}
                                    className="mt-4 px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors"
                                >
                                    Volver al listado
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Report Details Card */}
                {report && !isLoading && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Header Section */}
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        {report.title}
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={mapStatus(report.status)} />
                                        <span className="text-sm text-gray-500">
                                            {getStatusLabel(report.status)}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <FileText className="w-8 h-8 text-emerald-600" />
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6 space-y-6">
                            {/* Description */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Descripción
                                </h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {report.description || 'Sin descripción disponible'}
                                </p>
                            </div>

                            {/* Info Grid */}
                            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                                {/* Responsible */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-500 mb-1">
                                            Responsable
                                        </h4>
                                        <p className="text-gray-800 font-medium">
                                            {report.responsible || 'No asignado'}
                                        </p>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-emerald-50 rounded-lg">
                                        <FileText className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-500 mb-1">
                                            Estado Actual
                                        </h4>
                                        <p className="text-gray-800 font-medium">
                                            {getStatusLabel(report.status)}
                                        </p>
                                    </div>
                                </div>

                                {/* Sent At */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <Calendar className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-500 mb-1">
                                            Fecha de Envío
                                        </h4>
                                        <p className="text-gray-800 font-medium">
                                            {report.sentAt ? formatDate(report.sentAt) : 'No enviado aún'}
                                        </p>
                                    </div>
                                </div>

                                {/* Updated At */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-amber-50 rounded-lg">
                                        <Clock className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-500 mb-1">
                                            Última Actualización
                                        </h4>
                                        <p className="text-gray-800 font-medium">
                                            {formatDate(report.updatedAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                            <button
                                onClick={handleBack}
                                className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Volver
                            </button>
                            <button
                                onClick={handleGeneratePDF}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                <FileDown className="w-4 h-4" />
                                Generar PDF
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
