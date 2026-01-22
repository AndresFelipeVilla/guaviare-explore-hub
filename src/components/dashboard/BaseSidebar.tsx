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

interface BaseSidebarProps {
    navItems: NavItem[];
    variant?: 'employee' | 'admin';
    userName: string;
    userRole: string;
}

/**
 * Base sidebar component with configurable navigation and styling
 * Updated to single design for both Admin and Employee variants
 */
export default function BaseSidebar({
    navItems,
    variant = 'employee',
    userName,
    userRole,
}: BaseSidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();

    // Unified colors (Dark Green Theme)
    const sidebarBg = '#0d5e4e';
    const textColor = 'white';
    const textSecondary = 'rgba(255, 255, 255, 0.7)';
    const hoverBg = 'rgba(2, 148, 92, 0.2)';
    const activeBg = '#268673ff';
    const borderColor = 'rgba(255, 255, 255, 0.1)';
    const userInfoBg = 'rgba(255, 255, 255, 0.05)';

    const handleLogout = () => {
        authService.logout();
        toast.success('Sesión cerrada exitosamente');
        navigate('/auth');
    };

    return (
        <aside className="w-64 h-full flex flex-col" style={{ backgroundColor: sidebarBg }}>
            {/* Logo Section */}
            <div className="p-6 border-b" style={{ borderColor }}>
                <div className="flex items-center justify-center">
                    <img
                        src="/logo-verde.png"
                        alt="MiInforme Guaviare"
                        className="h-16 w-auto object-contain"
                    />
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
                            className={`flex items-center gap-3 px-4 py-3 transition-all text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}
                            style={{
                                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                color: isActive ? 'white' : textSecondary,
                                borderLeft: isActive ? '4px solid #4ade80' : '4px solid transparent', // Green accent line
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = hoverBg;
                                    e.currentTarget.style.color = 'white';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = textSecondary;
                                }
                            }}
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}

                <button
                    onClick={handleLogout}
                    aria-label="Cerrar sesión"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium"
                    style={{ color: textSecondary }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = hoverBg;
                        e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = textSecondary;
                    }}
                >
                    <LogOut className="w-5 h-5" />
                    Cerrar Sesión
                </button>
            </nav>

            {/* User Info */}
            <div className="p-4 border-t" style={{ borderColor }}>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: userInfoBg }}>
                    {/* Unified User Info: No Avatar for anyone, Uppercase Role */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'white' }}>
                            {userName}
                        </p>
                        <p className="text-xs" style={{ color: textSecondary }}>
                            {userRole.toUpperCase()}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
