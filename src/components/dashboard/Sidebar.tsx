import { Home, FilePlus, FolderOpen } from 'lucide-react';
import BaseSidebar, { NavItem } from './BaseSidebar';

const NAV_ITEMS: NavItem[] = [
    { path: '/dashboard', label: 'Inicio', icon: Home },
    { path: '/dashboard/informe', label: 'Crear Informe', icon: FilePlus },
    { path: '/dashboard/mis-informes', label: 'Ver mis Informes', icon: FolderOpen },
];

interface SidebarProps {
    userName: string;
    userRole: string;
}

/**
 * Employee sidebar - wraps BaseSidebar with employee-specific navigation
 */
export default function Sidebar({ userName, userRole }: SidebarProps) {
    return (
        <BaseSidebar
            navItems={NAV_ITEMS}
            variant="employee"
            userName={userName}
            userRole={userRole}
        />
    );
}
