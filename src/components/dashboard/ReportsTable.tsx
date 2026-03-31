import { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, Eye } from 'lucide-react';
import { AdminReport, ReportStatus, ReportStatusLabels } from '@/types/dashboard';
import StatusBadge from './StatusBadge';
import Pagination from '@/components/ui/Pagination';

interface ReportsTableProps {
    reports: AdminReport[];
    isLoading?: boolean;
    onViewReport?: (reportId: string) => void;
    paginationData?: {
        currentPage: number;
        totalPages: number;
        totalElements: number;
        pageSize: number;
    };
    onPageChange?: (page: number) => void;
}

const statusOptions: { value: ReportStatus | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'Todos los estados' },
    { value: 'SENT', label: 'Enviado' },
    { value: 'APPROVED', label: 'Aprobado' },
    { value: 'RETURNED', label: 'Devuelto' },
    { value: 'DRAFT', label: 'Borrador' },
];

export default function ReportsTable({ reports, isLoading, onViewReport, paginationData, onPageChange }: ReportsTableProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<ReportStatus | 'ALL'>('ALL');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter reports based on search and status
    const filteredReports = useMemo(() => {
        // Ensure reports is always an array
        const reportsArray = Array.isArray(reports) ? reports : [];

        return reportsArray.filter((report) => {
            // Status filter
            if (statusFilter !== 'ALL' && report.status !== statusFilter) {
                return false;
            }
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    (report.title?.toLowerCase().includes(query) || false) ||
                    (report.employeeName?.toLowerCase().includes(query) || false)
                );
            }
            return true;
        });
    }, [reports, searchQuery, statusFilter]);

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Get initials from name
    const getInitials = (name: string) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Get avatar color based on name
    const getAvatarColor = (name: string) => {
        const colors = [
            'hsl(200, 85%, 45%)',
            'hsl(158, 64%, 35%)',
            'hsl(280, 60%, 55%)',
            'hsl(45, 80%, 50%)',
            'hsl(340, 70%, 55%)',
        ];
        if (!name) return colors[0];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Header with Search and Filter */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por título o empleado..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-all text-sm font-medium text-gray-700 bg-white min-w-[180px]"
                        >
                            <Filter className="w-4 h-4" />
                            <span className="flex-1 text-left">
                                {statusOptions.find((o) => o.value === statusFilter)?.label}
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFilterOpen && (
                            <div className="absolute right-0 top-full mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-lg z-10">
                                {statusOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setStatusFilter(option.value);
                                            setIsFilterOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${statusFilter === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                            } ${option.value === 'ALL' ? 'rounded-t-lg' : ''} ${option.value === 'DRAFT' ? 'rounded-b-lg' : ''}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="p-8">
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4 animate-pulse">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                                    </div>
                                    <div className="h-6 bg-gray-200 rounded-full w-20" />
                                    <div className="h-4 bg-gray-100 rounded w-24" />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-1">No se encontraron informes</h3>
                        <p className="text-gray-500 text-sm">
                            {searchQuery
                                ? 'Intenta con otros términos de búsqueda'
                                : 'No hay informes con el estado seleccionado'}
                        </p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Empleado
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Título del Informe
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredReports.map((report) => (
                                <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                                                style={{ backgroundColor: getAvatarColor(report.employeeName) }}
                                            >
                                                {getInitials(report.employeeName)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 text-sm">{report.employeeName}</p>
                                                {report.employeePosition && (
                                                    <p className="text-xs text-gray-500">{report.employeePosition}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-800 text-sm">{report.title}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-xs">{report.description}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={report.status} size="sm" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-600">
                                            {formatDate(report.sentAt || report.createdAt)}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onViewReport?.(report.id)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100"
                                            style={{ color: 'hsl(200, 85%, 45%)' }}
                                        >
                                            <Eye className="w-4 h-4" />
                                            Ver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {paginationData && onPageChange && (
                <Pagination
                    currentPage={paginationData.currentPage}
                    totalPages={paginationData.totalPages}
                    totalElements={paginationData.totalElements}
                    pageSize={paginationData.pageSize}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
}
