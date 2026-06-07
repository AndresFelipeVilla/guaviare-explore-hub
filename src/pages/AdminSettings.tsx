import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Shield, Eye, EyeOff, Loader2, LogOut, CheckCircle2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminService } from '@/services/api/adminService';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useLogout } from '@/hooks/useAuth';
import { ApiError } from '@/services/api/client';
import { toast } from 'sonner';

const PRIMARY = 'hsl(168, 75%, 21%)';
const PRIMARY_HOVER = 'hsl(168, 75%, 16%)';
const MIN_LENGTH = 8;

export default function AdminSettings() {
    const { user } = useRequireAuth({ allowedRoles: ['ADMIN'] });
    const navigate = useNavigate();
    const logout = useLogout();

    const [newKey, setNewKey] = useState('');
    const [confirmKey, setConfirmKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [lastSavedKey, setLastSavedKey] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (newKey.trim().length < MIN_LENGTH) {
            setError(`La clave debe tener al menos ${MIN_LENGTH} caracteres.`);
            return;
        }
        if (newKey !== confirmKey) {
            setError('Las claves no coinciden.');
            return;
        }

        setIsLoading(true);
        try {
            await adminService.changeRegistrationKey(newKey.trim());
            setLastSavedKey(newKey.trim());
            setNewKey('');
            setConfirmKey('');
            toast.success('Clave de registro actualizada correctamente.');
        } catch (err) {
            const message =
                err instanceof ApiError ? err.message : 'No se pudo actualizar la clave. Intenta de nuevo.';
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const copyKey = () => {
        if (lastSavedKey) {
            navigator.clipboard.writeText(lastSavedKey);
            toast.success('Clave copiada al portapapeles.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-11 h-11 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'hsl(168, 75%, 95%)' }}
                        >
                            <Shield className="w-6 h-6" style={{ color: PRIMARY }} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold" style={{ color: PRIMARY }}>
                                Administración
                            </h1>
                            <p className="text-xs text-gray-500">
                                {user?.name ? `Hola, ${user.name}` : 'Panel del administrador'}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Salir
                    </button>
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="mb-5">
                        <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: 'hsl(168,75%,15%)' }}>
                            <KeyRound className="w-4 h-4" />
                            Clave de registro de jefes
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                            Define una nueva clave y entrégala a los jefes que se vayan a registrar.
                            La clave anterior dejará de funcionar de inmediato. Por seguridad no se puede
                            consultar después: si la olvidas, simplemente genera una nueva aquí.
                        </p>
                    </div>

                    {lastSavedKey && (
                        <div className="mb-5 p-3 rounded-lg bg-green-50 border border-green-200">
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-green-800 font-medium">Clave activa (cópiala ahora):</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <code className="text-sm font-mono text-green-900 break-all">{lastSavedKey}</code>
                                        <button
                                            type="button"
                                            onClick={copyKey}
                                            className="text-green-600 hover:text-green-800 flex-shrink-0"
                                            aria-label="Copiar clave"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200">
                                <p className="text-xs text-red-800">{error}</p>
                            </div>
                        )}

                        <div className="space-y-1">
                            <Label htmlFor="new-key" className="text-xs font-medium" style={{ color: 'hsl(168,75%,15%)' }}>
                                Nueva clave *
                            </Label>
                            <div className="relative">
                                <Input
                                    id="new-key"
                                    type={showKey ? 'text' : 'password'}
                                    placeholder="Mínimo 8 caracteres"
                                    value={newKey}
                                    onChange={(e) => {
                                        setNewKey(e.target.value);
                                        if (error) setError('');
                                    }}
                                    autoComplete="new-password"
                                    className="bg-white border-2 border-gray-200 focus:border-[hsl(168,60%,40%)] focus:ring-0 rounded-lg h-10 text-sm pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowKey((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    tabIndex={-1}
                                    aria-label={showKey ? 'Ocultar clave' : 'Mostrar clave'}
                                >
                                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="confirm-key" className="text-xs font-medium" style={{ color: 'hsl(168,75%,15%)' }}>
                                Confirmar clave *
                            </Label>
                            <Input
                                id="confirm-key"
                                type={showKey ? 'text' : 'password'}
                                placeholder="Repite la nueva clave"
                                value={confirmKey}
                                onChange={(e) => {
                                    setConfirmKey(e.target.value);
                                    if (error) setError('');
                                }}
                                autoComplete="new-password"
                                className="bg-white border-2 border-gray-200 focus:border-[hsl(168,60%,40%)] focus:ring-0 rounded-lg h-10 text-sm"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || !newKey || !confirmKey}
                            className="w-full font-semibold h-10 rounded-lg border-0 text-white text-sm"
                            style={{ backgroundColor: isLoading || !newKey || !confirmKey ? 'hsl(168,75%,40%)' : PRIMARY }}
                            onMouseEnter={(e) => {
                                if (!isLoading && newKey && confirmKey) e.currentTarget.style.backgroundColor = PRIMARY_HOVER;
                            }}
                            onMouseLeave={(e) => {
                                if (!isLoading && newKey && confirmKey) e.currentTarget.style.backgroundColor = PRIMARY;
                            }}
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center">
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Guardando...
                                </span>
                            ) : (
                                <span className="inline-flex items-center">
                                    <KeyRound className="w-4 h-4 mr-2" />
                                    Actualizar clave
                                </span>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
