import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const LearningAnalyticsScreen = ({ navigation }: any) => {
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

                {/* Top Mini Stats */}
                <View style={styles.topStatsRow}>
                    <View style={styles.miniStatCard}>
                        <View style={styles.iconBgBlue}>
                            <Icon name="clock-time-four" size={16} color="#1B337F" />
                        </View>
                        <Text style={styles.miniStatLabel}>Time</Text>
                        <Text style={styles.miniStatValue}>12h 30m</Text>
                        <View style={styles.miniTrendBadge}><Text style={styles.miniTrendText}>+5%</Text></View>
                    </View>

                    <View style={styles.miniStatCard}>
                        <View style={styles.iconBgPurple}>
                            <Icon name="school" size={16} color="#4F46E5" />
                        </View>
                        <Text style={styles.miniStatLabel}>Score</Text>
                        <Text style={styles.miniStatValue}>88%</Text>
                        <View style={styles.miniTrendBadge}><Text style={styles.miniTrendText}>+2%</Text></View>
                    </View>

                    <View style={styles.miniStatCard}>
                        <View style={styles.iconBgIndigo}>
                            <Icon name="check-circle" size={16} color="#4338CA" />
                        </View>
                        <Text style={styles.miniStatLabel}>Done</Text>
                        <Text style={styles.miniStatValue}>15 Tasks</Text>
                        <View style={styles.miniTrendBadge}><Text style={styles.miniTrendText}>+10%</Text></View>
                    </View>
                </View>

                {/* Weekly Performance - Mock Graph */}
                <View style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <View>
                            <Text style={styles.chartTitle}>Weekly Performance</Text>
                            <Text style={styles.chartSubtitle}>Learning activity trends</Text>
                        </View>
                        <View style={styles.chartTitleRight}>
                            <Text style={styles.chartValue}>85%</Text>
                            <Text style={styles.chartTrendText}>+12% vs last wk</Text>
                        </View>
                    </View>

                    {/* Simple mock area chart using static views (as a placeholder for an actual SVG) */}
                    <View style={styles.chartArea}>
                        <View style={styles.chartGridLine} />
                        <View style={styles.chartGridLine} />
                        <View style={styles.chartGridLine} />
                        <View style={styles.chartGridLine} />

                        <View style={styles.mockChartPathContainer}>
                            {/* Very rough approximation using flex items */}
                            <View style={[styles.bar, { height: '20%' }]} />
                            <View style={[styles.bar, { height: '50%' }]} />
                            <View style={[styles.bar, { height: '30%' }]} />
                            <View style={[styles.bar, { height: '40%' }]} />
                            <View style={[styles.bar, { height: '80%' }]} />
                            <View style={[styles.bar, { height: '50%' }]} />
                            <View style={[styles.bar, { height: '60%' }]} />
                        </View>
                    </View>

                    <View style={styles.daysRow}>
                        <Text style={styles.dayText}>Mon</Text>
                        <Text style={styles.dayText}>Tue</Text>
                        <Text style={styles.dayText}>Wed</Text>
                        <Text style={styles.dayText}>Thu</Text>
                        <Text style={styles.dayText}>Fri</Text>
                        <Text style={styles.dayText}>Sat</Text>
                        <Text style={styles.dayText}>Sun</Text>
                    </View>
                </View>

                {/* Subject Mastery */}
                <Text style={styles.sectionHeading}>Subject Mastery</Text>

                <View style={styles.masteryCard}>
                    <View style={styles.masteryIconBgLightBlue}>
                        <Text style={styles.iconLetterBlue}>Σ</Text>
                    </View>
                    <View style={styles.masteryInfo}>
                        <View style={styles.masteryTitleRow}>
                            <Text style={styles.masteryTitle}>Mathematics</Text>
                            <Text style={styles.masteryPercent}>92%</Text>
                        </View>
                        <View style={styles.masteryBarBg}>
                            <View style={[styles.masteryBarFill, { width: '92%', backgroundColor: '#2563EB' }]} />
                        </View>
                    </View>
                </View>

                <View style={styles.masteryCard}>
                    <View style={styles.masteryIconBgLightGreen}>
                        <Icon name="flask" size={20} color="#059669" />
                    </View>
                    <View style={styles.masteryInfo}>
                        <View style={styles.masteryTitleRow}>
                            <Text style={styles.masteryTitle}>Science</Text>
                            <Text style={styles.masteryPercent}>78%</Text>
                        </View>
                        <View style={styles.masteryBarBg}>
                            <View style={[styles.masteryBarFill, { width: '78%', backgroundColor: '#059669' }]} />
                        </View>
                    </View>
                </View>

                <View style={styles.masteryCard}>
                    <View style={styles.masteryIconBgLightPurple}>
                        <Icon name="translate" size={20} color="#9333EA" />
                    </View>
                    <View style={styles.masteryInfo}>
                        <View style={styles.masteryTitleRow}>
                            <Text style={styles.masteryTitle}>Languages</Text>
                            <Text style={styles.masteryPercent}>85%</Text>
                        </View>
                        <View style={styles.masteryBarBg}>
                            <View style={[styles.masteryBarFill, { width: '85%', backgroundColor: '#9333EA' }]} />
                        </View>
                    </View>
                </View>

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
