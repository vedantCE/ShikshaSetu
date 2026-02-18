import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../auth/context/AuthContext'; // adjust path if needed
import { AuthLayout } from '../components/AuthLayout';
import { CustomInput } from '../components/CustomInput';
import { PencilLoader } from '../components/PencilLoader';
import { loginUser, registerUser } from '../services/authApi';
import { fetchChildren } from '../services/studentApi';
export const ParentAuthScreen = ({ navigation }: any) => {
  const { login, setStudents } = useAuth();

  // Form state
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [secureTextConfirm, setSecureTextConfirm] = useState(true);
// Loading state (required to show/hide the PencilLoader)
  const [loading, setLoading] = useState(false);


  const handleSubmit = async () => {
    if (isSignup) {
      // === Signup validation ===
      if (!email || !password || !confirmPassword || !address || !contactNumber) {
        Alert.alert('Error', 'Please fill all fields');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
    } else {
      // === Login validation ===
      if (!email || !password) {
        Alert.alert('Error', 'Please enter email and password');
        return;
      }
    }

    setLoading(true);
    try {
      if (isSignup) {
        const fallbackName = email.split('@')[0] || 'Parent';
        const response = await registerUser({
          user_name: fallbackName,
          user_email: email,
          user_password: password,
          confirm_password: confirmPassword,
          contact_number: contactNumber,
          address,
          user_role: 'parent',
        });

        login({
          user_id: response.user_id,
          role: response.user_role,
          email,
          token: response.token,
          name: response.user_name,
        });
        setStudents([]);
        Alert.alert('Success', 'Parent account created!');
        navigation.replace('ParentDashboardScreen');
      } else {
        const response = await loginUser({
          user_email: email,
          user_password: password,
        });

        login({
          user_id: response.user_id,
          role: response.user_role,
          email,
          token: response.token,
          name: response.user_name,
        });
        const children = await fetchChildren(response.token);
        setStudents(
          children.map((child) => ({
            id: String(child.student_id),
            name: child.student_name,
            age: child.age,
            disorder: child.disorder_type,
          }))
        );
        navigation.replace('ParentDashboardScreen');
      }
    } catch (error: any) {
      Alert.alert('Auth Error', error?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: 'login' | 'signup') => {
    setIsSignup(tab === 'signup');
    // Clear form when switching (optional, improves UX)
    setPassword('');
    setConfirmPassword('');
    setAddress('');
    setContactNumber('');
  };

  return (
    <AuthLayout
      title={isSignup ? "Create your Parent Account" : "Welcome Back Parent"}
      subtitle="Sign up to support your child’s learning at home"
      activeTab={isSignup ? 'signup' : 'login'}
      onTabChange={handleTabChange}
      primaryButtonText={isSignup ? "Register" : "Login"}
      onPrimaryButtonPress={handleSubmit}
      onBackPress={() => navigation.goBack()}
    // You can keep your footer (Remember Me / Forgot Password) here if needed
    >
    
      {/* Common fields */}
      <CustomInput
        label="Email"
        placeholder="abcd@gmail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Signup-only fields */}
      {isSignup && (
        <>
          <CustomInput
            label="Address"
            placeholder="Enter your address"
            value={address}
            onChangeText={setAddress}
          />
          <CustomInput
            label="Contact Number"
            placeholder="Enter contact number"
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
          />
        </>
      )}

      {/* Password fields */}
      <CustomInput
        label="Password"
        placeholder="xxxxxxxx"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={secureText}
        rightIcon={secureText ? "eye-off-outline" : "eye-outline"}
        onRightIconPress={() => setSecureText(!secureText)}
      />

      {/* Confirm password – only on signup */}
      {isSignup && (
        <CustomInput
          label="Confirm Password"
          placeholder="xxxxxxxx"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={secureTextConfirm}
          rightIcon={secureTextConfirm ? "eye-off-outline" : "eye-outline"}
          onRightIconPress={() => setSecureTextConfirm(!secureTextConfirm)}
        />
      )}

      {/* Loading indicator overlay on button */}
      {loading && <PencilLoader />}
    </AuthLayout>
  );
};
