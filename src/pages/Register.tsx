import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import UserTypeSelector from '@/components/auth/UserTypeSelector';
import BossRegistrationForm from '@/components/auth/BossRegistrationForm';
import EmployeeRegistrationForm from '@/components/auth/EmployeeRegistrationForm';
import { UserType } from '@/types/auth';

export default function Register() {
    const [userType, setUserType] = useState<UserType>('boss');

    return (
        <AuthLayout>
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col max-h-full overflow-hidden">
                <div className="mb-3 flex-shrink-0">
                    <h2 className="text-xl sm:text-2xl font-bold mb-1" style={{ color: 'hsl(168, 75%, 21%)' }}>
                        Registro de Usuario
                    </h2>
                    <p className="text-xs sm:text-sm" style={{ color: 'hsl(168, 20%, 45%)' }}>
                        Crea una nueva cuenta institucional
                    </p>
                </div>

                {/* User Type Selector */}
                <div className="mb-3 flex-shrink-0">
                    <UserTypeSelector selectedType={userType} onTypeChange={setUserType} />
                </div>

                {/* Dynamic Registration Form */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                    {userType === 'boss' ? (
                        <BossRegistrationForm />
                    ) : (
                        <EmployeeRegistrationForm />
                    )}
                </div>

                {/* Back to Login Link */}
                <div className="mt-3 pt-3 border-t border-gray-100 text-center space-y-2 flex-shrink-0">
                    <p className="text-xs sm:text-sm" style={{ color: 'hsl(168, 20%, 45%)' }}>
                        ¿Ya tiene una cuenta?{' '}
                        <Link
                            to="/auth"
                            className="font-semibold transition-colors hover:underline"
                            style={{ color: 'hsl(168, 75%, 21%)' }}
                        >
                            Iniciar sesión
                        </Link>
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium transition-colors hover:underline"
                        style={{ color: 'hsl(168, 60%, 35%)' }}
                    >
                        <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                        Ir al inicio
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
