import { useState, FormEvent } from 'react';
import { Shield, Eye, EyeOff, Loader2, AlertCircle, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/api/authService';

interface BossKeyVerificationStepProps {
    onKeyVerified: (key: string) => void;
}

export default function BossKeyVerificationStep({ onKeyVerified }: BossKeyVerificationStepProps) {
    const [key, setKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!key.trim()) {
            setError('Ingresa la clave de administración.');
            return;
        }

        setIsLoading(true);
        try {
            const result = await authService.validateBossKey(key.trim());
            if (result.valid) {
                onKeyVerified(key.trim());
            } else {
                setError('Clave incorrecta. Verifica e intenta de nuevo.');
                setKey('');
            }
        } catch {
            setError('No se pudo verificar la clave. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            {/* Header visual */}
            <div className="flex flex-col items-center text-center gap-2 py-2">
                <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'hsl(168, 75%, 95%)' }}
                >
                    <Shield
                        className="w-7 h-7"
                        style={{ color: 'hsl(168, 75%, 21%)' }}
                    />
                </div>
                <div>
                    <h3 className="font-semibold text-sm" style={{ color: 'hsl(168, 75%, 15%)' }}>
                        Acceso de Administración
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: 'hsl(168, 20%, 45%)' }}>
                        Para registrarte como jefe necesitas la clave de administración.
                        Contacta al responsable del sistema si no la tienes.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Error */}
                {error && (
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-red-800">{error}</p>
                    </div>
                )}

                {/* Key input */}
                <div className="space-y-1">
                    <Label
                        htmlFor="admin-key"
                        className="text-xs font-medium flex items-center gap-1"
                        style={{ color: 'hsl(168, 75%, 15%)' }}
                    >
                        <KeyRound className="w-3.5 h-3.5" />
                        Clave de Administración *
                    </Label>
                    <div className="relative">
                        <Input
                            id="admin-key"
                            type={showKey ? 'text' : 'password'}
                            placeholder="Ingresa la clave de administración"
                            value={key}
                            onChange={(e) => {
                                setKey(e.target.value);
                                if (error) setError('');
                            }}
                            autoComplete="off"
                            className={`bg-white border-2 rounded-lg transition-all h-10 text-sm pr-10 ${
                                error
                                    ? 'border-red-400 focus:border-red-500'
                                    : 'border-gray-200 focus:border-[hsl(168,60%,40%)]'
                            } focus:ring-0`}
                            style={{ color: 'hsl(168, 75%, 15%)' }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowKey((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            tabIndex={-1}
                            aria-label={showKey ? 'Ocultar clave' : 'Mostrar clave'}
                        >
                            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Verify button */}
                <Button
                    type="submit"
                    disabled={isLoading || !key.trim()}
                    className="w-full font-semibold py-2 h-10 rounded-lg transition-all border-0 text-sm"
                    style={{
                        backgroundColor:
                            isLoading || !key.trim()
                                ? 'hsl(168, 75%, 40%)'
                                : 'hsl(168, 75%, 21%)',
                        color: 'white',
                    }}
                    onMouseEnter={(e) => {
                        if (!isLoading && key.trim()) {
                            e.currentTarget.style.backgroundColor = 'hsl(168, 75%, 16%)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isLoading && key.trim()) {
                            e.currentTarget.style.backgroundColor = 'hsl(168, 75%, 21%)';
                        }
                    }}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Verificando...
                        </>
                    ) : (
                        <>
                            <Shield className="w-4 h-4 mr-2" />
                            Verificar Clave
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}
