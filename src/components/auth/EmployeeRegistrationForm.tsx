import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterEmployee } from '@/hooks/useAuth';
import { validateEmployeeRegistrationForm } from '@/services/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Loader2, AlertCircle } from 'lucide-react';

export default function EmployeeRegistrationForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        position: '',
        department: '',
        managerBossCode: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string>('');

    const registerMutation = useRegisterEmployee();

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
        if (generalError) {
            setGeneralError('');
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrors({});
        setGeneralError('');

        // Validate form
        const validation = validateEmployeeRegistrationForm(formData);
        if (!validation.isValid) {
            const errorMap: Record<string, string> = {};
            validation.errors.forEach((error) => {
                errorMap[error.field] = error.message;
            });
            setErrors(errorMap);
            return;
        }

        // Submit registration
        registerMutation.mutate(formData, {
            onSuccess: () => {
                // Redirect to dashboard after successful registration
                navigate('/dashboard');
            },
            onError: (error) => {
                const errorMessage = error.message || 'Error al registrar. Verifique su conexión e intente nuevamente.';
                setGeneralError(errorMessage);
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
                <Label htmlFor="emp-name" className="text-xs font-medium" style={{ color: 'hsl(168, 75%, 15%)' }}>
                    Nombre Completo *
                </Label>
                <Input
                    id="emp-name"
                    type="text"
                    placeholder="Ej: María González"
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
                <Label htmlFor="emp-email" className="text-xs font-medium" style={{ color: 'hsl(168, 75%, 15%)' }}>
                    Correo Electrónico *
                </Label>
                <Input
                    id="emp-email"
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
                <Label htmlFor="emp-password" className="text-xs font-medium" style={{ color: 'hsl(168, 75%, 15%)' }}>
                    Contraseña *
                </Label>
                <Input
                    id="emp-password"
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
                <Label htmlFor="emp-position" className="text-xs font-medium" style={{ color: 'hsl(168, 75%, 15%)' }}>
                    Cargo *
                </Label>
                <Input
                    id="emp-position"
                    type="text"
                    placeholder="Ej: Desarrollador"
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
                <Label htmlFor="emp-department" className="text-xs font-medium" style={{ color: 'hsl(168, 75%, 15%)' }}>
                    Departamento *
                </Label>
                <Input
                    id="emp-department"
                    type="text"
                    placeholder="Ej: Tecnología"
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

            {/* Manager Boss Code Field */}
            <div className="space-y-0.5">
                <Label htmlFor="emp-manager-code" className="text-xs font-medium" style={{ color: 'hsl(168, 75%, 15%)' }}>
                    Código del Jefe *
                </Label>
                <Input
                    id="emp-manager-code"
                    type="text"
                    placeholder="Ej: BOSS001"
                    value={formData.managerBossCode}
                    onChange={(e) => handleChange('managerBossCode', e.target.value)}
                    className={`bg-white border-2 rounded-lg transition-all h-9 text-sm ${errors["Código del Jefe"]
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-gray-200 focus:border-[hsl(168,60%,40%)]'
                        } focus:ring-0`}
                    style={{ color: 'hsl(168, 75%, 15%)' }}
                />
                {errors['Código del Jefe'] && (
                    <p className="text-red-500 text-xs">{errors['Código del Jefe']}</p>
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
                        <Users className="w-4 h-4 mr-2" />
                        Registrar Empleado
                    </>
                )}
            </Button>
        </form>
    );
}
