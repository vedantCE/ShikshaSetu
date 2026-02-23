import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { palette, metrics } from '../theme/design';

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    variant?: 'primary' | 'danger' | 'outline';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    title,
    onPress,
    disabled = false,
    loading = false,
    style,
    textStyle,
    variant = 'primary',
}) => {
    const bgColor =
        variant === 'danger'
            ? palette.danger
            : variant === 'outline'
                ? 'transparent'
                : palette.primary;

    return (
        <Pressable
            style={[
                styles.button,
                { backgroundColor: bgColor },
                variant === 'outline' && styles.outline,
                (disabled || loading) && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
            ) : (
                <Text
                    style={[
                        styles.text,
                        variant === 'outline' && styles.outlineText,
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        ...metrics.shadow,
    },
    disabled: {
        opacity: 0.6,
    },
    outline: {
        borderWidth: 2,
        borderColor: palette.primary,
    },
    text: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    outlineText: {
        color: palette.primary,
    },
});
