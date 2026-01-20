import { ReportStatus, ReportStatusLabels } from '@/types/dashboard';

interface StatusBadgeProps {
    status: ReportStatus;
    size?: 'sm' | 'md';
}

const statusColors: Record<ReportStatus, { bg: string; text: string }> = {
    DRAFT: { bg: 'hsl(210, 10%, 90%)', text: 'hsl(210, 10%, 40%)' },
    SENT: { bg: 'hsl(200, 85%, 92%)', text: 'hsl(200, 85%, 35%)' },
    REVIEWED: { bg: 'hsl(45, 90%, 88%)', text: 'hsl(45, 80%, 35%)' },
    APPROVED: { bg: 'hsl(158, 60%, 88%)', text: 'hsl(158, 64%, 25%)' },
    REJECTED: { bg: 'hsl(0, 70%, 92%)', text: 'hsl(0, 70%, 40%)' },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const colors = statusColors[status];
    const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

    return (
        <span
            className={`inline-flex items-center rounded-full font-medium ${sizeClasses}`}
            style={{ backgroundColor: colors.bg, color: colors.text }}
        >
            {ReportStatusLabels[status]}
        </span>
    );
}
