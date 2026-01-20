import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error details
        console.error('ErrorBoundary caught an error:', error);
        console.error('Component stack:', errorInfo.componentStack);

        this.setState({
            error,
            errorInfo,
        });
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
                    <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <h1 className="text-xl font-bold text-gray-900 mb-2">
                                    Algo salió mal
                                </h1>
                                <p className="text-sm text-gray-600 mb-4">
                                    La aplicación encontró un error inesperado. Por favor, recarga la página o contacta soporte si el problema persiste.
                                </p>

                                {this.state.error && (
                                    <details className="mb-4">
                                        <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 mb-2">
                                            Detalles técnicos del error
                                        </summary>
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <p className="text-sm font-mono text-red-600 mb-2">
                                                {this.state.error.toString()}
                                            </p>
                                            {this.state.errorInfo && (
                                                <pre className="text-xs text-gray-600 overflow-auto">
                                                    {this.state.errorInfo.componentStack}
                                                </pre>
                                            )}
                                        </div>
                                    </details>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        Recargar página
                                    </button>
                                    <button
                                        onClick={() => window.location.href = '/'}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                                    >
                                        Ir al inicio
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
