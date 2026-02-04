/**
 * Option Button Component
 * Large, accessible button with visual feedback
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import {
    COLORS,
    TYPOGRAPHY,
    SPACING,
    BORDER_RADIUS,
} from '../constants/theme';

interface OptionButtonProps {
    label: string;
    selected: boolean;
    onPress: () => void;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
    label,
    selected,
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                selected && styles.buttonSelected,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
                <View style={[styles.radioCircle, selected && styles.radioSelected]}>
                    {selected && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.text, selected && styles.textSelected]}>
                    {label}
                </Text>
            </View>
            {selected && (
                <View style={styles.checkCircle}>
                    <View style={styles.checkInner} />
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        minHeight: 56,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.xl,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        marginVertical: SPACING.xs,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buttonSelected: {
        backgroundColor: COLORS.secondary,
        borderColor: COLORS.primary,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: COLORS.textLight,
        marginRight: SPACING.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.surface,
    },
    text: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: TYPOGRAPHY.medium,
        color: COLORS.textPrimary,
    },
    textSelected: {
        fontWeight: TYPOGRAPHY.semibold,
    },
    checkCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkInner: {
        width: 10,
        height: 6,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderColor: COLORS.surface,
        transform: [{ rotate: '-45deg' }, { translateY: -1 }],
    },
});
