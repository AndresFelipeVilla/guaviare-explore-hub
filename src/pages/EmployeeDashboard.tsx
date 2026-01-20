import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FileText, FolderOpen, Moon, Sun } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import ActionCard from '@/components/dashboard/ActionCard';
import ReportItem from '@/components/dashboard/ReportItem';
import { dashboardService } from '@/services/api/dashboardService';
import { authService } from '@/services/api/authService';
import { formatRole, getGreeting, getFirstName } from '@/utils/format';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function EmployeeDashboard() {
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Require authentication - employees only
    useRequireAuth({ allowedRoles: ['EMPLOYEE', 'EMPLEADO'] });

    // Get stored user data as initial fallback
    const storedUser = authService.getUser();

    // Fetch user profile (will update with fresh data from API)
    const { data: profile, isLoading: profileLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: () => dashboardService.getProfile(),
        enabled: authService.isAuthenticated(),
    });

    // Update stored user data when profile is fetched from API
    useEffect(() => {
        if (profile) {
            localStorage.setItem('userData', JSON.stringify({
                id: profile.id,
                email: profile.email,
                name: profile.name,
                role: profile.role,
                position: profile.position,
            }));
        }
    }, [profile]);

    // Fetch latest reports
    const { data: reports, isLoading: reportsLoading } = useQuery({
        queryKey: ['latestReports'],
        queryFn: () => dashboardService.getLatestReports(),
        enabled: authService.isAuthenticated(),
    });

    // Use API data if available, otherwise use stored data
    const userName = profile?.name || storedUser?.name || 'Usuario';
    const userRole = profile?.role || storedUser?.role || 'Empleado';
    const userPosition = profile?.position || storedUser?.position || '';

    const handleCreateReport = () => {
        navigate('/dashboard/informe');
    };

    const handleViewReports = () => {
        navigate('/dashboard/mis-informes');
    };

    const handleViewReport = (reportId: string) => {
        navigate(`/dashboard/informe/detalles/${reportId}`);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                userName={userName}
                userRole={userPosition || formatRole(userRole)}
            />

            {/* Main Content */}
            <main className="flex-1 p-8">
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

                {/* Welcome Section */}
                <section className="mb-8">
                    <p className="text-sm text-gray-500 mb-1">Mi espacio de trabajo</p>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {`${getGreeting()}, ${getFirstName(userName)}`}
                    </h2>
                </section>

                {/* Action Cards */}
                <section className="flex gap-6 mb-10">
                    <ActionCard
                        icon={<FileText className="w-6 h-6" />}
                        title="Crear Informe"
                        description="Inicia un nuevo informe detallado."
                        onClick={handleCreateReport}
                        variant="primary"
                    />
                    <ActionCard
                        icon={<FolderOpen className="w-6 h-6" />}
                        title="Ver mis Informes"
                        description="Revisa tus informes enviados y borradores."
                        onClick={handleViewReports}
                        variant="secondary"
                    />
                </section>

                {/* Latest Reports */}
                <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Últimos informes</h3>
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                        {reportsLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-4 animate-pulse">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                                            <div className="h-3 bg-gray-100 rounded w-2/3" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : reports && reports.length > 0 ? (
                            reports.map((report) => (
                                <ReportItem
                                    key={report.id}
                                    id={report.id}
                                    title={report.title}
                                    description={report.description}
                                    month={report.month}
                                    onViewMore={() => handleViewReport(report.id)}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-8">
                                No hay informes recientes. ¡Crea tu primer informe!
                            </p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
