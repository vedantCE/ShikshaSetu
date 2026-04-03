import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../auth/context/AuthContext';
import { fetchStudentAnalytics, type AnalyticsResponse } from '../../auth/services/studentApi';
import { fetchStudentTracingProgress, type StudentTracingProgressResponse } from '../../tracing/services/tracingApi';
import { palette, metrics, typography } from '../../../theme/design';
import LoaderScreen from '../../../components/LoaderScreen';
import { useDeferredLoader } from '../../../utils/useDeferredLoader';

const AnalyticsScreen = ({ route }: any) => {
    const { user, students } = useAuth();
    const studentId = route?.params?.studentId as string | undefined;
    const student = students.find(s => s.id === studentId);

    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
    const [tracingProgress, setTracingProgress] = useState<StudentTracingProgressResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const showLoader = useDeferredLoader(loading || (!analytics && !error));

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        if (!user?.token || !studentId) {
            setError('Missing authentication or student ID');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const [analyticsResult, tracingResult] = await Promise.allSettled([
                fetchStudentAnalytics(user.token, studentId),
                fetchStudentTracingProgress(user.token, studentId),
            ]);

            if (analyticsResult.status === 'fulfilled') {
                setAnalytics(analyticsResult.value);
            } else {
                setAnalytics(null);
            }

            if (tracingResult.status === 'fulfilled') {
                setTracingProgress(tracingResult.value);
            } else {
                setTracingProgress(null);
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    const alphabetPercent = Math.round(((tracingProgress?.alphabet_progress ?? 0) / 3) * 100);
    const numberPercent = Math.round(((tracingProgress?.number_progress ?? 0) / 3) * 100);

    const getActivityIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'letters': return 'alphabetical';
            case 'numbers': return 'numeric';
            case 'shapes': return 'shape-outline';
            case 'puzzle': return 'puzzle-outline';
            default: return 'book-open-variant';
        }
    };

    const getActivityColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'letters': return '#3B82F6';
            case 'numbers': return '#10B981';
            case 'shapes': return '#F59E0B';
            case 'puzzle': return '#8B5CF6';
            default: return palette.primary;
        }
    };

    if (loading) {
        if (showLoader) {
            return <LoaderScreen text="Preparing your fun learning experience..." />;
        }

        return null;
    }

    if (error) {
        return (
            <SafeAreaView style={styles.root}>
                <View style={styles.loadingContainer}>
                    <Icon name="alert-circle-outline" size={48} color={palette.danger} />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.root}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <Text style={styles.title}>
                    {student?.name ? `${student.name}'s Progress` : 'Student Progress'}
                </Text>

                {/* Summary Cards Row */}
                <View style={styles.summaryRow}>
                    <View style={[styles.summaryCard, { backgroundColor: '#EEF2FF' }]}>
                        <Icon name="trophy-outline" size={28} color="#3B82F6" />
                        <Text style={styles.summaryValue}>{analytics?.totalActivities ?? 0}</Text>
                        <Text style={styles.summaryLabel}>Activities</Text>
                    </View>
                    <View style={[styles.summaryCard, { backgroundColor: '#FEF3C7' }]}>
                        <Icon name="star" size={28} color="#F59E0B" />
                        <Text style={styles.summaryValue}>{analytics?.totalStars ?? 0}</Text>
                        <Text style={styles.summaryLabel}>Stars Earned</Text>
                    </View>
                </View>

                {/* Last Activity */}
                {analytics?.lastActivityDate && (
                    <View style={styles.card}>
                        <View style={styles.cardRow}>
                            <Icon name="clock-outline" size={20} color={palette.muted} />
                            <Text style={styles.lastActivityText}>
                                Last activity: {new Date(analytics.lastActivityDate).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Tracing Progress */}
                <Text style={styles.sectionTitle}>Tracing Progress</Text>
                <View style={styles.card}>
                    <View style={styles.breakdownRow}>
                        <View style={[styles.iconWrap, { backgroundColor: '#DBEAFE' }]}>
                            <Icon name="alphabetical-variant" size={24} color="#2563EB" />
                        </View>
                        <View style={styles.breakdownInfo}>
                            <Text style={styles.breakdownTitle}>Alphabet Tracing</Text>
                            <Text style={styles.breakdownSub}>{alphabetPercent}% completed</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.breakdownRow}>
                        <View style={[styles.iconWrap, { backgroundColor: '#D1FAE5' }]}>
                            <Icon name="numeric" size={24} color="#10B981" />
                        </View>
                        <View style={styles.breakdownInfo}>
                            <Text style={styles.breakdownTitle}>Number Tracing</Text>
                            <Text style={styles.breakdownSub}>{numberPercent}% completed</Text>
                        </View>
                    </View>
                </View>

                {/* Activity Breakdown */}
                <Text style={styles.sectionTitle}>Activity Breakdown</Text>

                {analytics?.breakdown && analytics.breakdown.length > 0 ? (
                    analytics.breakdown.map((item) => (
                        <View key={item.activity_type} style={styles.card}>
                            <View style={styles.breakdownRow}>
                                <View style={[styles.iconWrap, { backgroundColor: getActivityColor(item.activity_type) + '20' }]}>
                                    <Icon name={getActivityIcon(item.activity_type)} size={24} color={getActivityColor(item.activity_type)} />
                                </View>
                                <View style={styles.breakdownInfo}>
                                    <Text style={styles.breakdownTitle}>
                                        {item.activity_type.charAt(0).toUpperCase() + item.activity_type.slice(1)}
                                    </Text>
                                    <Text style={styles.breakdownSub}>
                                        {item.attempts} attempts • {item.total_score} pts
                                    </Text>
                                </View>
                                <View style={styles.starsContainer}>
                                    <Icon name="star" size={18} color="#F59E0B" />
                                    <Text style={styles.starsText}>{item.total_stars}</Text>
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyCard}>
                        <Icon name="chart-bar" size={48} color={palette.muted} style={{ opacity: 0.4 }} />
                        <Text style={styles.emptyText}>No activity data yet</Text>
                        <Text style={styles.emptySubtext}>Start tracing to see progress here!</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: palette.background },
    content: { padding: metrics.spacing, paddingBottom: 40 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { color: palette.muted, fontSize: 16 },
    errorText: { color: palette.danger, fontSize: 16, marginTop: 8, textAlign: 'center' },
    title: { ...typography.title, fontSize: 24, marginBottom: metrics.spacing },

    summaryRow: {
        flexDirection: 'row',
        gap: metrics.spacing,
        marginBottom: metrics.spacing,
    },
    summaryCard: {
        flex: 1,
        borderRadius: metrics.radius,
        padding: metrics.spacing,
        alignItems: 'center',
        ...metrics.shadow,
    },
    summaryValue: { fontSize: 32, fontWeight: '800', color: palette.text, marginTop: 8 },
    summaryLabel: { fontSize: 14, color: palette.muted, fontWeight: '600', marginTop: 4 },

    card: {
        backgroundColor: palette.card,
        borderRadius: metrics.radius,
        padding: metrics.spacing,
        marginBottom: metrics.spacing,
        ...metrics.shadow,
    },
    cardRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    lastActivityText: { color: palette.muted, fontSize: 14 },

    sectionTitle: { ...typography.title, fontSize: 18, marginTop: 8, marginBottom: metrics.spacing },

    breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    breakdownInfo: { flex: 1 },
    breakdownTitle: { fontSize: 16, fontWeight: '700', color: palette.text },
    breakdownSub: { fontSize: 13, color: palette.muted, marginTop: 2 },
    starsContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    starsText: { fontSize: 16, fontWeight: '700', color: '#F59E0B' },

    emptyCard: {
        backgroundColor: palette.card,
        borderRadius: metrics.radius,
        padding: metrics.spacing * 2,
        alignItems: 'center',
        ...metrics.shadow,
    },
    emptyText: { fontSize: 16, fontWeight: '700', color: palette.text, marginTop: 12 },
    emptySubtext: { fontSize: 14, color: palette.muted, marginTop: 4 },
});

export default AnalyticsScreen;
