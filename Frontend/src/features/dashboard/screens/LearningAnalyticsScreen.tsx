import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../auth/context/AuthContext';
import { fetchStudentTracingProgress, type StudentTracingProgressResponse } from '../../tracing/services/tracingApi';

const { width } = Dimensions.get('window');

const LearningAnalyticsScreen = ({ navigation }: any) => {
    const { user, students, currentStudent } = useAuth();
    const [progress, setProgress] = useState<StudentTracingProgressResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const targetStudent = useMemo(() => {
        if (currentStudent) {
            return currentStudent;
        }

        return students?.[0] ?? null;
    }, [currentStudent, students]);

    useEffect(() => {
        const loadProgress = async () => {
            if (!user?.token || !targetStudent?.id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await fetchStudentTracingProgress(user.token, targetStudent.id);
                setProgress(data);
            } catch (error) {
                console.log('Failed to load tracing insights', error);
                setProgress(null);
            } finally {
                setLoading(false);
            }
        };

        loadProgress();
    }, [user?.token, targetStudent?.id]);

    const alphabetPercent = Math.round(((progress?.alphabet_progress ?? 0) / 3) * 100);
    const numberPercent = Math.round(((progress?.number_progress ?? 0) / 3) * 100);
    const overallPercent = Math.round((alphabetPercent + numberPercent) / 2);
    const masteredTracks = [alphabetPercent, numberPercent].filter((value) => value >= 70).length;
    const miniStats = [
        {
            key: 'alphabet',
            label: 'Alphabet',
            value: `${alphabetPercent}%`,
            icon: 'alphabetical-variant',
            iconStyle: styles.iconBgBlue,
            iconColor: '#1B337F',
            trendStyle: styles.miniTrendBadgeBlue,
        },
        {
            key: 'number',
            label: 'Numbers',
            value: `${numberPercent}%`,
            icon: 'numeric',
            iconStyle: styles.iconBgGreen,
            iconColor: '#059669',
            trendStyle: styles.miniTrendBadgeGreen,
        },
        {
            key: 'mastered',
            label: 'Mastered',
            value: `${masteredTracks}/2`,
            icon: 'check-circle',
            iconStyle: styles.iconBgIndigo,
            iconColor: '#4338CA',
            trendStyle: styles.miniTrendBadgePurple,
        },
    ];

    const masteryCards = [
        {
            key: 'alphabet',
            title: 'Alphabet Tracing',
            percent: alphabetPercent,
            fillColor: '#2563EB',
            iconContainerStyle: styles.masteryIconBgLightBlue,
            icon: <Icon name="alphabetical-variant" size={20} color="#2563EB" />,
        },
        {
            key: 'number',
            title: 'Number Tracing',
            percent: numberPercent,
            fillColor: '#059669',
            iconContainerStyle: styles.masteryIconBgLightGreen,
            icon: <Icon name="numeric" size={20} color="#059669" />,
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color="#1A1A2E" />
                </Pressable>
                <Text style={styles.headerTitle}>Learning Insights</Text>
                <Pressable style={styles.calendarBtn}>
                    <Icon name="calendar-blank-outline" size={24} color="#1A1A2E" />
                </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.studentBanner}>
                    <Text style={styles.studentBannerLabel}>Showing data for</Text>
                    <Text style={styles.studentBannerName}>{targetStudent?.name || 'No child selected'}</Text>
                </View>

                {loading ? (
                    <View style={styles.loadingCard}>
                        <ActivityIndicator size="small" color="#1B337F" />
                        <Text style={styles.loadingText}>Loading tracing insights...</Text>
                    </View>
                ) : null}

                {/* Top Mini Stats */}
                <View style={styles.topStatsRow}>
                    {miniStats.map((stat) => (
                        <View key={stat.key} style={styles.miniStatCard}>
                            <View style={stat.iconStyle}>
                                <Icon name={stat.icon} size={16} color={stat.iconColor} />
                            </View>
                            <Text style={styles.miniStatLabel}>{stat.label}</Text>
                            <Text style={styles.miniStatValue}>{stat.value}</Text>
                            <View style={stat.trendStyle}>
                                <Text style={styles.miniTrendText}>Live</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Weekly Performance - Mock Graph */}
                <View style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <View>
                            <Text style={styles.chartTitle}>Tracing Overview</Text>
                            <Text style={styles.chartSubtitle}>Alphabet and number progress</Text>
                        </View>
                        <View style={styles.chartTitleRight}>
                            <Text style={styles.chartValue}>{overallPercent}%</Text>
                            <Text style={styles.chartTrendText}>
                                {progress?.last_tracing_update
                                    ? `Updated ${new Date(progress.last_tracing_update).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                    })}`
                                    : 'Waiting for tracing data'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.chartArea}>
                        <View style={styles.chartGridLine} />
                        <View style={styles.chartGridLine} />
                        <View style={styles.chartGridLine} />
                        <View style={styles.chartGridLine} />

                        <View style={styles.mockChartPathContainer}>
                            {[alphabetPercent, numberPercent, overallPercent].map((value, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.bar,
                                        {
                                            height: `${Math.max(value, 6)}%`,
                                            backgroundColor: index === 0 ? '#2563EB' : index === 1 ? '#059669' : '#7C3AED',
                                            width: 24,
                                        },
                                    ]}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={styles.daysRow}>
                        <Text style={styles.dayText}>Alphabet</Text>
                        <Text style={styles.dayText}>Numbers</Text>
                        <Text style={styles.dayText}>Overall</Text>
                    </View>
                </View>

                {/* Subject Mastery */}
                <Text style={styles.sectionHeading}>Tracing Mastery</Text>

                {masteryCards.map((card) => (
                    <View key={card.key} style={styles.masteryCard}>
                        <View style={card.iconContainerStyle}>
                            {card.icon}
                        </View>
                        <View style={styles.masteryInfo}>
                            <View style={styles.masteryTitleRow}>
                                <Text style={styles.masteryTitle}>{card.title}</Text>
                                <Text style={styles.masteryPercent}>{card.percent}%</Text>
                            </View>
                            <View style={styles.masteryBarBg}>
                                <View
                                    style={[
                                        styles.masteryBarFill,
                                        {
                                            width: `${card.percent}%`,
                                            backgroundColor: card.fillColor,
                                        },
                                    ]}
                                />
                            </View>
                        </View>
                    </View>
                ))}

                {/* Focus Pattern */}
                <View style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <View>
                            <Text style={styles.chartTitle}>Focus Pattern</Text>
                            <Text style={styles.chartSubtitle}>Concentration levels by hour</Text>
                        </View>
                    </View>

                    <View style={styles.focusChartArea}>
                        <View style={styles.focusBarCol}>
                            <View style={[styles.focusBarFill, { height: '50%' }]} />
                            <Text style={styles.focusTimeText}>9AM</Text>
                        </View>
                        <View style={styles.focusBarCol}>
                            <View style={[styles.focusBarFill, { height: '100%' }]} />
                            <Text style={styles.focusTimeText}>10AM</Text>
                        </View>
                        <View style={styles.focusBarCol}>
                            <View style={[styles.focusBarFill, { height: '70%', backgroundColor: '#818CF8' }]} />
                            <Text style={styles.focusTimeText}>11AM</Text>
                        </View>
                        <View style={styles.focusBarCol}>
                            <View style={[styles.focusBarFill, { height: '40%', backgroundColor: '#A5B4FC' }]} />
                            <Text style={styles.focusTimeText}>12PM</Text>
                        </View>
                        <View style={styles.focusBarCol}>
                            <View style={[styles.focusBarFill, { height: '60%', backgroundColor: '#818CF8' }]} />
                            <Text style={styles.focusTimeText}>1PM</Text>
                        </View>
                        <View style={styles.focusBarCol}>
                            <View style={[styles.focusBarFill, { height: '90%' }]} />
                            <Text style={styles.focusTimeText}>2PM</Text>
                        </View>
                    </View>
                </View>

                {/* Full Report Button */}
                <Pressable style={styles.downloadBtn}>
                    <Icon name="download" size={20} color="#FFFFFF" />
                    <Text style={styles.downloadBtnText}>Download Full Report</Text>
                </Pressable>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backBtn: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    calendarBtn: {
        padding: 8,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    studentBanner: {
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 16,
    },
    studentBannerLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
    },
    studentBannerName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    loadingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
    },
    loadingText: {
        color: '#1A1A2E',
        fontSize: 14,
        fontWeight: '500',
    },
    topStatsRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 20,
        marginTop: 8,
    },
    miniStatCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconBgBlue: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E8F4FD', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    iconBgGreen: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    iconBgPurple: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    iconBgIndigo: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E0E7FF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    miniStatLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    miniStatValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A2E',
        marginBottom: 8,
    },
    miniTrendBadge: {
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    miniTrendBadgeBlue: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    miniTrendBadgeGreen: {
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    miniTrendBadgePurple: {
        backgroundColor: '#EDE9FE',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    miniTrendText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#059669',
    },
    chartCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    chartSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    chartTitleRight: {
        alignItems: 'flex-end',
    },
    chartValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1B337F',
    },
    chartTrendText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#059669',
    },
    chartArea: {
        height: 120,
        position: 'relative',
        marginBottom: 16,
    },
    chartGridLine: {
        height: 1,
        backgroundColor: '#F3F4F6',
        borderStyle: 'dashed',
        marginBottom: 29,
    },
    mockChartPathContainer: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    bar: {
        width: 6,
        backgroundColor: '#D1D5DB',
        borderRadius: 3,
    },
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    sectionHeading: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A2E',
        marginHorizontal: 16,
        marginBottom: 16,
    },
    masteryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    masteryIconBgLightBlue: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#DBEAFE',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    masteryIconBgLightGreen: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    masteryIconBgLightPurple: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F3E8FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    iconLetterBlue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2563EB',
    },
    masteryInfo: {
        flex: 1,
    },
    masteryTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    masteryTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A2E',
    },
    masteryPercent: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    masteryBarBg: {
        height: 6,
        backgroundColor: '#F3F4F6',
        borderRadius: 3,
    },
    masteryBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    focusChartArea: {
        height: 150,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingTop: 16,
    },
    focusBarCol: {
        alignItems: 'center',
        flex: 1,
        height: '100%',
        justifyContent: 'flex-end',
    },
    focusBarFill: {
        width: 32,
        backgroundColor: '#4F46E5',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
    },
    focusTimeText: {
        fontSize: 10,
        color: '#9CA3AF',
        marginTop: 8,
    },
    downloadBtn: {
        flexDirection: 'row',
        backgroundColor: '#1E3A8A',
        marginHorizontal: 16,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: '#1E3A8A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    downloadBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginLeft: 8,
    },
});

export default LearningAnalyticsScreen;
