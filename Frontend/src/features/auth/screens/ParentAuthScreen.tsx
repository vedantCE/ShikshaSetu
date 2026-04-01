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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [secureText, setSecureText] = useState(true);
  const [secureTextConfirm, setSecureTextConfirm] = useState(true);
// Loading state (required to show/hide the PencilLoader)
  const [loading, setLoading] = useState(false);


  const handleSubmit = async () => {
    if (!validateForm()) return;

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

        await login({
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

        await login({
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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    const vErrors: Record<string, string> = {};

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      vErrors.email = 'Email is required';
    } else if (!emailRegex.test(trimmedEmail)) {
      vErrors.email = 'Enter a valid email address';
    }

    if (!isSignup) {
      if (!password) vErrors.password = 'Password is required';
      else if (password.length < 6) vErrors.password = 'Password must be at least 6 characters';
    } else {
      // Signup validations
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

    // Update trimmed email state so API uses trimmed email
    if (trimmedEmail !== email) setEmail(trimmedEmail);

    setErrors(vErrors);
    return Object.keys(vErrors).length === 0;
  };

  const handleTabChange = (tab: 'login' | 'signup') => {
    setIsSignup(tab === 'signup');
    // Clear form when switching (optional, improves UX)
    setPassword('');
    setConfirmPassword('');
    setAddress('');
    setContactNumber('');
    setErrors({});
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
        onChangeText={(text) => {
          const cleaned = text.replace(/\s/g, '');
          setEmail(cleaned);
          setErrors((p) => { const c = { ...p }; delete c.email; return c; });
        }}
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

      {/* Loading indicator overlay on button */}
      {loading && <PencilLoader />}
    </AuthLayout>
  );
};
