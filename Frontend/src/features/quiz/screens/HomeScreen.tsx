/**
 * Home Screen - Entry point for NeuroLearn Quiz
 * Welcoming interface with calm design
 */

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import type { RootStackParamList } from '../../../navigation/RootNavigator';
import {
    COLORS,
    TYPOGRAPHY,
    SPACING,
    BORDER_RADIUS,
} from '../constants/theme';

type HomeScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'AssessmentQuizHome'
>;

// Simple SVG Icons for Focus Areas
const ADHDIcon = ({ color }: { color: string }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Circle cx="12" cy="12" r="3" />
    </Svg>
);

const AutismIcon = ({ color }: { color: string }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <Circle cx="9" cy="7" r="4" />
        <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
);

const IntellectualIcon = ({ color }: { color: string }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.79-2.79 2.5 2.5 0 0 1 .44-4.96A2.5 2.5 0 0 1 2 9.5 2.5 2.5 0 0 1 4.5 7h5z" />
        <Path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.79-2.79 2.5 2.5 0 0 0-.44-4.96A2.5 2.5 0 0 0 22 9.5 2.5 2.5 0 0 0 19.5 7h-5z" />
    </Svg>
);

const CombinedIcon = ({ color }: { color: string }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Rect x="2" y="2" width="10" height="10" rx="2" />
        <Rect x="12" y="12" width="10" height="10" rx="2" />
        <Path d="M2 12h10v10" />
        <Path d="M12 2v10h10" />
    </Svg>
);

const ClockIcon = ({ color }: { color: string }) => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Path d="M12 6v6l4 2" />
    </Svg>
);

interface HomeScreenProps {
    navigation: HomeScreenNavigationProp;
}

const FocusAreaCard = ({ title, subtitle, color, icon }: any) => (
    <View style={styles.focusCard}>
        <View style={[styles.iconContainer, { backgroundColor: 'transparent' }]}>
            {icon}
        </View>
        <Text style={styles.focusTitle}>{title}</Text>
        <Text style={styles.focusSubtitle}>{subtitle}</Text>
    </View>
);

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const handleStartQuiz = () => {
        navigation.navigate('AssessmentQuiz');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.hamburger}>
                    <View style={styles.hamburgerLine} />
                    <View style={[styles.hamburgerLine, { width: 15 }]} />
                    <View style={styles.hamburgerLine} />
                </View>
                <Text style={styles.headerTitle}>ShikshSetu</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section */}
                <Text style={styles.heroText}>
                    Empowering neurodiversity through early pattern recognition
                </Text>
                <Text style={styles.subtitle}>
                    Identify behavioral patterns and support growth with our research-backed screening tools.
                </Text>

                {/* Focus Areas Section */}
                <View style={styles.focusAreasContainer}>
                    <Text style={styles.sectionLabel}>FOCUS AREAS</Text>
                    <View style={styles.grid}>
                        <FocusAreaCard
                            title="ADHD"
                            subtitle="Focus & Attention"
                            icon={<ADHDIcon color={COLORS.primary} />}
                        />
                        <FocusAreaCard
                            title="Autism"
                            subtitle="Social Connection"
                            icon={<AutismIcon color={COLORS.primary} />}
                        />
                        <FocusAreaCard
                            title="Intellectual"
                            subtitle="Cognitive Growth"
                            icon={<IntellectualIcon color={COLORS.primary} />}
                        />
                        <FocusAreaCard
                            title="Combined"
                            subtitle="Multiple Patterns"
                            icon={<CombinedIcon color={COLORS.primary} />}
                        />
                    </View>
                </View>

                {/* CTA Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleStartQuiz}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Start Screening</Text>
                </TouchableOpacity>

                {/* Timer info */}
                <View style={styles.timerContainer}>
                    <ClockIcon color={COLORS.primary} />
                    <Text style={styles.timerText}>Takes about 5 minutes</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.surface,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    headerTitle: {
        fontSize: TYPOGRAPHY.heading,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
    },
    hamburger: {
        width: 24,
        height: 20,
        justifyContent: 'space-between',
    },
    hamburgerLine: {
        height: 2.5,
        width: 24,
        backgroundColor: COLORS.textPrimary,
        borderRadius: 2,
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.xl,
        alignItems: 'center',
    },
    heroText: {
        fontSize: TYPOGRAPHY.hero - 2,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginTop: SPACING.xl,
        lineHeight: 42,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.bodyLarge,
        color: COLORS.primary, // Using the main dark blue shade
        textAlign: 'center',
        marginTop: SPACING.lg,
        lineHeight: 26,
        paddingHorizontal: SPACING.md,
        opacity: 0.8,
    },
    focusAreasContainer: {
        width: '100%',
        marginTop: SPACING.xxl,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.xl,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: SPACING.lg,
    },
    sectionLabel: {
        fontSize: TYPOGRAPHY.caption,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
        letterSpacing: 1,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    focusCard: {
        width: '48%',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    iconContainer: {
        marginBottom: SPACING.sm,
    },
    focusTitle: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
    },
    focusSubtitle: {
        fontSize: TYPOGRAPHY.small,
        color: COLORS.primary,
        marginTop: 2,
    },
    placeholderIcon: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shape: {
        position: 'absolute',
        width: 12,
        height: 12,
        backgroundColor: COLORS.primary,
    },
    button: {
        backgroundColor: COLORS.primary,
        width: '100%',
        paddingVertical: SPACING.md + 4,
        borderRadius: BORDER_RADIUS.lg,
        marginTop: SPACING.xl,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        fontSize: TYPOGRAPHY.heading,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.surface,
        textAlign: 'center',
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.lg,
    },
    timerText: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.primary,
        marginLeft: SPACING.sm,
        opacity: 0.7,
    },
    clockIcon: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clockCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: COLORS.primary,
        opacity: 0.7,
    },
    clockHand: {
        position: 'absolute',
        width: 6,
        height: 2,
        backgroundColor: COLORS.primary,
        top: 9,
        left: 9,
        opacity: 0.7,
    },
});
