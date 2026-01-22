import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;        // 0-indexed (como backend)
    totalPages: number;
    totalElements: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export default function Pagination({
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    onPageChange,
    className = '',
}: PaginationProps) {
    // Don't show if no items at all
    if (totalElements === 0) {
        return null;
    }

    // Ensure at least 1 page
    const safeCurrentPage = Math.max(0, currentPage);
    const safeTotalPages = Math.max(1, totalPages);

    const isFirstPage = safeCurrentPage === 0;
    const isLastPage = safeCurrentPage === safeTotalPages - 1;

    // Calculate range of items being shown
    const startItem = safeCurrentPage * pageSize + 1;
    const endItem = Math.min((safeCurrentPage + 1) * pageSize, totalElements);

    const handlePrevious = () => {
        if (!isFirstPage) {
            onPageChange(safeCurrentPage - 1);
        }
    };

    const handleNext = () => {
        if (!isLastPage) {
            onPageChange(safeCurrentPage + 1);
        }
    };

    // Generate array of page numbers to display
    const getPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5; // Maximum number of page buttons to show

        if (safeTotalPages <= maxVisiblePages) {
            // Show all pages if total is less than max visible
            for (let i = 0; i < safeTotalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(0);

            if (safeCurrentPage > 2) {
                pages.push('...');
            }

            // Show pages around current page
            const start = Math.max(1, safeCurrentPage - 1);
            const end = Math.min(safeTotalPages - 2, safeCurrentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }

            if (safeCurrentPage < safeTotalPages - 3) {
                pages.push('...');
            }

            // Always show last page
            if (!pages.includes(safeTotalPages - 1)) {
                pages.push(safeTotalPages - 1);
            }
        }

        return pages;
    };

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50 ${className}`}>
            {/* Info text */}
            <div className="text-sm text-gray-600">
                Mostrando{' '}
                <span className="font-medium text-gray-900">{startItem}</span>
                {' '}-{' '}
                <span className="font-medium text-gray-900">{endItem}</span>
                {' '}de{' '}
                <span className="font-medium text-gray-900">{totalElements}</span>
                {' '}informes
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-1">
                {/* Previous button */}
                <button
                    onClick={handlePrevious}
                    disabled={isFirstPage}
                    className={`
                        flex items-center justify-center w-10 h-10 rounded-lg border transition-all
                        ${isFirstPage
                            ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-200 hover:text-green-700'
                        }
                    `}
                    aria-label="Página anterior"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page number buttons */}
                {getPageNumbers().map((pageNum, index) => (
                    pageNum === '...' ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="w-10 h-10 flex items-center justify-center text-gray-500"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum as number)}
                            className={`
                                flex items-center justify-center w-10 h-10 rounded-lg border text-sm font-medium transition-all
                                ${safeCurrentPage === pageNum
                                    ? 'bg-green-700 text-white border-green-700'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-200 hover:text-green-700'
                                }
                            `}
                            aria-label={`Página ${(pageNum as number) + 1}`}
                            aria-current={safeCurrentPage === pageNum ? 'page' : undefined}
                        >
                            {(pageNum as number) + 1}
                        </button>
                    )
                ))}

                {/* Next button */}
                <button
                    onClick={handleNext}
                    disabled={isLastPage}
                    className={`
                        flex items-center justify-center w-10 h-10 rounded-lg border transition-all
                        ${isLastPage
                            ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-200 hover:text-green-700'
                        }
                    `}
                    aria-label="Página siguiente"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
