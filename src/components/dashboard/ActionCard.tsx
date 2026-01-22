import { ReactNode } from 'react';

interface ActionCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
}

export default function ActionCard({ icon, title, description, onClick, variant = 'primary' }: ActionCardProps) {
    // Unified green theme colors for all action cards to match application branding
    const iconBgColor = 'rgba(2, 148, 92, 0.1)';
    const iconColor = '#02945c';

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
