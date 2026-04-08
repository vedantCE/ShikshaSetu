import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../../auth/context/AuthContext';
import { changePassword } from '../../../auth/services/authApi';

const ChangePasswordScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [saving, setSaving] = useState(false);

  const validate = () => {
    if (!newPassword.trim()) {
      return 'New password is required';
    }

    if (newPassword.length < 6) {
      return 'Password must be at least 6 characters';
    }

    if (newPassword !== confirmPassword) {
      return 'Confirm password must match';
    }

    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    if (!user?.token || !user?.user_id) {
      Alert.alert('Session Error', 'Please login again.');
      return;
    }

    try {
      setSaving(true);
      await changePassword(user.token, {
        userId: Number(user.user_id),
        newPassword,
      });
      Alert.alert('Success', 'Password updated successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Update Failed', error?.message || 'Could not update password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="arrow-left" size={24} color="#1A1A2E" />
        </Pressable>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={styles.headerBtn} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={secureNew}
            placeholder="Enter new password"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
          />
          <Pressable onPress={() => setSecureNew((prev) => !prev)} style={styles.eyeBtn}>
            <Icon name={secureNew ? 'eye-off-outline' : 'eye-outline'} size={20} color="#6B7280" />
          </Pressable>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={secureConfirm}
            placeholder="Re-enter password"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
          />
          <Pressable onPress={() => setSecureConfirm((prev) => !prev)} style={styles.eyeBtn}>
            <Icon name={secureConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color="#6B7280" />
          </Pressable>
        </View>

        <Pressable style={[styles.saveBtn, saving && styles.saveBtnDisabled]} onPress={handleSave} disabled={saving}>
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Password'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBtn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '600',
  },
  inputRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#1A1A2E',
    paddingHorizontal: 12,
  },
  eyeBtn: {
    width: 44,
    alignItems: 'center',
  },
  saveBtn: {
    marginTop: 8,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1B337F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default ChangePasswordScreen;
