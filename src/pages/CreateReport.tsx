import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Save, Send, Edit3, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Sidebar from '@/components/dashboard/Sidebar';
import { authService } from '@/services/api/authService';
import { reportService } from '@/services/api/reportService';
import { CreateReportRequest } from '@/types/report';
import { formatRole } from '@/utils/format';
import { useRequireAuth } from '@/hooks/useRequireAuth';

interface FormData {
    title: string;
    description: string;
    activities: string;
    objective: string;
    evidencieLink: string;
}

interface FormErrors {
    title?: string;
    description?: string;
    activities?: string;
    objective?: string;
    evidencieLink?: string;
}

export default function CreateReport() {
    const navigate = useNavigate();
    const { reportId: urlReportId } = useParams<{ reportId: string }>();

    // Require authentication for employees
    useRequireAuth({ allowedRoles: ['EMPLOYEE', 'EMPLEADO'] });

    const storedUser = authService.getUser();
    const isEditMode = !!urlReportId;

    // Form state
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        activities: '',
        objective: '',
        evidencieLink: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});

    // Report state
    const [reportId, setReportId] = useState<string | null>(urlReportId || null);
    const [isSaved, setIsSaved] = useState(isEditMode);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Loading states
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch existing report data if in edit mode using getReportDetails
    const { data: existingReport, isLoading: isLoadingReport, error: loadError } = useQuery({
        queryKey: ['reportDetails', urlReportId],
        queryFn: () => reportService.getReportDetails(urlReportId!),
        enabled: isEditMode && !!urlReportId,
    });

    // Populate form with existing report data
    useEffect(() => {
        if (existingReport) {
            console.log('Existing report data for editing:', existingReport);

            // Check if report is DRAFT (editable) - handle both English and Spanish status values
            const statusUpperCase = existingReport.status?.toUpperCase();
            const isDraft = statusUpperCase === 'DRAFT' || statusUpperCase === 'BORRADOR';

            if (!isDraft) {
                toast.error('Solo se pueden editar borradores');
                navigate('/dashboard/mis-informes');
                return;
            }

            setFormData({
                title: existingReport.title || '',
                description: existingReport.description || '',
                activities: existingReport.activities || '',
                objective: existingReport.objective || '',
                evidencieLink: existingReport.evidencieLink || '',
            });
            setReportId(existingReport.reportId);
            setIsSaved(true);
        }
    }, [existingReport, navigate]);

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'El título es requerido';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'La descripción es requerida';
        }
        if (!formData.activities.trim()) {
            newErrors.activities = 'Las actividades son requeridas';
        }
        if (!formData.objective.trim()) {
            newErrors.objective = 'El objetivo es requerido';
        }
        if (!formData.evidencieLink.trim()) {
            newErrors.evidencieLink = 'El enlace de evidencia es requerido';
        } else if (!isValidUrl(formData.evidencieLink)) {
            newErrors.evidencieLink = 'El enlace debe ser una URL válida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // URL validation helper
    const isValidUrl = (string: string): boolean => {
        try {
            new URL(string);
            return true;
        } catch {
            return false;
        }
    };

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    // Handle save (create or update)
    const handleSave = async () => {
        if (!validateForm()) {
            toast.error('Por favor, completa todos los campos correctamente');
            return;
        }

        setIsSaving(true);

        try {
            const requestData: CreateReportRequest = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                activities: formData.activities.trim(),
                objective: formData.objective.trim(),
                evidencieLink: formData.evidencieLink.trim(),
            };

            if (reportId) {
                // Update existing report
                await reportService.updateReport(reportId, requestData);
                toast.success('Informe actualizado exitosamente');
            } else {
                // Create new report
                const response = await reportService.createReport(requestData);
                setReportId(response.reportId);
                toast.success('Informe guardado exitosamente');
            }

            setIsSaved(true);
        } catch (error) {
            console.error('Error saving report:', error);
            toast.error('Error al guardar el informe. Por favor, intenta de nuevo.');
        } finally {
            setIsSaving(false);
        }
    };

    // Handle submit
    const handleSubmit = async () => {
        if (!reportId) {
            toast.error('Primero debes guardar el informe');
            return;
        }

        setIsSubmitting(true);

        try {
            await reportService.submitReport(reportId);
            setIsSubmitted(true);
            toast.success('Informe enviado exitosamente');
            // Navigate back to dashboard after successful submission
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (error) {
            console.error('Error submitting report:', error);
            toast.error('Error al enviar el informe. Por favor, intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get user display info
    const userName = storedUser?.name || 'Usuario';
    const userRole = storedUser?.position || storedUser?.role || 'Empleado';

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                userName={userName}
                userRole={formatRole(userRole)}
            />

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                {reportId ? 'Editar Informe' : 'Crear Nuevo Informe'}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {reportId
                                    ? 'Modifica los datos de tu informe'
                                    : 'Completa el formulario para crear un nuevo informe'}
                            </p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    {isSaved && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isSubmitted
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                            }`}>
                            {isSubmitted ? 'Enviado' : 'Guardado'}
                        </span>
                    )}
                </header>

                {/* Loading state for edit mode */}
                {isLoadingReport && (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                            <p className="text-gray-500">Cargando datos del informe...</p>
                        </div>
                    </div>
                )}

                {/* Error state for loading report */}
                {loadError && !isLoadingReport && (
                    <div className="p-6 rounded-xl bg-red-50 border border-red-200">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-lg font-semibold text-red-800 mb-1">
                                    Error al cargar el informe
                                </h3>
                                <p className="text-red-600 text-sm">
                                    No se pudo cargar los datos del informe. Por favor verifica la conexión e intenta de nuevo.
                                </p>
                                <button
                                    onClick={() => navigate('/dashboard/mis-informes')}
                                    className="mt-4 px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors"
                                >
                                    Volver a Mis Informes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form - Only show when not loading and no error */}
                {!isLoadingReport && !loadError && (
                    <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Título del Informe *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    disabled={isSubmitted}
                                    placeholder="Ej: Informe de Avance Mensual - Fase 3"
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.title ? 'border-red-300' : 'border-gray-200'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500`}
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    disabled={isSubmitted}
                                    rows={4}
                                    placeholder="Describe el contenido y propósito del informe..."
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.description ? 'border-red-300' : 'border-gray-200'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none disabled:bg-gray-50 disabled:text-gray-500`}
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                                )}
                            </div>

                            {/* Activities */}
                            <div>
                                <label htmlFor="activities" className="block text-sm font-medium text-gray-700 mb-2">
                                    Actividades Realizadas *
                                </label>
                                <textarea
                                    id="activities"
                                    name="activities"
                                    value={formData.activities}
                                    onChange={handleChange}
                                    disabled={isSubmitted}
                                    rows={5}
                                    placeholder="1. Primera actividad...&#10;2. Segunda actividad...&#10;3. Tercera actividad..."
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.activities ? 'border-red-300' : 'border-gray-200'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none disabled:bg-gray-50 disabled:text-gray-500`}
                                />
                                {errors.activities && (
                                    <p className="mt-1 text-sm text-red-500">{errors.activities}</p>
                                )}
                            </div>

                            {/* Objective */}
                            <div>
                                <label htmlFor="objective" className="block text-sm font-medium text-gray-700 mb-2">
                                    Objetivo *
                                </label>
                                <input
                                    type="text"
                                    id="objective"
                                    name="objective"
                                    value={formData.objective}
                                    onChange={handleChange}
                                    disabled={isSubmitted}
                                    placeholder="Ej: Cumplir con el hito técnico del 25% en el desarrollo..."
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.objective ? 'border-red-300' : 'border-gray-200'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500`}
                                />
                                {errors.objective && (
                                    <p className="mt-1 text-sm text-red-500">{errors.objective}</p>
                                )}
                            </div>

                            {/* Evidence Link */}
                            <div>
                                <label htmlFor="evidencieLink" className="block text-sm font-medium text-gray-700 mb-2">
                                    Enlace de Evidencia *
                                </label>
                                <input
                                    type="url"
                                    id="evidencieLink"
                                    name="evidencieLink"
                                    value={formData.evidencieLink}
                                    onChange={handleChange}
                                    disabled={isSubmitted}
                                    placeholder="https://mi-dominio.com/evidencias/reporte.pdf"
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.evidencieLink ? 'border-red-300' : 'border-gray-200'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500`}
                                />
                                {errors.evidencieLink && (
                                    <p className="mt-1 text-sm text-red-500">{errors.evidencieLink}</p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                                {/* Save Button - Always visible */}
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isSaving || isSubmitted}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Save className="w-5 h-5" />
                                    )}
                                    {isSaving ? 'Guardando...' : 'Guardar'}
                                </button>

                                {/* Submit Button - Enabled after save */}
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={!isSaved || isSubmitting || isSubmitted}
                                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                    {isSubmitting ? 'Enviando...' : 'Enviar'}
                                </button>

                                {/* Continue Editing indicator - Shows after save */}
                                {isSaved && !isSubmitted && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                                        <Edit3 className="w-4 h-4" />
                                        <span className="text-sm">Puedes continuar editando</span>
                                    </div>
                                )}
                            </div>

                            {/* Help Text */}
                            {!isSaved && (
                                <p className="text-sm text-gray-500 mt-4">
                                    * Todos los campos son obligatorios. Después de guardar podrás enviar el informe para revisión.
                                </p>
                            )}
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}
