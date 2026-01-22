import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import ReportsTable from '@/components/dashboard/ReportsTable';
import { dashboardService } from '@/services/api/dashboardService';
import { authService } from '@/services/api/authService';
import { AlertCircle, Loader2 } from 'lucide-react';
import { formatRole } from '@/utils/format';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function AdminViewReports() {
    const navigate = useNavigate();
    const [pageError, setPageError] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(0);

    // Require admin/boss authentication
    useRequireAuth({ allowedRoles: ['BOSS', 'JEFE', 'ADMIN'] });

    // Get stored user data as initial fallback
    const storedUser = authService.getUser();

    // Fetch user profile
    const { data: profile, error: profileError, isLoading: profileLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: () => dashboardService.getProfile(),
        enabled: authService.isAuthenticated(),
        retry: false,
    });

    // Fetch all reports for admin with pagination
    const { data: reportsData, isLoading: reportsLoading, error: reportsError } = useQuery({
        queryKey: ['adminReports', currentPage],
        queryFn: () => dashboardService.getAdminReports(currentPage, 10),
        enabled: authService.isAuthenticated(),
        retry: false,
    });

    // Handler for page changes
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    // Use API data if available, otherwise use stored data
    const userName = profile?.name || storedUser?.name || 'Administrador';
    const userRole = profile?.role || storedUser?.role || 'BOSS';
    const userPosition = profile?.position || storedUser?.position || '';

    const handleViewReport = (reportId: string) => {
        console.log('Viewing report:', reportId);
        navigate(`/admin/informe/detalles/${reportId}`);
    };

    // Show loading state while checking auth
    if (profileLoading) {
        console.log('Still loading profile...');
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Cargando dashboard...</p>
                </div>
            </div>
        );
    }

    // Show error if there's a critical error
    if (pageError) {
        console.error('Page error:', pageError);
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-start gap-3 mb-4">
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                Error al cargar el dashboard
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">{pageError}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Recargar página
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    console.log('Rendering dashboard UI...');

    try {
        return (
            <div className="flex h-screen bg-gray-50 overflow-hidden">
                {/* Sidebar */}
                <AdminSidebar
                    userName={userName}
                    userRole={userPosition || formatRole(userRole)}
                />

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {/* Header */}
                    <header className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">
                            Informes de Empleados
                        </h1>
                        <p className="text-gray-500">
                            Revisa y gestiona todos los informes enviados por los empleados
                        </p>
                    </header>

                    {/* Error message for reports */}
                    {reportsError && (
                        <div className="mb-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-yellow-800 font-medium mb-1">
                                        No se pudieron cargar los informes
                                    </p>
                                    <p className="text-xs text-yellow-700">
                                        Se mostrarán datos de ejemplo. Verifica la conexión con el backend.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Reports Table */}
                    <ReportsTable
                        reports={reportsData?.content || []}
                        isLoading={reportsLoading}
                        onViewReport={handleViewReport}
                        paginationData={reportsData ? {
                            currentPage: reportsData.page,
                            totalPages: reportsData.totalPages,
                            totalElements: reportsData.totalElements,
                            pageSize: reportsData.size,
                        } : undefined}
                        onPageChange={handlePageChange}
                    />
                </main>
            </div>
        );
    } catch (error) {
        console.error('Error rendering dashboard:', error);
        setPageError(error instanceof Error ? error.message : 'Error desconocido al renderizar');
        return null;
    }
}
