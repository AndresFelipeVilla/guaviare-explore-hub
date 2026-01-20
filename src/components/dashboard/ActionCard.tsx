import { ReactNode } from 'react';

interface ActionCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
}

export default function ActionCard({ icon, title, description, onClick, variant = 'primary' }: ActionCardProps) {
    const iconBgColor = variant === 'primary'
        ? 'hsl(200, 85%, 95%)'
        : 'hsl(0, 70%, 95%)';
    const iconColor = variant === 'primary'
        ? 'hsl(200, 85%, 45%)'
        : 'hsl(0, 70%, 55%)';

    return (
        <button
            onClick={onClick}
            className="flex-1 bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-gray-200 text-center group"
        >
            <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: iconBgColor, color: iconColor }}
            >
                {icon}
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </button>
    );
}
