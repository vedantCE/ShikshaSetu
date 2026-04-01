import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { useAuth } from '../../auth/context/AuthContext'; // adjust path
import { AuthLayout } from '../components/AuthLayout';
import { CustomInput } from '../components/CustomInput';
import { PencilLoader } from '../components/PencilLoader'; // your loader
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { loginUser, registerUser } from '../services/authApi';

export const TeacherAuthScreen = ({ navigation }: any) => {
  const { login } = useAuth();

  // Form state (shared)
  const [isSignup, setIsSignup] = useState(false); // false = login, true = signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [secureText, setSecureText] = useState(true);
  const [secureTextConfirm, setSecureTextConfirm] = useState(true);
  const [rememberMe, setRememberMe] = useState(false); // only used in login

  // Loading state (for smooth UX with your pencil loader)
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isSignup) {
        const fallbackName = email.split('@')[0] || 'Teacher';
        const response = await registerUser({
          user_name: fallbackName,
          user_email: email,
          user_password: password,
          confirm_password: confirmPassword,
          contact_number: contactNumber,
          address,
          user_role: 'teacher',
        });

        await login({
          user_id: response.user_id,
          role: response.user_role,
          email,
          token: response.token,
          name: response.user_name,
        });
        Alert.alert('Success', 'Teacher account created!');
        navigation.replace('TeacherDashboard');
      } else {
        const response = await loginUser({
          user_email: email,
          user_password: password,
        });

        await login({
          user_id: response.user_id,
          role: response.user_role,
          email,
          token: response.token,
          name: response.user_name,
        });
        navigation.replace('TeacherDashboard');
      }
    } catch (error: any) {
      Alert.alert('Auth Error', error?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    const vErrors: Record<string, string> = {};

    const trimmedEmail = email.trim();
    if (!trimmedEmail) vErrors.email = 'Email is required';
    else if (!emailRegex.test(trimmedEmail)) vErrors.email = 'Enter a valid email address';

    if (!isSignup) {
      if (!password) vErrors.password = 'Password is required';
      else if (password.length < 6) vErrors.password = 'Password must be at least 6 characters';
    } else {
      if (!address || address.trim().length < 5) vErrors.address = 'Address must be at least 5 characters';

      const digitsOnly = contactNumber.replace(/\D/g, '');
      if (!contactNumber) vErrors.contactNumber = 'Contact number is required';
      else if (!/^[0-9]+$/.test(digitsOnly)) vErrors.contactNumber = 'Contact number must contain digits only';
      else if (digitsOnly.length < 10 || digitsOnly.length > 15) vErrors.contactNumber = 'Contact must be 10-15 digits';

      if (!password) vErrors.password = 'Password is required';
      else if (password.length < 6) vErrors.password = 'Password must be at least 6 characters';

      if (!confirmPassword) vErrors.confirmPassword = 'Confirm password is required';
      else if (confirmPassword !== password) vErrors.confirmPassword = 'Passwords do not match';
    }

    if (trimmedEmail !== email) setEmail(trimmedEmail);

    setErrors(vErrors);
    return Object.keys(vErrors).length === 0;
  };

  const handleTabChange = (tab: 'login' | 'signup') => {
    setIsSignup(tab === 'signup');
    // Clear signup-only fields when switching (improves UX)
    setAddress('');
    setContactNumber('');
    setConfirmPassword('');
    setPassword('');
    setErrors({});
  };

  // Conditional footer (only show on login)
  const footer = !isSignup ? (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
        onPress={() => setRememberMe(!rememberMe)}
      >
        <Icon
          name={rememberMe ? "checkbox-marked" : "checkbox-blank-outline"}
          size={20}
          color={rememberMe ? "#1B337F" : "#808080"}
        />
        <Text style={{ fontSize: 14, color: '#808080', fontWeight: '500' }}>Remember Me</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={{ fontSize: 14, color: '#1B337F', fontWeight: '700' }}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  ) : null;

  return (
    <AuthLayout
      title={isSignup ? "Create your Teacher Account" : "Welcome Back Teacher"}
      subtitle="Sign up to manage classrooms and student progress" // you can make this dynamic if needed
      activeTab={isSignup ? 'signup' : 'login'}
      onTabChange={handleTabChange}
      primaryButtonText={isSignup ? "Register" : "Login"}
      onPrimaryButtonPress={handleSubmit}
      onBackPress={() => navigation.goBack()}
      footer={footer} // conditional footer
    >
      {/* Common fields */}
      <CustomInput
        label="Email"
        placeholder="teacher@example.com"
        value={email}
        onChangeText={(text) => { const cleaned = text.replace(/\s/g, ''); setEmail(cleaned); setErrors((p) => { const c = { ...p }; delete c.email; return c; }); }}
        onBlur={() => validateForm()}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />

      {/* Signup-only fields */}
      {isSignup && (
        <>
          <CustomInput
            label="Address"
            placeholder="Enter your address"
            value={address}
            onChangeText={(t) => { setAddress(t); setErrors((p) => { const c = { ...p }; delete c.address; return c; }); }}
            onBlur={() => validateForm()}
            error={errors.address}
          />
          <CustomInput
            label="Contact Number"
            placeholder="Enter contact number"
            value={contactNumber}
            onChangeText={(t) => { const digits = t.replace(/\D/g, ''); setContactNumber(digits); setErrors((p) => { const c = { ...p }; delete c.contactNumber; return c; }); }}
            onBlur={() => validateForm()}
            keyboardType="phone-pad"
            error={errors.contactNumber}
          />
        </>
      )}

      {/* Password fields */}
      <CustomInput
        label="Password"
        placeholder="xxxxxxxx"
        value={password}
        onChangeText={(t) => { setPassword(t); setErrors((p) => { const c = { ...p }; delete c.password; return c; }); }}
        onBlur={() => validateForm()}
        secureTextEntry={secureText}
        rightIcon={secureText ? "eye-off-outline" : "eye-outline"}
        onRightIconPress={() => setSecureText(!secureText)}
        error={errors.password}
      />

      {/* Confirm password – only on signup */}
      {isSignup && (
        <CustomInput
          label="Confirm Password"
          placeholder="xxxxxxxx"
          value={confirmPassword}
          onChangeText={(t) => { setConfirmPassword(t); setErrors((p) => { const c = { ...p }; delete c.confirmPassword; return c; }); }}
          onBlur={() => validateForm()}
          secureTextEntry={secureTextConfirm}
          rightIcon={secureTextConfirm ? "eye-off-outline" : "eye-outline"}
          onRightIconPress={() => setSecureTextConfirm(!secureTextConfirm)}
          error={errors.confirmPassword}
        />
      )}

      {/* Your beautiful pencil loader */}
      {loading && <PencilLoader />}
    </AuthLayout>
  );
};
