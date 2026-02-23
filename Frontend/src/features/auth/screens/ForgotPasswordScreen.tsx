import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { palette, metrics, typography } from '../../../theme/design';

export const ForgotPasswordScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');

    const handleReset = () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }
        // Placeholder flow as requested
        Alert.alert('Notice', 'Password reset not available yet');
    };

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name="chevron-left" size={28} color={palette.text} />
                </Pressable>
            </View>
            <View style={styles.container}>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>
                    Enter your email address and we will send you instructions to reset your password.
                </Text>

                <TextInput
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                />

                <Pressable style={styles.submitBtn} onPress={handleReset}>
                    <Text style={styles.submitText}>Send Reset Link</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: palette.background },
    header: { padding: metrics.spacing },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    container: { padding: metrics.spacing },
    title: { ...typography.title, fontSize: 24, marginBottom: 8 },
    subtitle: { color: palette.muted, marginBottom: metrics.spacing * 2, lineHeight: 20 },
    input: {
        backgroundColor: palette.card,
        borderRadius: metrics.radius,
        padding: metrics.spacing,
        marginBottom: metrics.spacing * 1.5,
        fontSize: 16,
        borderWidth: 1,
        borderColor: palette.border,
        color: palette.text,
    },
    submitBtn: {
        backgroundColor: palette.primary,
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        ...metrics.shadow,
    },
    submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
