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
import { useAuth } from '../context/AuthContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export const TeacherLoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    if (email === 'teacher@example.com' && password === 'password') {
      login(email);
      // Navigation will be handled automatically by RootNavigator based on auth state
    } else {
      Alert.alert('Invalid Credentials', 'Use teacher@example.com / password');
    }
  };
const handleGoogleLogin = () => {
    // Dummy Google login for testing
    login('teacher.google@example.com', 'Teacher Google');
    // Navigation will be handled automatically by RootNavigator based on auth state
    Alert.alert('Success', 'Logged in with Google (dummy)');
  };

  const handleAppleLogin = () => {
    // Dummy Apple login for testing
    login('teacher.apple@example.com', 'Teacher Apple');
    // Navigation will be handled automatically by RootNavigator based on auth state
    Alert.alert('Success', 'Logged in with Apple (dummy)');
  };
  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: '#f6f6f8' }}
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingTop: 40,
        flexGrow: 1, // Allows content to grow and center if needed
      }}
      enableOnAndroid={true} // Important for Android
      extraHeight={110} // Gives a little extra space above keyboard
      keyboardShouldPersistTaps="handled"
    >
      {/* Top Bar
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={28} color="#120d1b" />
      </TouchableOpacity> */}

      {/* Logo */}
      <View style={styles.logoBox}>
        <Icon name="school-outline" size={40} color="#6c2bee" />
      </View>

      {/* Heading */}
      <Text style={styles.heading}>Welcome Back Teacher</Text>

 {/* Social Buttons */}
      <TouchableOpacity style={styles.socialButton}>
        <Icon name="google" size={22} color="#DB4437" />
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <Icon name="apple" size={22} color="#000" />
        <Text style={styles.socialText}>Continue with Apple</Text>
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
        />
        <Icon name="email-outline" size={20} color="#888" />
      </View>

      {/* Password */}
      <View style={styles.passwordHeader}>
        <Text style={styles.label}>Password</Text>
        <Text style={styles.forgot}>Forgot?</Text>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor={'gray'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <Icon name="lock-outline" size={20} color="#888" />
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
        <Text style={styles.primaryText}>Continue</Text>
        <Icon name="arrow-right" size={22} color="#FFF" />
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
       <TouchableOpacity onPress={() => navigation.navigate('TeacherSignup')}>
  <Text style={styles.signup}> Sign Up</Text>
</TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f8',
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
  },

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

  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    color: 'black',
  },

  forgot: {
    color: '#6c2bee',
    fontWeight: '600',
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