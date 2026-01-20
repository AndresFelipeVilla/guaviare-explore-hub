import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, LucideIcon } from 'lucide-react';
import { authService } from '@/services/api/authService';
import { toast } from 'sonner';
import { getInitials } from '@/utils/format';

/**
 * Navigation item configuration
 */
export interface NavItem {
    path: string;
    label: string;
    icon: LucideIcon;
}

/**
 * Sidebar color variant configuration
 */
interface VariantConfig {
    logoBg: string;
    avatarBg: string;
    subtitle: string;
}

const VARIANT_CONFIGS: Record<'employee' | 'admin', VariantConfig> = {
    employee: {
        logoBg: 'hsl(210, 29%, 35%)',
        avatarBg: 'hsl(200, 85%, 45%)',
        subtitle: 'GUAVIARE',
    },
    admin: {
        logoBg: 'hsl(158, 64%, 35%)',
        avatarBg: 'hsl(158, 64%, 35%)',
        subtitle: 'GUAVIARE · Admin',
    },
};

interface BaseSidebarProps {
    navItems: NavItem[];
    variant?: 'employee' | 'admin';
    userName: string;
    userRole: string;
}

/**
 * Base sidebar component with configurable navigation and styling
 */
export default function BaseSidebar({
    navItems,
    variant = 'employee',
    userName,
    userRole,
}: BaseSidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const config = VARIANT_CONFIGS[variant];

    const handleLogout = () => {
        authService.logout();
        toast.success('Sesión cerrada exitosamente');
        navigate('/auth');
    };

    return (
        <aside className="w-64 min-h-screen flex flex-col" style={{ backgroundColor: 'hsl(210, 29%, 24%)' }}>
            {/* Logo Section */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                        style={{ backgroundColor: config.logoBg, color: 'white' }}
                    >
                        M
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-sm">MiInforme</h1>
                        <p className="text-white/60 text-xs">{config.subtitle}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${isActive
                                ? 'bg-white/15 text-white'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}

                <button
                    onClick={handleLogout}
                    aria-label="Cerrar sesión"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
                >
                    <LogOut className="w-5 h-5" />
                    Cerrar Sesión
                </button>
            </nav>

            {/* User Info */}
            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'hsl(210, 29%, 20%)' }}>
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: config.avatarBg, color: 'white' }}
                    >
                        {getInitials(userName)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{userName}</p>
                        <p className="text-white/60 text-xs">{userRole}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
