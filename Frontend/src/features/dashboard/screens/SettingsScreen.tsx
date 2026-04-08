import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../auth/context/AuthContext';

const SettingsScreen = ({ navigation }: any) => {
    const { logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: () => {
                        logout();
                    }
                },
            ]
        );
    };

    const handleNotImplemented = (feature: string) => {
        Alert.alert('Coming Soon', `${feature} will be available in the next update.`);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Account Group */}
                <Text style={styles.groupHeading}>ACCOUNT</Text>
                <View style={styles.listGroup}>
                    
                    <View style={styles.divider} />
                    <Pressable style={styles.listItem} onPress={() => navigation.navigate('ChangePassword')}>
                        <View style={styles.listIconBg}>
                            <Icon name="lock-reset" size={20} color="#1B337F" />
                        </View>
                        <Text style={styles.listItemText}>Change Password</Text>
                        <Icon name="chevron-right" size={24} color="#9CA3AF" />
                    </Pressable>
                </View>

                {/* Preferences Group */}
                <Text style={styles.groupHeading}>PREFERENCES</Text>
                <View style={styles.listGroup}>
                    <Pressable style={styles.listItem} onPress={() => handleNotImplemented('App Theme')}>
                        <View style={styles.listIconBg}>
                            <Icon name="theme-light-dark" size={20} color="#1B337F" />
                        </View>
                        <Text style={styles.listItemText}>App Theme</Text>
                        <View style={styles.valueRow}>
                            <Text style={styles.valueText}>System</Text>
                            <Icon name="chevron-right" size={24} color="#9CA3AF" />
                        </View>
                    </Pressable>
                    <View style={styles.divider} />
                    <Pressable style={styles.listItem} onPress={() => handleNotImplemented('Language')}>
                        <View style={styles.listIconBg}>
                            <Icon name="translate" size={20} color="#1B337F" />
                        </View>
                        <Text style={styles.listItemText}>Language</Text>
                        <View style={styles.valueRow}>
                            <Text style={styles.valueText}>English</Text>
                            <Icon name="chevron-right" size={24} color="#9CA3AF" />
                        </View>
                    </Pressable>
                </View>

                {/* Support Group */}
                <Text style={styles.groupHeading}>SUPPORT</Text>
                <View style={styles.listGroup}>
                    <Pressable style={styles.listItem} onPress={() => navigation.navigate('HelpCenter')}>
                        <View style={styles.listIconBg}>
                            <Icon name="help-circle-outline" size={20} color="#1B337F" />
                        </View>
                        <Text style={styles.listItemText}>Help Center</Text>
                        <Icon name="chevron-right" size={24} color="#9CA3AF" />
                    </Pressable>
                    <View style={styles.divider} />
                    <Pressable style={styles.listItem} onPress={() => navigation.navigate('AboutUs')}>
                        <View style={styles.listIconBg}>
                            <Icon name="information-outline" size={20} color="#1B337F" />
                        </View>
                        <Text style={styles.listItemText}>About Us</Text>
                        <Icon name="chevron-right" size={24} color="#9CA3AF" />
                    </Pressable>
                </View>

                {/* Logout */}
                <Pressable style={styles.logoutBtn} onPress={handleLogout}>
                    <Icon name="logout" size={20} color="#FFFFFF" />
                    <Text style={styles.logoutBtnText}>Log Out</Text>
                </Pressable>

                <Text style={styles.versionText}>App Version 2.4.1 (Build 204)</Text>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1A1A2E',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    groupHeading: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
        marginLeft: 20,
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    listGroup: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    listIconBg: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    listItemText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#1A1A2E',
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    valueText: {
        fontSize: 14,
        color: '#6B7280',
        marginRight: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 68,
    },
    logoutBtn: {
        flexDirection: 'row',
        backgroundColor: '#EF4444',
        marginHorizontal: 16,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 24,
    },
    logoutBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        marginLeft: 8,
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 20,
    },
});

export default SettingsScreen;
