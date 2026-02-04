import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { CustomInput } from '../components/CustomInput';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const TeacherLoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();

  const handleLogin = () => {
    if (email === 'teacher@example.com' && password === 'password') {
      login(email);
    } else {
      Alert.alert('Invalid Credentials', 'Use teacher@example.com / password');
    }
  };

  const handleTabChange = (tab: 'login' | 'signup') => {
    if (tab === 'signup') {
      navigation.replace('TeacherSignup');
    }
  };

  return (
    <AuthLayout
      title="Welcome Back Teacher"
      subtitle="Sign up to manage classrooms and student progress"
      activeTab="login"
      onTabChange={handleTabChange}
      primaryButtonText="Login"
      onPrimaryButtonPress={handleLogin}
      onBackPress={() => navigation.goBack()}
      footer={
        <View style={styles.footerRow}>
          <TouchableOpacity 
            style={styles.rememberMeContainer}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <Icon 
              name={rememberMe ? "checkbox-marked" : "checkbox-blank-outline"} 
              size={20} 
              color={rememberMe ? "#1B337F" : "#808080"} 
            />
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      }
    >
      <CustomInput
        label="Email"
        placeholder="wade@gmail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <CustomInput
        label="Password"
        placeholder="xxxxxxxx"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={secureText}
        rightIcon={secureText ? "eye-off-outline" : "eye-outline"}
        onRightIconPress={() => setSecureText(!secureText)}
      />
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rememberMeText: {
    fontSize: 14,
    color: '#808080',
    fontWeight: '500',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#1B337F',
    fontWeight: '700',
  },
});
