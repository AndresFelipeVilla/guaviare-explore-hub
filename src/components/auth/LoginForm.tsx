import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '@/hooks/useAuth';
import { validateLoginForm } from '@/services/validators';
import { authService } from '@/services/api/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Loader2, Home, Eye, EyeOff, AlertCircle } from 'lucide-react';

// Constantes fuera del componente para mejor rendimiento y mantenimiento
const ADMIN_ROLES = ['BOSS', 'ADMIN', 'JEFE'];
const PRIMARY_COLOR = 'hsl(168, 75%, 21%)';
const PRIMARY_HOVER = 'hsl(168, 75%, 16%)';

export default function LoginForm() {
    const navigate = useNavigate();
    const loginMutation = useLogin();

    // Estados
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Nuevo: Toggle password
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrors({});

        // 1. Validar formulario localmente
        const validation = validateLoginForm(email, password);
        if (!validation.isValid) {
            const errorMap: Record<string, string> = {};
            validation.errors.forEach((err) => {
                errorMap[err.field] = err.message;
            });
            setErrors(errorMap);
            return;
        }

        // 2. Ejecutar Login
        loginMutation.mutate({ email, password }, {
            onSuccess: (response) => {
                const userRole = response.user?.role || authService.getUser()?.role;

                // Lógica de redirección simplificada
                const normalizedRole = userRole?.toUpperCase() || '';
                const isAdminOrBoss = ADMIN_ROLES.includes(normalizedRole);

                console.log('Login exitoso. Rol:', normalizedRole, 'Es admin:', isAdminOrBoss);

                if (isAdminOrBoss) {
                    navigate('/admin/informes');
                } else {
                    navigate('/dashboard');
                }
            },
            // Nuevo: Manejo de error de API (ej. credenciales inválidas)
            onError: (error: any) => {
                setErrors({
                    root: error.message || 'Error al iniciar sesión. Verifique sus credenciales.'
                });
            }
        });
    };

    return (
        <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2 text-[hsl(168,75%,21%)]">
                    Inicio de Sesión
                </h2>
                <p className="text-sm text-[hsl(168,20%,45%)]">
                    Accede con tus credenciales institucionales
                </p>
            </div>

            {/* Error General de API */}
            {errors.root && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.root}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm font-medium text-[hsl(168,75%,15%)]">
                        Correo Electrónico
                    </Label>
                    <Input
                        id="login-email"
                        type="email"
                        disabled={loginMutation.isPending}
                        placeholder="correo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`bg-white border-2 transition-all h-12 text-[hsl(168,75%,15%)] 
                            ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[hsl(168,60%,40%)]'} 
                            focus:ring-0`}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="login-password" className="text-sm font-medium text-[hsl(168,75%,15%)]">
                            Contraseña
                        </Label>
                        <Link
                            to="/reset-password"
                            className="text-sm font-medium transition-colors hover:underline text-[hsl(168,60%,35%)]"
                        >
                            ¿Olvidó su contraseña?
                        </Link>
                    </div>

                    <div className="relative">
                        <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            disabled={loginMutation.isPending}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`bg-white border-2 transition-all h-12 pr-10 text-[hsl(168,75%,15%)]
                                ${errors.password ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[hsl(168,60%,40%)]'} 
                                focus:ring-0`}
                        />
                        {/* Botón de Ojo */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full font-semibold py-6 rounded-xl transition-all border-0 mt-2 text-white"
                    // Usamos clases arbitrarias de Tailwind en lugar de style inline para hover
                    style={{ backgroundColor: PRIMARY_COLOR }}
                    onMouseEnter={(e) => !loginMutation.isPending && (e.currentTarget.style.backgroundColor = PRIMARY_HOVER)}
                    onMouseLeave={(e) => !loginMutation.isPending && (e.currentTarget.style.backgroundColor = PRIMARY_COLOR)}
                >
                    {/* Contenedor de blindaje: aísla el contenido dinámico de inyecciones del navegador */}
                    <span className="inline-flex items-center justify-center pointer-events-none">
                        {loginMutation.isPending ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Iniciando sesión...
                            </>
                        ) : (
                            <>
                                <LogIn className="w-5 h-5 mr-2" />
                                Iniciar Sesión
                            </>
                        )}
                    </span>
                </Button>
            </form>

            {/* Create Account & Home Links */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-4">
                <p className="text-sm text-[hsl(168,20%,45%)]">
                    ¿No tiene una cuenta?{' '}
                    <Link
                        to="/register"
                        className="font-semibold transition-colors hover:underline text-[hsl(168,75%,21%)]"
                    >
                        Crear cuenta
                    </Link>
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:underline text-[hsl(168,60%,35%)]"
                >
                    <Home className="w-4 h-4" />
                    Ir al inicio
                </Link>
            </div>
        </div>
    );
}