/**
 * Result Screen - Supportive, non-judgmental results display
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
import { RouteProp } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import type { RootStackParamList } from '../../../navigation/RootNavigator';
import {
    getResultExplanation,
    getScoreLevel,
} from '../utils/scoringLogic';
import {
    COLORS,
    TYPOGRAPHY,
    SPACING,
    BORDER_RADIUS,
} from '../constants/theme';

type ResultScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'AssessmentResult'
>;

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'AssessmentResult'>;

// Simple SVG Icons
const BriefcaseIcon = ({ color }: { color: string }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <Path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </Svg>
);

const BookIcon = ({ color }: { color: string }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </Svg>
);

const PdfIcon = ({ color }: { color: string }) => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <Path d="M14 2v6h6" />
        <Path d="M12 18v-6" />
        <Path d="M9 15l3 3 3-3" />
    </Svg>
);

const InfoIcon = ({ color }: { color: string }) => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Path d="M12 16v-4" />
        <Path d="M12 8h.01" />
    </Svg>
);

interface ResultScreenProps {
    navigation: ResultScreenNavigationProp;
    route: ResultScreenRouteProp;
}

const DomainBar = ({ label, percentage }: { label: string; percentage: number }) => (
    <View style={styles.domainRow}>
        <View style={styles.domainHeader}>
            <View>
                <Text style={styles.domainLabel}>{label.toUpperCase()} DOMAIN</Text>
                <Text style={styles.domainLevel}>{getScoreLevel(percentage)}</Text>
            </View>
            <Text style={styles.domainPercentage}>{percentage}%</Text>
        </View>
        <View style={styles.barBackground}>
            <View style={[styles.barFill, { width: `${percentage}%` }]} />
        </View>
    </View>
);

export const ResultScreen: React.FC<ResultScreenProps> = ({
    navigation,
    route,
}) => {
    const params = route.params || {};
    const { category, scores } = params;

    const handleRetakeQuiz = () => {
        navigation.navigate('AssessmentQuizHome');
    };

    const handleContinue = () => {
        // Navigate to ActivityHub after viewing results
        navigation.navigate('ActivityHub');
    };

    if (!category || !scores) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Unable to load results.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
                    <View style={styles.backArrow} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Screening Summary</Text>
                <TouchableOpacity style={styles.headerIcon}>
                    <View style={styles.shareIcon}>
                        <View style={styles.shareDot} />
                        <View style={styles.shareLine1} />
                        <View style={styles.shareLine2} />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Result Title */}
                <View style={styles.titleSection}>
                    <Text style={styles.resultCategory}>{category} Observed</Text>
                    <Text style={styles.subtitle}>Based on ShikshSetu's pattern analysis.</Text>
                </View>

                {/* Scores Card */}
                <View style={styles.scoresCard}>
                    <DomainBar label="ADHD" percentage={scores.ADHD} />
                    <DomainBar label="Autism" percentage={scores.AUTISM} />
                    <DomainBar label="Intellectual Disability" percentage={scores.ID} />
                </View>

                {/* Interpretation Box */}
                <View style={styles.interpretationBox}>
                    <View style={styles.blueIndicator} />
                    <View style={styles.interpretationHeader}>
                        <View style={styles.gearIconContainer}>
                            <InfoIcon color={COLORS.surface} />
                        </View>
                        <Text style={styles.interpretationTitle}>Professional Interpretation</Text>
                    </View>
                    <Text style={styles.interpretationText}>
                        {getResultExplanation(category)}
                    </Text>
                </View>

                {/* Next Steps */}
                <View style={styles.nextStepsSection}>
                    <Text style={styles.sectionLabel}>RECOMMENDED NEXT STEPS</Text>

                    <TouchableOpacity style={styles.stepCard}>
                        <View style={styles.stepIconContainer}>
                            <BriefcaseIcon color={COLORS.primary} />
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Book Specialist Consultation</Text>
                            <Text style={styles.stepSubtitle}>Connect with local vetted experts</Text>
                        </View>
                        <View style={styles.chevronRight} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.stepCard}>
                        <View style={styles.stepIconContainer}>
                            <BookIcon color={COLORS.primary} />
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Supportive Resource Library</Text>
                            <Text style={styles.stepSubtitle}>Guided toolkits for parents</Text>
                        </View>
                        <View style={styles.chevronRight} />
                    </TouchableOpacity>
                </View>

                {/* Buttons */}
                <TouchableOpacity style={styles.retakeButton} onPress={handleContinue}>
                    <Text style={styles.retakeButtonText}>Continue to Activities</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.downloadButton} onPress={handleRetakeQuiz}>
                    <View style={styles.downloadContent}>
                        <PdfIcon color={COLORS.primary} />
                        <Text style={styles.downloadButtonText}>Retake Screening</Text>
                    </View>
                </TouchableOpacity>

                {/* Disclaimer */}
                <Text style={styles.disclaimerText}>
                    Disclaimer: ShikshSetu is for informational purposes only and does not replace professional medical advice. Always seek the advice of your physician regarding any medical condition.
                </Text>

                <View style={styles.bottomDash} />
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
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
    },
    headerTitle: {
        fontSize: TYPOGRAPHY.bodyLarge,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
    },
    headerIcon: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backArrow: {
        width: 10,
        height: 10,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderColor: COLORS.textPrimary,
        transform: [{ rotate: '45deg' }],
    },
    shareIcon: {
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.textPrimary,
    },
    shareLine1: {
        position: 'absolute',
        width: 10,
        height: 2,
        backgroundColor: COLORS.textPrimary,
        top: 4,
        right: 0,
        transform: [{ rotate: '-45deg' }],
    },
    shareLine2: {
        position: 'absolute',
        width: 10,
        height: 2,
        backgroundColor: COLORS.textPrimary,
        bottom: 4,
        right: 0,
        transform: [{ rotate: '45deg' }],
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.xl,
    },
    titleSection: {
        marginTop: SPACING.xl,
        marginBottom: SPACING.lg,
    },
    resultCategory: {
        fontSize: TYPOGRAPHY.title,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
        lineHeight: 34,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.primary,
        marginTop: SPACING.xs,
        opacity: 0.8,
    },
    scoresCard: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 5,
    },
    domainRow: {
        marginBottom: SPACING.lg,
    },
    domainHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: SPACING.sm,
    },
    domainLabel: {
        fontSize: TYPOGRAPHY.small,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.primary,
        opacity: 0.6,
        letterSpacing: 0.5,
    },
    domainLevel: {
        fontSize: TYPOGRAPHY.bodyLarge,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
        marginTop: 2,
    },
    domainPercentage: {
        fontSize: TYPOGRAPHY.heading,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.primary,
    },
    barBackground: {
        height: 10,
        backgroundColor: COLORS.border,
        borderRadius: BORDER_RADIUS.full,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.full,
    },
    interpretationBox: {
        backgroundColor: COLORS.secondary,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        marginBottom: SPACING.xl,
        flexDirection: 'column',
        overflow: 'hidden',
    },
    blueIndicator: {
        position: 'absolute',
        left: 0,
        top: 20,
        bottom: 20,
        width: 4,
        backgroundColor: COLORS.primary,
        borderRadius: 2,
    },
    interpretationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    gearIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    gearCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: COLORS.surface,
    },
    gearDot: {
        position: 'absolute',
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.surface,
    },
    interpretationTitle: {
        fontSize: TYPOGRAPHY.bodyLarge,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
    },
    interpretationText: {
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        lineHeight: 24,
    },
    nextStepsSection: {
        marginBottom: SPACING.xl,
    },
    sectionLabel: {
        fontSize: TYPOGRAPHY.caption,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
        letterSpacing: 0.5,
    },
    stepCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    stepIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    bagIcon: {
        width: 18,
        height: 14,
        borderRadius: 2,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    libraryIcon: {
        width: 18,
        height: 14,
        borderRadius: 2,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
    },
    stepSubtitle: {
        fontSize: TYPOGRAPHY.caption,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    chevronRight: {
        width: 8,
        height: 8,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderColor: COLORS.textLight,
        transform: [{ rotate: '45deg' }],
    },
    retakeButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md + 4,
        borderRadius: BORDER_RADIUS.xl,
        marginBottom: SPACING.md,
    },
    retakeButtonText: {
        fontSize: TYPOGRAPHY.bodyLarge,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.surface,
        textAlign: 'center',
    },
    downloadButton: {
        backgroundColor: COLORS.background,
        paddingVertical: SPACING.md + 4,
        borderRadius: BORDER_RADIUS.xl,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.xl,
    },
    downloadContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pdfIcon: {
        width: 16,
        height: 16,
        borderWidth: 2,
        borderColor: COLORS.primary,
        marginRight: SPACING.sm,
    },
    downloadButtonText: {
        fontSize: TYPOGRAPHY.bodyLarge,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.primary,
    },
    disclaimerText: {
        fontSize: TYPOGRAPHY.small,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: SPACING.xl,
    },
    bottomDash: {
        width: 100,
        height: 5,
        backgroundColor: COLORS.border,
        borderRadius: 3,
        alignSelf: 'center',
    },
});
