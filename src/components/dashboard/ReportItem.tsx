interface ReportItemProps {
    id?: string;
    title?: string;
    description?: string;
    month?: string;
    onViewMore?: () => void;
}

export default function ReportItem({ id, title, description, month, onViewMore }: ReportItemProps) {
    // Safe values with fallbacks
    const safeId = id ?? '';
    const safeTitle = title ?? 'Sin título';
    const safeDescription = description ?? '';

    // Generate initials from month or title (defensive)
    const getInitials = (): string => {
        if (month && month.length >= 2) {
            return month.slice(0, 2).toUpperCase();
        }
        if (safeTitle && safeTitle.length >= 2) {
            return safeTitle.slice(0, 2).toUpperCase();
        }
        // Fallback if title is too short or empty
        return safeTitle.slice(0, safeTitle.length).toUpperCase() || 'IN';
    };

    // Generate a color based on the id (defensive)
    const getAvatarColor = (): string => {
        const colors = [
            'hsl(200, 85%, 45%)',
            'hsl(158, 64%, 35%)',
            'hsl(280, 60%, 55%)',
            'hsl(45, 80%, 50%)',
            'hsl(0, 70%, 55%)',
        ];
        // Safe access: use first character code if exists, otherwise default to 0
        const charCode = safeId.length > 0 ? safeId.charCodeAt(0) : 0;
        const index = charCode % colors.length;
        return colors[index];
    };

    // Don't render if essential data is missing
    if (!id && !title) {
        return null;
    }

    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center gap-4">
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: getAvatarColor() }}
                >
                    {getInitials()}
                </div>
                <div>
                    <h4 className="font-medium text-gray-800 text-sm">{safeTitle}</h4>
                    <p className="text-xs text-gray-500 truncate max-w-md">{safeDescription}</p>
                </div>
            </div>
            <button
                onClick={onViewMore}
                className="text-sm font-medium transition-colors hover:underline"
                style={{ color: 'hsl(200, 85%, 45%)' }}
            >
                Ver más
            </button>
        </div>
    );
}

