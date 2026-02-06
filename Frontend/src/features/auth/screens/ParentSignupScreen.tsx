// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Alert,
//   TouchableOpacity,
//   Switch,
// } from 'react-native';
// import { useAuth } from '../../auth/context/AuthContext';
// import { AuthLayout } from '../components/AuthLayout';
// import { CustomInput } from '../components/CustomInput';

// export const ParentSignupScreen = ({ navigation }: any) => {
//   const [email, setEmail] = useState('');
//   const [address, setAddress] = useState('');
//   const [contactNumber, setContactNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [secureText, setSecureText] = useState(true);
//   const [secureTextConfirm, setSecureTextConfirm] = useState(true);
//   const { login } = useAuth();

//   const handleManualSignup = () => {
//     if (!email || !password || !confirmPassword || !address || !contactNumber) {
//       Alert.alert('Error', 'Please fill all fields');
//       return;
//     }
//     if (password !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match');
//       return;
//     }
//     login(email, 'New Parent');
//     Alert.alert('Success 🎉', 'Parent account created!');
//   };

//   const handleTabChange = (tab: 'login' | 'signup') => {
//     if (tab === 'login') {
//       navigation.replace('ParentLogin');
//     }
//   };

//   return (
//     <AuthLayout
//       title="Create your Parent Account"
//       subtitle="Sign up to support your child’s learning at home"
//       activeTab="signup"
//       onTabChange={handleTabChange}
//       primaryButtonText="Register"
//       onPrimaryButtonPress={handleManualSignup}
//       onBackPress={() => navigation.goBack()}
//     >
//       <CustomInput
//         label="Email"
//         placeholder="wade@gmail.com"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <CustomInput
//         label="Address"
//         placeholder="Enter your address"
//         value={address}
//         onChangeText={setAddress}
//       />
//       <CustomInput
//         label="Contact Number"
//         placeholder="Enter contact number"
//         value={contactNumber}
//         onChangeText={setContactNumber}
//         keyboardType="phone-pad"
//       />
//       <CustomInput
//         label="Password"
//         placeholder="xxxxxxxx"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry={secureText}
//         rightIcon={secureText ? "eye-off-outline" : "eye-outline"}
//         onRightIconPress={() => setSecureText(!secureText)}
//       />
//       <CustomInput
//         label="Confirm Password"
//         placeholder="xxxxxxxx"
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//         secureTextEntry={secureTextConfirm}
//         rightIcon={secureTextConfirm ? "eye-off-outline" : "eye-outline"}
//         onRightIconPress={() => setSecureTextConfirm(!secureTextConfirm)}
//       />
//     </AuthLayout>
//   );
// };

// const styles = StyleSheet.create({});
