import { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full flex">
            {/* Left Side - Landscape Illustration */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-700 overflow-hidden">
                {/* Background Image */}
                <img
                    src="/guaviare-landscape.png"
                    alt="Paisaje del Guaviare"
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-transparent to-emerald-800/40" />

                {/* Branding Content */}
                <div className="relative z-10 flex flex-col justify-end p-12 text-white">
                    <h1 className="text-4xl font-bold mb-3">
                        MilInforme Guaviare
                    </h1>
                    <p className="text-lg text-emerald-100/90 max-w-md">
                        Portal Institucional de Gestión de Informes
                    </p>
                </div>
            </div>

            {/* Right Side - Form Container */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gray-50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo (visible only on smaller screens) */}
                    <div className="lg:hidden text-center mb-8">
                        <h1 className="text-2xl font-bold" style={{ color: 'hsl(168, 75%, 21%)' }}>
                            MilInforme Guaviare
                        </h1>
                        <p className="text-sm" style={{ color: 'hsl(168, 20%, 45%)' }}>
                            Portal Institucional de Gestión de Informes
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
