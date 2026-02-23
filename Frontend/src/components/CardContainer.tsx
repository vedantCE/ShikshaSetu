import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { palette, metrics } from '../theme/design';

interface CardContainerProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export const CardContainer: React.FC<CardContainerProps> = ({ children, style }) => (
    <View style={[styles.card, style]}>{children}</View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: palette.card,
        borderRadius: metrics.radius,
        padding: metrics.spacing,
        marginBottom: metrics.spacing,
        ...metrics.shadow,
    },
});
