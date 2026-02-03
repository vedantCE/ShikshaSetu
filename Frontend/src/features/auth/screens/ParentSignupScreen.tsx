import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../auth/context/AuthContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export const ParentSignupScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login } = useAuth();

  const handleManualSignup = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    login(email, 'New Parent');
    // Navigation will be handled automatically by RootNavigator based on auth state
    Alert.alert('Success 🎉', 'Parent account created!');
  };

  const handleGoogleSignup = () => {
    login('parent.google@example.com', 'Parent Google');
    // Navigation will be handled automatically by RootNavigator based on auth state
    Alert.alert('Success 🎉', 'Signed up with Google (dummy)');
  };

  const handleAppleSignup = () => {
    login('parent.apple@example.com', 'Parent Apple');
    // Navigation will be handled automatically by RootNavigator based on auth state
    Alert.alert('Success 🎉', 'Signed up with Apple (dummy)');
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: '#f6f6f8' }}
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingTop: 40,
        flexGrow: 1,
      }}
      enableOnAndroid={true}
      extraHeight={110}
      keyboardShouldPersistTaps="handled"
    >
      {/* Logo - Using home icon for parent feel */}
      <View style={styles.logoBox}>
        <Icon name="home-outline" size={40} color="#6c2bee" />
      </View>

      {/* Heading */}
      <Text style={styles.heading}>Create Parent Account</Text>

      {/* Social Buttons */}
      <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignup}>
        <Icon name="google" size={22} color="#DB4437" />
        <Text style={styles.socialText}>Sign up with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} onPress={handleAppleSignup}>
        <Icon name="apple" size={22} color="#000" />
        <Text style={styles.socialText}>Sign up with Apple</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.line} />
      </View>

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor={'gray'}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Icon name="email-outline" size={20} color="#888" />
      </View>

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Create a password"
          placeholderTextColor={'gray'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <Icon name="lock-outline" size={20} color="#888" />
      </View>

      {/* Confirm Password */}
      <Text style={styles.label}>Confirm Password</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Confirm your password"
          placeholderTextColor={'gray'}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
        <Icon name="lock-outline" size={20} color="#888" />
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.primaryButton} onPress={handleManualSignup}>
        <Text style={styles.primaryText}>Sign Up</Text>
        <Icon name="arrow-right" size={22} color="#FFF" />
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ParentLogin')}>
          <Text style={styles.signup}> Log In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

// Same styles as TeacherSignupScreen
const styles = StyleSheet.create({
  logoBox: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    elevation: 3,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    color: '#120d1b',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 12,
    gap: 10,
  },
  socialText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#120d1b',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 12,
    color: '#888',
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: '#120d1b',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#120d1b',
  },
  primaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6c2bee',
    height: 56,
    borderRadius: 28,
    gap: 10,
    marginTop: 10,
    elevation: 4,
  },
  primaryText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#666',
    fontSize: 16,
  },
  signup: {
    color: '#6c2bee',
    fontSize: 16,
    fontWeight: '700',
  },
});