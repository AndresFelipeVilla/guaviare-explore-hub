import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterBoss } from '@/hooks/useAuth';
import { validateBossRegistrationForm } from '@/services/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, Loader2, AlertCircle } from 'lucide-react';

export default function BossRegistrationForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        position: '',
        department: '',
        bossCode: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string>('');

    const registerMutation = useRegisterBoss();

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
        // Clear general error when user starts typing
        if (generalError) {
            setGeneralError('');
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrors({});
        setGeneralError('');

        console.log('Form submission started with data:', { ...formData, password: '***' });

        // Validate form
        const validation = validateBossRegistrationForm(formData);
        if (!validation.isValid) {
            console.log('Validation failed:', validation.errors);
            const errorMap: Record<string, string> = {};
            validation.errors.forEach((error) => {
                errorMap[error.field] = error.message;
            });
            setErrors(errorMap);
            return;
        }

        console.log('Form validation passed, submitting to API...');

        // Submit registration
        registerMutation.mutate(formData, {
            onSuccess: (data) => {
                console.log('Registration API call successful:', data);

                // Wait a bit to ensure localStorage has been updated by authService
                // This prevents race conditions with the AdminDashboard auth check
                setTimeout(() => {
                    // Verify authentication before redirecting
                    const token = localStorage.getItem('authToken');
                    const userData = localStorage.getItem('userData');

                    console.log('Post-registration state:', {
                        hasToken: !!token,
                        hasUserData: !!userData,
                        userData: userData ? JSON.parse(userData) : null
                    });

                    if (token) {
                        // Successfully registered and authenticated
                        console.log('Auto-login successful, redirecting to admin dashboard...');
                        navigate('/admin/informes', { replace: true });
                    } else {
                        // Registration succeeded but no auto-login
                        // Show message and redirect to login
                        console.warn('Registration successful but no token received. Redirecting to login.');
                        setGeneralError('Registro exitoso, pero debe iniciar sesión manualmente.');
                        setTimeout(() => {
                            navigate('/auth', {
                                replace: true,
                                state: { message: 'Registro exitoso. Por favor, inicie sesión.' }
                            });
                        }, 2000);
                    }
                }, 100);
            },
            onError: (error) => {
                // Handle specific error cases
                console.error('Registration error:', error);

                // Show user-friendly error message
                const errorMessage = error.message || 'Error al registrar. Verifique su conexión e intente nuevamente.';
                setGeneralError(errorMessage);

                // The error toast is already shown by useRegisterBoss hook
            },
        });
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* General Error Message */}
            {generalError && (
                <div className="p-2 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-800">{generalError}</p>
                </div>
            )}

            {/* Name Field */}
            <div className="space-y-0.5">
                <Label htmlFor="boss-name" className="text-xs font-medium" style={{ color: 'hsl(168, 75%, 15%)' }}>
                    Nombre Completo *
                </Label>
                <Input
                    id="boss-name"
                    type="text"
                    placeholder="Ej: Juan Pérez"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`bg-white border-2 rounded-lg transition-all h-9 text-sm ${errors.Nombre
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-gray-200 focus:border-[hsl(168,60%,40%)]'
                        } focus:ring-0`}
                    style={{ color: 'hsl(168, 75%, 15%)' }}
                />
                {errors.Nombre && (
                    <p className="text-red-500 text-xs">{errors.Nombre}</p>
                )}
            </div>

            {/* Email Field */}
            <div className="space-y-0.5">
                <Label htmlFor="boss-email" className="text-xs font-medium" style={{ color: 'hsl(168, 75%, 15%)' }}>
                    Correo Electrónico *
                </Label>
                <Input
                    id="boss-email"
                    type="email"
                    placeholder="correo@empresa.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`bg-white border-2 rounded-lg transition-all h-9 text-sm ${errors.email
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-gray-200 focus:border-[hsl(168,60%,40%)]'
                        } focus:ring-0`}
                    style={{ color: 'hsl(168, 75%, 15%)' }}
                />
                {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email}</p>
                )}
            </div>

            {/* Password Field */}
            <div className="space-y-0.5">
                <Label htmlFor="boss-password" className="text-xs font-medium" style={{ color: 'hsl(168, 75%, 15%)' }}>
                    Contraseña *
                </Label>
                <Input
                    id="boss-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className={`bg-white border-2 rounded-lg transition-all h-9 text-sm ${errors.password
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-gray-200 focus:border-[hsl(168,60%,40%)]'
                        } focus:ring-0`}
                    style={{ color: 'hsl(168, 75%, 15%)' }}
                />
                {errors.password && (
                    <p className="text-red-500 text-xs">{errors.password}</p>
                )}
            </div>

            {/* Position Field */}
            <div className="space-y-0.5">
                <Label htmlFor="boss-position" className="text-xs font-medium" style={{ color: 'hsl(168, 75%, 15%)' }}>
                    Cargo *
                </Label>
                <Input
                    id="boss-position"
                    type="text"
                    placeholder="Ej: Gerente General"
                    value={formData.position}
                    onChange={(e) => handleChange('position', e.target.value)}
                    className={`bg-white border-2 rounded-lg transition-all h-9 text-sm ${errors.Cargo
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-gray-200 focus:border-[hsl(168,60%,40%)]'
                        } focus:ring-0`}
                    style={{ color: 'hsl(168, 75%, 15%)' }}
                />
                {errors.Cargo && (
                    <p className="text-red-500 text-xs">{errors.Cargo}</p>
                )}
            </div>

            {/* Department Field */}
            <div className="space-y-0.5">
                <Label htmlFor="boss-department" className="text-xs font-medium" style={{ color: 'hsl(168, 75%, 15%)' }}>
                    Departamento *
                </Label>
                <Input
                    id="boss-department"
                    type="text"
                    placeholder="Ej: Operaciones"
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    className={`bg-white border-2 rounded-lg transition-all h-9 text-sm ${errors.Departamento
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-gray-200 focus:border-[hsl(168,60%,40%)]'
                        } focus:ring-0`}
                    style={{ color: 'hsl(168, 75%, 15%)' }}
                />
                {errors.Departamento && (
                    <p className="text-red-500 text-xs">{errors.Departamento}</p>
                )}
            </div>

            {/* Boss Code Field */}
            <div className="space-y-0.5">
                <Label htmlFor="boss-code" className="text-xs font-medium" style={{ color: 'hsl(168, 75%, 15%)' }}>
                    Código de Jefe *
                </Label>
                <Input
                    id="boss-code"
                    type="text"
                    placeholder="Ej: BOSS001"
                    value={formData.bossCode}
                    onChange={(e) => handleChange('bossCode', e.target.value)}
                    className={`bg-white border-2 rounded-lg transition-all h-9 text-sm ${errors["Código de Jefe"]
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-gray-200 focus:border-[hsl(168,60%,40%)]'
                        } focus:ring-0`}
                    style={{ color: 'hsl(168, 75%, 15%)' }}
                />
                {errors['Código de Jefe'] && (
                    <p className="text-red-500 text-xs">{errors['Código de Jefe']}</p>
                )}
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full font-semibold py-2 h-10 rounded-lg transition-all border-0 mt-3 text-sm"
                style={{
                    backgroundColor: registerMutation.isPending ? 'hsl(168, 75%, 27%)' : 'hsl(168, 75%, 21%)',
                    color: 'white'
                }}
                onMouseEnter={(e) => {
                    if (!registerMutation.isPending) {
                        e.currentTarget.style.backgroundColor = 'hsl(168, 75%, 16%)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!registerMutation.isPending) {
                        e.currentTarget.style.backgroundColor = 'hsl(168, 75%, 21%)';
                    }
                }}
            >
                {registerMutation.isPending ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Registrando...
                    </>
                ) : (
                    <>
                        <Briefcase className="w-4 h-4 mr-2" />
                        Registrar Jefe
                    </>
                )}
            </Button>
        </form>
    );
}
