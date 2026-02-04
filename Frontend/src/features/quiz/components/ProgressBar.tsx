/**
 * Animated Progress Bar Component
 * Uses Reanimated for smooth UI thread animations
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/theme';

interface ProgressBarProps {
    current: number;
    total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
    const progress = useSharedValue(0);
    const percentage = Math.round((current / total) * 100);

    useEffect(() => {
        progress.value = withTiming(percentage, { duration: 300 });
    }, [current, total, percentage]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${progress.value}%`,
    }));

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.text}>
                    Question {current} of {total}
                </Text>
                <Text style={styles.percentageText}>{percentage}%</Text>
            </View>
            <View style={styles.barBackground}>
                <Animated.View style={[styles.barFill, animatedStyle]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    text: {
        fontSize: TYPOGRAPHY.caption,
        fontWeight: TYPOGRAPHY.medium,
        color: COLORS.textPrimary,
    },
    percentageText: {
        fontSize: TYPOGRAPHY.caption,
        fontWeight: TYPOGRAPHY.medium,
        color: COLORS.textPrimary,
    },
    barBackground: {
        height: 6,
        backgroundColor: COLORS.border,
        borderRadius: BORDER_RADIUS.full,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.full,
    },
});
