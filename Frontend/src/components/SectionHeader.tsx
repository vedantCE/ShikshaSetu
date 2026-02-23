import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { palette, typography, metrics } from '../theme/design';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    rightElement?: React.ReactNode;
    style?: ViewStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    subtitle,
    rightElement,
    style,
}) => (
    <View style={[styles.container, style]}>
        <View>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {rightElement}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: metrics.spacing,
    },
    title: {
        ...typography.title,
    },
    subtitle: {
        ...typography.subtitle,
        marginTop: 2,
    },
});
