import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
    FadeInDown,
    FadeInUp,
    ZoomIn,
} from 'react-native-reanimated';

const TugOfWarResultScreen = ({ route, navigation }: any) => {
    const {
        winner = 'draw',
        team1Score = 0,
        team2Score = 0,
        duration = 30,
        difficulty = 'easy',
    } = route?.params || {};

    const totalCorrect = team1Score + team2Score;
    const totalQuestions = totalCorrect > 0 ? Math.max(totalCorrect + 4, totalCorrect) : 0;
    const accuracy1 = totalCorrect > 0 ? Math.round((team1Score / Math.max(team1Score + 2, 1)) * 100) : 0;

    const isWin = winner === 'team1';
    const isDraw = winner === 'draw';

    const headerColors = isWin
        ? ['#10B981', '#34D399']
        : isDraw
            ? ['#F59E0B', '#FBBF24']
            : ['#EF4444', '#F87171'];

    const headerIcon = isWin ? 'trophy' : isDraw ? 'handshake' : 'emoticon-sad-outline';
    const headerText = isWin ? 'You Win!' : isDraw ? "It's a Draw!" : 'Team 2 Wins!';

    return (
        <SafeAreaView style={styles.root}>
            {/* Trophy / Result Header */}
            <Animated.View entering={ZoomIn.duration(600).springify()}>
                <LinearGradient
                    colors={headerColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerCard}
                >
                    <Icon name={headerIcon} size={64} color="#FFF" />
                    <Text style={styles.headerTitle}>{headerText}</Text>
                    <Text style={styles.headerSub}>
                        {isWin
                            ? 'Great job! You pulled the rope!'
                            : isDraw
                                ? 'Both teams fought hard!'
                                : 'Better luck next time!'}
                    </Text>
                </LinearGradient>
            </Animated.View>

            {/* Stats Grid */}
            <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.statsGrid}>
                <View style={styles.statCard}>
                    <Icon name="trophy-outline" size={24} color="#3B82F6" />
                    <Text style={styles.statValue}>{team1Score}</Text>
                    <Text style={styles.statLabel}>Your Score</Text>
                </View>
                <View style={styles.statCard}>
                    <Icon name="account-group" size={24} color="#F97316" />
                    <Text style={styles.statValue}>{team2Score}</Text>
                    <Text style={styles.statLabel}>Opponent</Text>
                </View>
                <View style={styles.statCard}>
                    <Icon name="clock-outline" size={24} color="#8B5CF6" />
                    <Text style={styles.statValue}>{duration}s</Text>
                    <Text style={styles.statLabel}>Duration</Text>
                </View>
                <View style={styles.statCard}>
                    <Icon name="target" size={24} color="#10B981" />
                    <Text style={styles.statValue}>{accuracy1}%</Text>
                    <Text style={styles.statLabel}>Accuracy</Text>
                </View>
            </Animated.View>

            {/* Difficulty badge */}
            <Animated.View entering={FadeInUp.delay(350).springify()} style={styles.difficultyRow}>
                <Icon name="signal-cellular-3" size={18} color="#64748B" />
                <Text style={styles.difficultyText}>
                    Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </Text>
            </Animated.View>

            {/* Action Buttons */}
            <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.actions}>
                <Pressable
                    style={styles.playAgainBtn}
                    onPress={() => navigation.replace('TugOfWarGame', { difficulty })}
                >
                    <LinearGradient
                        colors={['#3B82F6', '#2563EB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.playAgainGradient}
                    >
                        <Icon name="reload" size={20} color="#FFF" />
                        <Text style={styles.playAgainText}>Play Again</Text>
                    </LinearGradient>
                </Pressable>

                <Pressable
                    style={styles.backBtn}
                    onPress={() => navigation.navigate('ActivityHub')}
                >
                    <Text style={styles.backBtnText}>Back to Activity Hub</Text>
                </Pressable>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F6F8FB',
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    headerCard: {
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        marginBottom: 24,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFF',
        marginTop: 12,
    },
    headerSub: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 6,
        fontWeight: '500',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },
    statCard: {
        width: '47%',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
    },
    statValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0F172A',
        marginTop: 6,
    },
    statLabel: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
        marginTop: 2,
    },
    difficultyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginBottom: 24,
    },
    difficultyText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '600',
    },
    actions: {
        gap: 12,
    },
    playAgainBtn: {
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    playAgainGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 10,
    },
    playAgainText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
    },
    backBtn: {
        borderRadius: 16,
        backgroundColor: '#FFF',
        paddingVertical: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E2E8F0',
    },
    backBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748B',
    },
});

export default TugOfWarResultScreen;
