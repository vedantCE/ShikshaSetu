/**
 * Question Card Component
 * Full-screen optimized layout (not a centered card)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

interface QuestionCardProps {
    questionText: string;
}

export const QuestionCard = React.memo<QuestionCardProps>(({ questionText }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.questionText}>{questionText}</Text>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.md,
        paddingBottom: SPACING.sm,
    },
    questionText: {
        fontSize: TYPOGRAPHY.title,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.textPrimary,
        textAlign: 'left',
        lineHeight: 34,
    },
});
