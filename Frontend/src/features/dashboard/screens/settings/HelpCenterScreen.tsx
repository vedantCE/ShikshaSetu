import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../../auth/context/AuthContext';
import { sendHelpRequest } from '../../services/supportApi';

const HelpCenterScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const senderName = useMemo(() => user?.name || user?.user_name || 'Parent', [user]);
  const senderEmail = useMemo(() => user?.email || user?.user_email || '', [user]);

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Validation Error', 'Message cannot be empty');
      return;
    }

    if (!user?.token) {
      Alert.alert('Session Error', 'Please login again to continue.');
      return;
    }

    try {
      setSending(true);
      await sendHelpRequest(user.token, {
        name: senderName,
        email: senderEmail,
        message: message.trim(),
      });
      setMessage('');
      Alert.alert('Success', 'Message sent successfully');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="arrow-left" size={24} color="#1A1A2E" />
        </Pressable>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={styles.headerBtn} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.readonlyInput} value={senderName} editable={false} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.readonlyInput} value={senderEmail} editable={false} />

        <Text style={styles.label}>Message</Text>
        <TextInput
          style={styles.messageInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Tell us how we can help..."
          placeholderTextColor="#9CA3AF"
          multiline
          textAlignVertical="top"
        />

        <Pressable style={[styles.submitBtn, sending && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={sending}>
          <Text style={styles.submitBtnText}>{sending ? 'Sending...' : 'Send'}</Text>
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
  readonlyInput: {
    backgroundColor: '#EEF2F7',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 12,
    color: '#4B5563',
    marginBottom: 14,
  },
  messageInput: {
    minHeight: 140,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 12,
    color: '#111827',
  },
  submitBtn: {
    marginTop: 16,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1B337F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default HelpCenterScreen;
