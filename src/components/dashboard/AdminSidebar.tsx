import { FileText } from 'lucide-react';
import BaseSidebar, { NavItem } from './BaseSidebar';

const NAV_ITEMS: NavItem[] = [
    { path: '/admin/informes', label: 'Ver Informes', icon: FileText },
];

interface AdminSidebarProps {
    userName: string;
    userRole: string;
}

/**
 * Admin sidebar - wraps BaseSidebar with admin-specific navigation and styling
 */
export default function AdminSidebar({ userName, userRole }: AdminSidebarProps) {
    return (
        <BaseSidebar
            navItems={NAV_ITEMS}
            variant="admin"
            userName={userName}
            userRole={userRole}
        />
    );
}
