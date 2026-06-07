import { useState, useCallback } from 'react';
import { Search, Filter, ChevronDown, Edit3, Trash2, Eye, FileText, Loader2, MessageSquare, RotateCcw } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { toast } from 'sonner';
import { EmployeeReport, ReportStatus, ReportFilters } from '@/types/dashboard';
import StatusBadge from './StatusBadge';
import ReportPDF from '@/components/pdf/ReportPDF';
import { reportService } from '@/services/api/reportService';
import Pagination from '@/components/ui/Pagination';

interface EmployeeReportCardProps {
    report: EmployeeReport;
    userName: string;
    onEdit?: (reportId: string) => void;
    onDelete?: (reportId: string) => void;
    onView?: (reportId: string) => void;
}

export function EmployeeReportCard({ report, userName, onEdit, onDelete, onView }: EmployeeReportCardProps) {
    const isDraft = report.status === 'DRAFT';
    const isReturned = report.status === 'RETURNED';
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Handle PDF generation
    const handleGeneratePDF = async () => {
        try {
            setIsGeneratingPdf(true);
            toast.info('Obteniendo datos del informe...');

            // 🔑 SOLUCIÓN: Obtener datos completos del informe antes de generar PDF
            // Esto garantiza que el PDF contenga TODA la información,
            // igual que cuando se genera desde la vista de detalles
            const fullReportDetails = await reportService.getReportDetails(report.id);

            toast.info('Generando PDF...');

            // Generate PDF blob con datos completos
            const blob = await pdf(<ReportPDF report={fullReportDetails} />).toBlob();

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
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {report.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {isDraft
                            ? `Última Modificación: ${formatDate(report.updatedAt || report.createdAt)}`
                            : `Fecha de Envío: ${formatDate(report.sentAt || report.createdAt)}`
                        }
                    </p>
                </div>
                <StatusBadge status={report.status} size="sm" />
            </div>

            {/* Description */}
            <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Descripción</h4>
                <p className="text-sm text-gray-600 line-clamp-3">
                    {report.description || 'Sin descripción disponible'}
                </p>
            </div>

            {/* Observation callout for RETURNED reports */}
            {isReturned && report.observation && (
                <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-semibold text-amber-700 mb-0.5">Observación del jefe:</p>
                        <p className="text-sm text-amber-800 leading-relaxed">{report.observation}</p>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
                {isDraft ? (
                    <>
                        <button
                            onClick={() => onEdit?.(report.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                            <Edit3 className="w-4 h-4" />
                            Continuar Editando
                        </button>
                        <button
                            onClick={() => onDelete?.(report.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Descartar Borrador
                        </button>
                    </>
                ) : isReturned ? (
                    <>
                        <button
                            onClick={() => onEdit?.(report.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Corregir y Reenviar
                        </button>
                        <button
                            onClick={() => onView?.(report.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-transparent border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            Ver Detalles
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => onView?.(report.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-transparent border border-green-600 text-green-700 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            Ver Detalles
                        </button>
                        <button
                            onClick={handleGeneratePDF}
                            disabled={isGeneratingPdf}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            {isGeneratingPdf ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <FileText className="w-4 h-4" />
                            )}
                            {isGeneratingPdf ? 'Generando...' : 'Generar PDF'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

// ============================================
// Employee Reports List Component
// ============================================

interface EmployeeReportsListProps {
    reports: EmployeeReport[];
    isLoading?: boolean;
    userName: string;
    onEdit?: (reportId: string) => void;
    onDelete?: (reportId: string) => void;
    onView?: (reportId: string) => void;
    paginationData?: {
        currentPage: number;
        totalPages: number;
        totalElements: number;
        pageSize: number;
    };
    onPageChange?: (page: number) => void;
    onFilterChange?: (filters: ReportFilters) => void;
}

const statusOptions: { value: ReportStatus | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'Todos los Estados' },
    { value: 'DRAFT', label: 'Borrador' },
    { value: 'SENT', label: 'Enviado' },
    { value: 'APPROVED', label: 'Aprobado' },
    { value: 'RETURNED', label: 'Devuelto' },
];

export default function EmployeeReportsList({
    reports,
    isLoading,
    userName,
    onEdit,
    onDelete,
    onView,
    paginationData,
    onPageChange,
    onFilterChange
}: EmployeeReportsListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<ReportStatus | 'ALL'>('ALL');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

    // Emit filter changes to parent for server-side filtering
    const emitFilterChange = useCallback((search: string, status: ReportStatus | 'ALL') => {
        if (onFilterChange) {
            onFilterChange({
                search: search || undefined,
                status: status === 'ALL' ? undefined : status,
            });
        }
    }, [onFilterChange]);

    // Handle search input with debounce
    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value);
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        const timeout = setTimeout(() => {
            emitFilterChange(value, statusFilter);
        }, 400);
        setSearchTimeout(timeout);
    }, [searchTimeout, statusFilter, emitFilterChange]);

    // Handle status filter change
    const handleStatusChange = useCallback((status: ReportStatus | 'ALL') => {
        setStatusFilter(status);
        setIsFilterOpen(false);
        emitFilterChange(searchQuery, status);
    }, [searchQuery, emitFilterChange]);

    // Handle search button click
    const handleSearchClick = useCallback(() => {
        emitFilterChange(searchQuery, statusFilter);
    }, [searchQuery, statusFilter, emitFilterChange]);

    return (
        <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Buscar Informe
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Título, palabra clave..."
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full pl-4 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="sm:w-64">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filtrar por Estado
                        </label>
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-all text-sm text-gray-700 bg-white"
                            >
                                <span className="flex-1 text-left">
                                    {statusOptions.find((o) => o.value === statusFilter)?.label}
                                </span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isFilterOpen && (
                                <div className="absolute right-0 top-full mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-lg z-10">
                                    {statusOptions.map((option, index) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                handleStatusChange(option.value);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${statusFilter === option.value ? 'bg-green-50 text-green-700' : 'text-gray-700'
                                                } ${index === 0 ? 'rounded-t-lg' : ''} ${index === statusOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Search Button */}
                    <div className="sm:w-32 flex items-end">
                        <button
                            onClick={handleSearchClick}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors"
                        >
                            <Search className="w-4 h-4" />
                            Buscar
                        </button>
                    </div>
                </div>
            </div>

            {/* Reports List */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
                                    <div className="h-4 bg-gray-100 rounded w-1/4" />
                                </div>
                                <div className="h-6 bg-gray-200 rounded-full w-20" />
                            </div>
                            <div className="h-4 bg-gray-100 rounded w-1/5 mb-3" />
                            <div className="h-4 bg-gray-100 rounded w-full mb-4" />
                            <div className="flex gap-3">
                                <div className="h-9 bg-gray-200 rounded-lg w-32" />
                                <div className="h-9 bg-gray-200 rounded-lg w-32" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : reports.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
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
                <div className="space-y-4">
                    {reports.map((report) => (
                        <EmployeeReportCard
                            key={report.id}
                            report={report}
                            userName={userName}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onView={onView}
                        />
                    ))}
                </div>
            )}

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
