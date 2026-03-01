import React from 'react';
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

const { width } = Dimensions.get('window');

const ParentHomeScreen = ({ navigation }: any) => {
    const { user, students } = useAuth();

    // Format date: "Thursday, Oct 24"
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    const dateString = today.toLocaleDateString('en-US', options);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.dateText}>{dateString}</Text>
                    <Text style={styles.greetingText}>
                        Good Morning, {user?.name?.split(' ')[0] || 'Parent'}
                    </Text>
                </View>
                <Pressable style={styles.bellIcon}>
                    <Icon name="bell-outline" size={24} color="#1B337F" />
                    <View style={styles.notificationDot} />
                </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Top Stats */}
                <View style={styles.topStatsRow}>
                    <View style={styles.statBadge}>
                        <Icon name="timer-outline" size={16} color="#1B337F" />
                        <Text style={styles.statText}>Avg Session: 18m</Text>
                    </View>
                    <View style={styles.statBadge}>
                        <Icon name="chart-line-variant" size={16} color="#10B981" />
                        <Text style={[styles.statText, { color: '#10B981' }]}>Focus: +12%</Text>
                    </View>
                </View>

                {/* Your Children Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Your Children</Text>
                    <Pressable>
                        <Text style={styles.seeAllText}>See all</Text>
                    </Pressable>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.childrenScroll}
                >
                    {students && students.length > 0 ? (
                        students.map((child: any, index: number) => {
                            // Alternate colors
                            const isFirst = index % 2 === 0;
                            const bgColor = isFirst ? '#1B337F' : '#EC4899';

                            return (
                                <Pressable
                                    key={child.id}
                                    style={styles.childCard}
                                    onPress={() => navigation.navigate('ChildProgress', { childId: child.id })}
                                >
                                    {/* Top Colored Banner */}
                                    <View style={[styles.cardBanner, { backgroundColor: bgColor }]}>
                                        <View style={styles.levelBadge}>
                                            <Text style={styles.levelText}>Level 4</Text>
                                        </View>
                                    </View>

                                    {/* Avatar (overlapping banner) */}
                                    <View style={styles.avatarContainer}>
                                        {child.avatar ? (
                                            <Image source={{ uri: child.avatar }} style={styles.avatarImage} />
                                        ) : (
                                            <Image
                                                source={require('../assets/Homescreen/student.png')}
                                                style={styles.avatarImage}
                                                resizeMode="cover"
                                            />
                                        )}
                                    </View>

                                    {/* Info Section */}
                                    <View style={styles.cardInfo}>
                                        <View style={styles.nameRow}>
                                            <View>
                                                <Text style={styles.childName}>{child.name || 'Child'}</Text>
                                                <Text style={styles.childAge}>Age {child.age || '8'} • Grade {Math.max(1, (child.age || 8) - 5)}</Text>
                                            </View>
                                            <View style={styles.focusScoreContainer}>
                                                <Text style={styles.focusScoreLabel}>FOCUS SCORE</Text>
                                                <Text style={styles.focusScoreValue}>8.5<Text style={styles.focusScoreMax}>/10</Text></Text>
                                            </View>
                                        </View>

                                        {/* Progress Bar */}
                                        <View style={styles.progressRow}>
                                            <Text style={styles.progressLabel}>Daily Goal</Text>
                                            <Text style={styles.progressPercent}>75%</Text>
                                        </View>
                                        <View style={styles.progressBarBG}>
                                            <View style={[styles.progressBarFill, { width: '75%', backgroundColor: bgColor }]} />
                                        </View>

                                        {/* Stats Boxes */}
                                        <View style={styles.statsRow}>
                                            <View style={styles.statBox}>
                                                <Icon name="book-open-variant" size={16} color="#8B5CF6" />
                                                <Text style={styles.statBoxLabel}>Reading</Text>
                                                <Text style={styles.statBoxValue}>25m today</Text>
                                            </View>
                                            <View style={styles.statBox}>
                                                <Icon name="calculator-variant-outline" size={16} color="#10B981" />
                                                <Text style={styles.statBoxLabel}>Math</Text>
                                                <Text style={styles.statBoxValue}>15m today</Text>
                                            </View>
                                        </View>

                                        <Pressable style={styles.reportBtn}>
                                            <Text style={styles.reportBtnText}>View Detailed Report</Text>
                                        </Pressable>
                                    </View>
                                </Pressable>
                            );
                        })
                    ) : (
                        <Pressable
                            style={styles.emptyChildCard}
                            onPress={() => navigation.navigate('ParentAddChild')}
                        >
                            <Icon name="plus-circle-outline" size={40} color="#9CA3AF" />
                            <Text style={styles.emptyChildText}>Add Child</Text>
                        </Pressable>
                    )}
                </ScrollView>

                {/* Routine Preview */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Routine Preview</Text>
                </View>

                <View style={styles.routineCard}>
                    <View style={styles.routineHeader}>
                        <View style={styles.routineIconBg}>
                            <Icon name="clock-time-three-outline" size={20} color="#1B337F" />
                        </View>
                        <View style={styles.routineInfo}>
                            <Text style={styles.routineComingUp}>COMING UP NEXT</Text>
                            <Text style={styles.routineTitle}>Math Logic Puzzle</Text>
                        </View>
                        <View style={styles.routineTimeBg}>
                            <Text style={styles.routineTimeText}>4:00 PM</Text>
                        </View>
                    </View>

                    <View style={styles.assignedRow}>
                        <View style={styles.assignedAvatars}>
                            <Image source={require('../assets/Homescreen/student.png')} style={styles.miniAvatar} />
                        </View>
                        <Text style={styles.assignedText}>Assigned to <Text style={styles.assignedName}>{students?.[0]?.name || 'Leo'}</Text></Text>
                    </View>

                    <View style={styles.routineFooter}>
                        <View style={styles.tagsRow}>
                            <View style={styles.tagRequired}><Text style={styles.tagRequiredText}>Required</Text></View>
                            <View style={styles.tagLogic}><Text style={styles.tagLogicText}>Logic</Text></View>
                        </View>
                        <Pressable style={styles.editRoutineBtn}>
                            <Text style={styles.editRoutineText}>Edit Routine</Text>
                            <Icon name="arrow-right" size={16} color="#1B337F" />
                        </Pressable>
                    </View>
                </View>

                {/* Device Limit Alert */}
                <View style={styles.alertCard}>
                    <View style={styles.alertHeaderRow}>
                        <Icon name="alert-outline" size={20} color="#D97706" />
                        <Text style={styles.alertTitle}>Device Limit Reached</Text>
                    </View>
                    <Text style={styles.alertDesc}>
                        {students?.[0]?.name || 'Leo'} has reached his 2-hour daily limit on the Tablet.
                    </Text>
                    <View style={styles.alertActions}>
                        <Pressable><Text style={styles.alertAddText}>Add 30m</Text></Pressable>
                        <Pressable><Text style={styles.alertDismissText}>Dismiss</Text></Pressable>
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
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    dateText: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
        fontWeight: '500',
    },
    greetingText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1B337F',
    },
    bellIcon: {
        position: 'relative',
        padding: 8,
    },
    notificationDot: {
        position: 'absolute',
        top: 6,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 1,
        borderColor: '#F8F9FA',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    topStatsRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 24,
    },
    statBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    statText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginLeft: 6,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    seeAllText: {
        fontSize: 14,
        color: '#1B337F',
        fontWeight: '600',
    },
    childrenScroll: {
        paddingHorizontal: 20,
        gap: 16,
        paddingBottom: 24,
    },
    childCard: {
        width: width * 0.75,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        overflow: 'hidden',
    },
    emptyChildCard: {
        width: width * 0.75,
        height: 350,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyChildText: {
        marginTop: 12,
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '600',
    },
    cardBanner: {
        height: 80,
        width: '100%',
        position: 'relative',
    },
    levelBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    levelText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    avatarContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        top: 45,
        left: 20,
        padding: 4,
        zIndex: 10,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 31,
        backgroundColor: '#F3F4F6',
    },
    cardInfo: {
        paddingTop: 45,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    childName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    childAge: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    focusScoreContainer: {
        alignItems: 'flex-end',
    },
    focusScoreLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 0.5,
    },
    focusScoreValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1B337F',
    },
    focusScoreMax: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 13,
        color: '#374151',
        fontWeight: '500',
    },
    progressPercent: {
        fontSize: 13,
        color: '#1B337F',
        fontWeight: '700',
    },
    progressBarBG: {
        height: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        marginBottom: 20,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        padding: 12,
        borderRadius: 12,
    },
    statBoxLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    statBoxValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1A1A2E',
        marginTop: 2,
    },
    reportBtn: {
        backgroundColor: '#F3F4F6',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    reportBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1B337F',
    },
    routineCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    routineHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    routineIconBg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F4FD',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    routineInfo: {
        flex: 1,
    },
    routineComingUp: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    routineTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    routineTimeBg: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    routineTimeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },
    assignedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    assignedAvatars: {
        flexDirection: 'row',
        marginRight: 8,
    },
    miniAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E5E7EB',
    },
    assignedText: {
        fontSize: 13,
        color: '#6B7280',
    },
    assignedName: {
        fontWeight: '600',
        color: '#1A1A2E',
    },
    routineFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 16,
    },
    tagsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    tagRequired: {
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    tagRequiredText: {
        color: '#059669',
        fontSize: 10,
        fontWeight: '600',
    },
    tagLogic: {
        backgroundColor: '#F3E8FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    tagLogicText: {
        color: '#9333EA',
        fontSize: 10,
        fontWeight: '600',
    },
    editRoutineBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editRoutineText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1B337F',
        marginRight: 4,
    },
    alertCard: {
        backgroundColor: '#FFFBEB',
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#FEF3C7',
    },
    alertHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    alertTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#92400E',
        marginLeft: 8,
    },
    alertDesc: {
        fontSize: 13,
        color: '#B45309',
        lineHeight: 20,
        marginBottom: 12,
    },
    alertActions: {
        flexDirection: 'row',
        gap: 16,
    },
    alertAddText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#B45309',
        textDecorationLine: 'underline',
    },
    alertDismissText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#92400E',
    },
});

export default ParentHomeScreen;
