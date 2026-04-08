import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../auth/context/AuthContext';
import { fetchStudentTracingProgress, type StudentTracingProgressResponse } from '../../tracing/services/tracingApi';

const { width } = Dimensions.get('window');

const ChildProgressScreen = ({ route, navigation }: any) => {
    const { user, students } = useAuth();
    const childId = route.params?.childId;
    const [progress, setProgress] = useState<StudentTracingProgressResponse | null>(null);
    const [loadingProgress, setLoadingProgress] = useState(true);

    const child = useMemo(() => {
        return students?.find((s: any) => s.id === childId) || students?.[0] || { name: 'Child', age: 8 };
    }, [students, childId]);

    const activeChildId = String(childId || child?.id || '');

    useEffect(() => {
        const loadProgress = async () => {
            if (!user?.token || !activeChildId) {
                setLoadingProgress(false);
                setProgress(null);
                return;
            }

            try {
                setLoadingProgress(true);
                const data = await fetchStudentTracingProgress(user.token, activeChildId);
                setProgress(data);
            } catch (error) {
                console.log('Failed to load child tracing progress', error);
                setProgress(null);
            } finally {
                setLoadingProgress(false);
            }
        };

        loadProgress();
    }, [user?.token, activeChildId]);

    const alphabetPercent = Math.round(((progress?.alphabet_progress ?? 0) / 3) * 100);
    const numberPercent = Math.round(((progress?.number_progress ?? 0) / 3) * 100);
    const overallPercent = Math.round((alphabetPercent + numberPercent) / 2);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name="arrow-left" size={24} color="#1A1A2E" />
                </Pressable>
                <Text style={styles.headerTitle}>{child.name}'s Progress</Text>
                <Pressable style={styles.settingsBtn}>
                    <Icon name="cog-outline" size={24} color="#1A1A2E" />
                </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Profile Section */}
               <View style={styles.profileSection}>

    {/* LEFT: Avatar */}
    <View style={styles.avatarContainer}>
        {child.avatar ? (
            <Image source={{ uri: child.avatar }} style={styles.avatar} />
        ) : (
            <Image source={require('../assets/Homescreen/student.png')} style={styles.avatar} />
        )}
        <View style={styles.onlineBadge} />
    </View>

    {/* RIGHT: Info */}
    <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{child.name}</Text>

        <View style={styles.profileMeta}>
            <View style={styles.levelBadge}>
                <Text style={styles.levelText}>Level 4 Explorer</Text>
            </View>
            <Text style={styles.activeText}>• Active 2h ago</Text>
        </View>
    </View>

