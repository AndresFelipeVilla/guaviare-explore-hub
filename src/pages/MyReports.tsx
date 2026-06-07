import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Moon, Sun, AlertCircle, Loader2 } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import EmployeeReportsList from '@/components/dashboard/EmployeeReportsList';
import { dashboardService } from '@/services/api/dashboardService';
import { reportService } from '@/services/api/reportService';
import { authService } from '@/services/api/authService';
import { toast } from 'sonner';
import { formatRole } from '@/utils/format';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { ReportFilters } from '@/types/dashboard';

export default function MyReports() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [reportToDelete, setReportToDelete] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [filters, setFilters] = useState<ReportFilters>({});

    // Require employee authentication
    useRequireAuth({ allowedRoles: ['EMPLOYEE', 'EMPLEADO'] });

    // Get stored user data as initial fallback
    const storedUser = authService.getUser();

    // Fetch user profile
    const { data: profile } = useQuery({
        queryKey: ['profile'],
        queryFn: () => dashboardService.getProfile(),
        enabled: authService.isAuthenticated(),
    });

    // Fetch my reports with pagination and filters
    const { data: reportsData, isLoading: reportsLoading, error: reportsError } = useQuery({
        queryKey: ['myReports', currentPage, filters],
        queryFn: () => dashboardService.getMyReports(currentPage, 3, filters),
        enabled: authService.isAuthenticated(),
    });

    // Handler for page changes
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    // Handler for filter changes from list component
    const handleFilterChange = useCallback((newFilters: ReportFilters) => {
        setFilters(newFilters);
        setCurrentPage(0); // Reset to first page when filters change
    }, []);

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (reportId: string) => reportService.deleteReport(reportId),
        onSuccess: () => {
            toast.success('Borrador eliminado exitosamente');
            queryClient.invalidateQueries({ queryKey: ['myReports'] });
            setDeleteModalOpen(false);
            setReportToDelete(null);
        },
        onError: (error) => {
            console.error('Error deleting report:', error);
            toast.error('Error al eliminar el borrador. Por favor, intenta de nuevo.');
        },
    });

    // Use API data if available, otherwise use stored data
    const userName = profile?.name || storedUser?.name || 'Usuario';
    const userRole = profile?.role || storedUser?.role || 'Empleado';
    const userPosition = profile?.position || storedUser?.position || '';

    const handleEditReport = (reportId: string) => {
        // Navigate to edit page with report ID
        navigate(`/dashboard/informe/${reportId}`);
    };

    const handleDeleteReport = (reportId: string) => {
        setReportToDelete(reportId);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (reportToDelete) {
            deleteMutation.mutate(reportToDelete);
        }
    };

    const handleViewReport = (reportId: string) => {
        navigate(`/dashboard/informe/detalles/${reportId}`);
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <Sidebar
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
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {isDarkMode ? (
                            <Sun className="w-5 h-5 text-gray-600" />
                        ) : (
                            <Moon className="w-5 h-5 text-gray-600" />
                        )}
                    </button>
                </header>

                {/* Title Section */}
                <section className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">
                        Mis Informes Enviados y Borradores
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Aquí puedes ver, gestionar y realizar seguimiento a todos tus informes.
                    </p>
                </section>

                {/* Error message */}
                {reportsError && (
                    <div className="mb-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-yellow-800 font-medium mb-1">
                                    No se pudieron cargar los informes
                                </p>
                                <p className="text-xs text-yellow-700">
                                    Verifica la conexión con el backend y vuelve a intentar.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reports List */}
                <EmployeeReportsList
                    reports={reportsData?.content || []}
                    isLoading={reportsLoading}
                    userName={userName || 'Usuario'}
                    onEdit={handleEditReport}
                    onDelete={handleDeleteReport}
                    onView={handleViewReport}
                    paginationData={reportsData ? {
                        currentPage: reportsData.page,
                        totalPages: reportsData.totalPages,
                        totalElements: reportsData.totalElements,
                        pageSize: reportsData.size,
                    } : undefined}
                    onPageChange={handlePageChange}
                    onFilterChange={handleFilterChange}
                />
            </main>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            ¿Descartar borrador?
                        </h3>
                        <p className="text-gray-600 text-sm mb-6">
                            Esta acción eliminará permanentemente el borrador del informe. Esta acción no se puede deshacer.
                        </p>
                        <div className="flex items-center gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setDeleteModalOpen(false);
                                    setReportToDelete(null);
                                }}
                                className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                                disabled={deleteMutation.isPending}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleteMutation.isPending}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {deleteMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Eliminando...
                                    </>
                                ) : (
                                    'Eliminar borrador'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
