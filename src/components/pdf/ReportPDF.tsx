import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Link,
    Image,
} from '@react-pdf/renderer';
import { ReportDetailsResponse } from '@/types/report';

// Define styles matching the example design
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 11,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottom: '1px solid #E5E7EB',
    },
    logo: {
        width: 60,
        height: 60,
        marginRight: 15,
    },
    headerText: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
        color: '#1F2937',
        marginBottom: 2,
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    titleSection: {
        marginBottom: 20,
        paddingBottom: 15,
        borderBottom: '1px solid #E5E7EB',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    titleLeft: {
        flex: 1,
    },
    sectionLabel: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: '#374151',
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    reportTitle: {
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    responsibleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    responsibleDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
        marginRight: 8,
    },
    responsibleText: {
        fontSize: 11,
        color: '#374151',
    },
    responsibleName: {
        fontFamily: 'Helvetica-Bold',
    },
    statusBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: '#6B7280',
        textTransform: 'uppercase',
    },
    contentSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: '#1F2937',
        textTransform: 'uppercase',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    sectionBody: {
        fontSize: 11,
        color: '#374151',
        lineHeight: 1.6,
    },
    listItem: {
        fontSize: 11,
        color: '#374151',
        lineHeight: 1.6,
        marginBottom: 6,
    },
    link: {
        fontSize: 11,
        color: '#3B82F6',
        textDecoration: 'underline',
    },
    footer: {
        marginTop: 'auto',
        paddingTop: 20,
    },
    datesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    dateBlock: {
        flex: 1,
    },
    dateLabel: {
        fontSize: 10,
        color: '#6B7280',
        marginBottom: 3,
    },
    dateValue: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: '#1F2937',
    },
    footerBar: {
        height: 12,
        backgroundColor: '#065F46',
        marginHorizontal: -40,
        marginBottom: -40,
    },
});

interface ReportPDFProps {
    report: ReportDetailsResponse;
}

// Map status to Spanish labels
const getStatusLabel = (status: string): string => {
    const labelMap: Record<string, string> = {
        'DRAFT': 'BORRADOR',
        'BORRADOR': 'BORRADOR',
        'SENT': 'ENVIADO',
        'ENVIADO': 'ENVIADO',
        'REVIEWED': 'REVISADO',
        'REVISADO': 'REVISADO',
        'APPROVED': 'APROBADO',
        'APROBADO': 'APROBADO',
        'REJECTED': 'RECHAZADO',
        'RECHAZADO': 'RECHAZADO',
    };
    return labelMap[status?.toUpperCase()] || status;
};

// Format date for display
const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return dateString;
    }
};

// Parse activities into numbered list
const parseActivities = (activities?: string): string[] => {
    if (!activities) return [];
    // Split by newlines and filter out empty lines
    return activities
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
};

const ReportPDF: React.FC<ReportPDFProps> = ({ report }) => {
    const activities = parseActivities(report.activities);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerText}>
                        <Text style={styles.headerTitle}>Secretaría de Cultura y Turismo</Text>
                        <Text style={styles.headerSubtitle}>Departamento del Guaviare</Text>
                    </View>
                </View>

                {/* Title Section */}
                <View style={styles.titleSection}>
                    <View style={styles.titleRow}>
                        <View style={styles.titleLeft}>
                            <Text style={styles.sectionLabel}>INFORME DE EMPLEADO:</Text>
                            <Text style={styles.reportTitle}>{report.title}</Text>
                            <View style={styles.responsibleRow}>
                                <View style={styles.responsibleDot} />
                                <Text style={styles.responsibleText}>
                                    Responsable: <Text style={styles.responsibleName}>{report.responsible}</Text>
                                </Text>
                            </View>
                        </View>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>{getStatusLabel(report.status)}</Text>
                        </View>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.contentSection}>
                    <Text style={styles.sectionTitle}>DESCRIPCIÓN</Text>
                    <Text style={styles.sectionBody}>{report.description || 'Sin descripción disponible'}</Text>
                </View>

                {/* Activities */}
                {activities.length > 0 && (
                    <View style={styles.contentSection}>
                        <Text style={styles.sectionTitle}>ACTIVIDADES REALIZADAS</Text>
                        {activities.map((activity, index) => (
                            <Text key={index} style={styles.listItem}>
                                {index + 1}. {activity}
                            </Text>
                        ))}
                    </View>
                )}

                {/* Objective */}
                {report.objective && (
                    <View style={styles.contentSection}>
                        <Text style={styles.sectionTitle}>OBJETIVO</Text>
                        <Text style={styles.sectionBody}>{report.objective}</Text>
                    </View>
                )}

                {/* Evidence Link */}
                {report.evidencieLink && (
                    <View style={styles.contentSection}>
                        <Text style={styles.sectionTitle}>ENLACE DE EVIDENCIA</Text>
                        <Link src={report.evidencieLink} style={styles.link}>
                            {report.evidencieLink}
                        </Link>
                    </View>
                )}

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.datesRow}>
                        <View style={styles.dateBlock}>
                            <Text style={styles.dateLabel}>Fecha de envío:</Text>
                            <Text style={styles.dateValue}>
                                {report.sentAt ? formatDate(report.sentAt) : 'No enviado aún'}
                            </Text>
                        </View>
                        <View style={styles.dateBlock}>
                            <Text style={styles.dateLabel}>Última actualización:</Text>
                            <Text style={styles.dateValue}>{formatDate(report.updatedAt)}</Text>
                        </View>
                    </View>
                    <View style={styles.footerBar} />
                </View>
            </Page>
        </Document>
    );
};

export default ReportPDF;
