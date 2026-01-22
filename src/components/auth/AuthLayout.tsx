import { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="h-screen w-full flex overflow-hidden">
            {/* Left Side - Landscape Illustration */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-700 overflow-hidden">
                {/* Background Image */}
                <img
                    src="/ImageLogin.jpg"
                    alt="Paisaje del Guaviare"
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-transparent to-emerald-800/40" />

                {/* Branding Content */}
                <div className="relative z-10 flex flex-col justify-end p-8 lg:p-10 text-white">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                        Mi Informe Guaviare
                    </h1>
                    <p className="text-base lg:text-lg text-emerald-100/90 max-w-md">
                        Portal Institucional de Gestión de Informes
                    </p>
                </div>
            </div>

            {/* Right Side - Form Container */}
            <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50 overflow-hidden">
                <div className="w-full max-w-md h-full max-h-[calc(100vh-2rem)] flex flex-col justify-center">
                    {/* Mobile Logo (visible only on smaller screens) */}
                    <div className="lg:hidden text-center mb-4 flex-shrink-0">
                        <h1 className="text-xl font-bold" style={{ color: 'hsl(168, 75%, 21%)' }}>
                            Mi Informe Guaviare
                        </h1>
                        <p className="text-xs" style={{ color: 'hsl(168, 20%, 45%)' }}>
                            Portal Institucional de Gestión de Informes
                        </p>
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-h-0">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
