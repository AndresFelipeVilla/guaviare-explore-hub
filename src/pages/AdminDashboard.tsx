import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FileText, Users, CheckCircle, Clock, Moon, Sun } from 'lucide-react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import { dashboardService } from '@/services/api/dashboardService';
import { authService } from '@/services/api/authService';
import { ReportsStats } from '@/types/dashboard';
import { formatRole, getGreeting, getFirstName } from '@/utils/format';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Require admin/boss authentication
    useRequireAuth({ allowedRoles: ['BOSS', 'JEFE', 'ADMIN'] });

    // Get stored user data as initial fallback
    const storedUser = authService.getUser();

    // Fetch user profile
    const { data: profile } = useQuery({
        queryKey: ['profile'],
        queryFn: () => dashboardService.getProfile(),
        enabled: authService.isAuthenticated(),
    });

    // Fetch reports stats
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['reportsStats'],
        queryFn: () => dashboardService.getReportsStats(),
        enabled: authService.isAuthenticated(),
    });

    // Use API data if available, otherwise use stored data
    const userName = profile?.name || storedUser?.name || 'Administrador';
    const userRole = profile?.role || storedUser?.role || 'BOSS';
    const userPosition = profile?.position || storedUser?.position || '';


    // Stats cards data
    const statsCards = [
        {
            label: 'Total Informes',
            value: stats?.total || 0,
            icon: FileText,
            color: 'hsl(200, 85%, 45%)',
            bgColor: 'hsl(200, 85%, 95%)',
        },
        {
            label: 'Pendientes',
            value: stats?.sent || 0,
            icon: Clock,
            color: 'hsl(45, 80%, 45%)',
            bgColor: 'hsl(45, 90%, 92%)',
        },
        {
            label: 'Aprobados',
            value: stats?.approved || 0,
            icon: CheckCircle,
            color: 'hsl(158, 64%, 35%)',
            bgColor: 'hsl(158, 60%, 92%)',
        },
        {
            label: 'Empleados',
            value: '-',
            icon: Users,
            color: 'hsl(280, 60%, 55%)',
            bgColor: 'hsl(280, 60%, 95%)',
        },
    ];

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
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-lg font-semibold text-gray-800">
                            Secretaría de Cultura y Turismo
                        </h1>
                        <p className="text-sm text-gray-500">Panel de Administración</p>
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
                    <p className="text-sm text-gray-500 mb-1">Panel de control</p>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {`${getGreeting()}, ${getFirstName(userName)}`}
                    </h2>
                </section>

                {/* Stats Cards */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {statsCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: stat.bgColor }}
                                    >
                                        <Icon className="w-6 h-6" style={{ color: stat.color }} />
                                    </div>
                                    {statsLoading ? (
                                        <div className="w-10 h-8 bg-gray-200 rounded animate-pulse" />
                                    ) : (
                                        <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                            </div>
                        );
                    })}
                </section>

                {/* Quick Actions */}
                <section className="mb-10">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones rápidas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button
                            onClick={() => navigate('/admin/informes')}
                            className="flex items-center gap-4 bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-gray-200 text-left group"
                        >
                            <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                                style={{ backgroundColor: 'hsl(200, 85%, 95%)', color: 'hsl(200, 85%, 45%)' }}
                            >
                                <FileText className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-1">Ver Informes</h4>
                                <p className="text-sm text-gray-500">Revisa y gestiona los informes de empleados</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/admin/informes?status=SENT')}
                            className="flex items-center gap-4 bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-gray-200 text-left group"
                        >
                            <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                                style={{ backgroundColor: 'hsl(45, 90%, 92%)', color: 'hsl(45, 80%, 45%)' }}
                            >
                                <Clock className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-1">Informes Pendientes</h4>
                                <p className="text-sm text-gray-500">
                                    {stats?.sent || 0} informes esperando revisión
                                </p>
                            </div>
                        </button>
                    </div>
                </section>

                {/* Info Banner */}
                <section>
                    <div
                        className="rounded-xl p-6"
                        style={{ backgroundColor: 'hsl(158, 60%, 95%)', borderLeft: '4px solid hsl(158, 64%, 35%)' }}
                    >
                        <h4 className="font-semibold mb-2" style={{ color: 'hsl(158, 64%, 25%)' }}>
                            Bienvenido al Panel de Administración
                        </h4>
                        <p className="text-sm" style={{ color: 'hsl(158, 40%, 35%)' }}>
                            Desde aquí podrás revisar todos los informes enviados por los empleados de la Secretaría.
                            Utiliza los filtros para buscar informes específicos por estado o título.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}