</View>
                {/* Tabs */}
                <View style={styles.tabsRow}>
                    <View style={[styles.tab, styles.activeTab]}>
                        <Text style={[styles.tabText, styles.activeTabText]}>Overview</Text>
                    </View>
                    <View style={styles.tab}>
                        <Text style={styles.tabText}>Subjects</Text>
                    </View>
                    <View style={styles.tab}>
                        <Text style={styles.tabText}>Settings</Text>
                    </View>
                </View>

                {/* Study Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <Text style={styles.statLabel}>Study Time</Text>
                            <View style={styles.iconBgTime}>
                                <Icon name="clock-time-three" size={16} color="#FFFFFF" />
                            </View>
                        </View>
                        <View style={styles.statValueRow}>
                            <Text style={styles.statValue}>4h</Text>
                            <Text style={styles.statSubValue}>20m</Text>
                        </View>
                        <View style={styles.trendBadgePositive}>
                            <Text style={styles.trendTextPositive}>+12%</Text>
                        </View>
                    </View>

                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <Text style={styles.statLabel}>Tasks Done</Text>
                            <View style={styles.iconBgTasks}>
                                <Icon name="check" size={16} color="#FFFFFF" />
                            </View>
                        </View>
                        <View style={styles.statValueRowTasks}>
                            <Text style={styles.statValue}>12</Text>
                            <Text style={styles.statGoal}> / 15 Goal</Text>
                        </View>
                    </View>
                </View>

                {/* Tracing Mastery */}
                <View style={styles.cardContainer}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Tracing Mastery</Text>
                        <Text style={styles.lastUpdatedText}>
                            {progress?.last_tracing_update
                                ? `Updated ${new Date(progress.last_tracing_update).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                })}`
                                : 'No recent update'}
                        </Text>
                    </View>

                    {loadingProgress ? (
                        <View style={styles.loadingProgressWrap}>
                            <Text style={styles.loadingProgressText}>Loading progress...</Text>
                        </View>
                    ) : !progress ? (
                        <View style={styles.loadingProgressWrap}>
                            <Text style={styles.noProgressText}>No progress data available</Text>
                        </View>
                    ) : (
                        <>
                            <View style={styles.progressItem}>
                                <View style={styles.progressLabelRow}>
                                    <View style={styles.dotAlphabet} />
                                    <Text style={styles.subjectName}>Alphabet Progress</Text>
                                    <Text style={styles.subjectPercent}>{alphabetPercent}%</Text>
                                </View>
                                <View style={styles.progressBarBg}>
                                    <View style={[styles.progressBarFill, styles.bgAlphabet, { width: `${alphabetPercent}%` }]} />
                                </View>
                            </View>

                            <View style={styles.progressItem}>
                                <View style={styles.progressLabelRow}>
                                    <View style={styles.dotNumbers} />
                                    <Text style={styles.subjectName}>Numbers Progress</Text>
                                    <Text style={styles.subjectPercent}>{numberPercent}%</Text>
                                </View>
                                <View style={styles.progressBarBg}>
                                    <View style={[styles.progressBarFill, styles.bgNumbers, { width: `${numberPercent}%` }]} />
                                </View>
                            </View>

                            <View style={styles.progressItem}>
                                <View style={styles.progressLabelRow}>
                                    <View style={styles.dotOverall} />
                                    <Text style={styles.subjectName}>Overall Progress</Text>
                                    <Text style={styles.subjectPercent}>{overallPercent}%</Text>
                                </View>
                                <View style={styles.progressBarBg}>
                                    <View style={[styles.progressBarFill, styles.bgOverall, { width: `${overallPercent}%` }]} />
                                </View>
                            </View>
                        </>
                    )}
                </View>

                {/* Parental Controls */}
                <Text style={styles.sectionHeading}>PARENTAL CONTROLS</Text>
                <View style={styles.controlCard}>
                    <View style={styles.controlIconBgRed}>
                        <Icon name="brain" size={24} color="#DC2626" />
                    </View>
                    <View style={styles.controlInfo}>
                        <Text style={styles.controlTitle}>Difficulty Override</Text>
                        <Text style={styles.controlDesc}>Manually set assignment level</Text>
                    </View>
                    <View style={styles.toggleTrackOff}>
                        <View style={styles.toggleThumbOff} />
                    </View>
                </View>

                <View style={styles.controlCard}>
                    <View style={styles.controlIconBgBlue}>
                        <Icon name="timer-sand" size={24} color="#1B337F" />
                    </View>
                    <View style={styles.controlInfo}>
                        <Text style={styles.controlTitle}>Screen Time Limits</Text>
                        <Text style={styles.controlDesc}>Currently: 2h 30m / day</Text>
                    </View>
                    <View style={styles.toggleTrackOn}>
                        <View style={styles.toggleThumbOn} />
                    </View>
                </View>

                {/* Recent Activity */}
                <View style={styles.cardContainer}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Recent Activity</Text>
                    </View>

                    <View style={styles.activityItem}>
                        <View style={styles.activityIconBgGreen}>
                            <Icon name="star" size={20} color="#059669" />
                        </View>
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityTitle}>Completed "Algebra Basics"</Text>
                            <Text style={styles.activityMeta}>Math • 15 mins ago</Text>
                        </View>
                        <Text style={styles.xpText}>+50 XP</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.activityItem}>
                        <View style={styles.activityIconBgOrange}>
                            <Icon name="book-open-blank-variant" size={20} color="#D97706" />
                        </View>
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityTitle}>Reading "Space Exploration"</Text>
                            <Text style={styles.activityMeta}>Science • 2h ago</Text>
                        </View>
                        <Text style={styles.inProgressText}>In Progress</Text>
                    </View>
                </View>

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
    settingsBtn: {
        padding: 8,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileSection: {
        flexDirection: 'row',   // For vertical 
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 24,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    profileInfo: {
    marginLeft: 16,
    flex: 1,
},
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#10B981',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    profileName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A2E',
        marginBottom: 8,
    },
    profileMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    levelBadge: {
        backgroundColor: '#E8F4FD',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    levelText: {
        color: '#1B337F',
        fontSize: 12,
        fontWeight: '600',
    },
    activeText: {
        color: '#6B7280',
        fontSize: 13,
        marginLeft: 8,
    },
    tabsRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#1B337F',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#6B7280',
    },
    activeTabText: {
        color: '#1B337F',
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 16,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    iconBgTime: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#1B337F',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconBgTasks: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#A855F7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 8,
    },
    statValueRowTasks: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: 4,
    },
    statValue: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    statSubValue: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1A1A2E',
        marginLeft: 2,
    },
    statGoal: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 4,
    },
    trendBadgePositive: {
        alignSelf: 'flex-start',
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    trendTextPositive: {
        color: '#059669',
        fontSize: 12,
        fontWeight: '600',
    },
    cardContainer: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    lastUpdatedText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#6B7280',
    },
    progressItem: {
        marginBottom: 16,
    },
    progressLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dotAlphabet: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563EB', marginRight: 8 },
    dotNumbers: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#059669', marginRight: 8 },
    dotOverall: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#7C3AED', marginRight: 8 },
    subjectName: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    subjectPercent: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    bgAlphabet: { backgroundColor: '#2563EB' },
    bgNumbers: { backgroundColor: '#059669' },
    bgOverall: { backgroundColor: '#7C3AED' },
    loadingProgressWrap: {
        paddingVertical: 8,
    },
    loadingProgressText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    noProgressText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    sectionHeading: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6B7280',
        marginHorizontal: 20,
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    controlCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    controlIconBgRed: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    controlIconBgBlue: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E8F4FD',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    controlInfo: {
        flex: 1,
    },
    controlTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A2E',
        marginBottom: 4,
    },
    controlDesc: {
        fontSize: 13,
        color: '#6B7280',
    },
    toggleTrackOff: {
        width: 48,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    toggleThumbOff: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    toggleTrackOn: {
        width: 48,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#1B337F',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 2,
    },
    toggleThumbOn: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activityIconBgGreen: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    activityIconBgOrange: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FEF3C7',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    activityInfo: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A2E',
        marginBottom: 4,
    },
    activityMeta: {
        fontSize: 12,
        color: '#6B7280',
    },
    xpText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#059669',
    },
    inProgressText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 16,
        marginLeft: 56,
    }
});

export default ChildProgressScreen;
