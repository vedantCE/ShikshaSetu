// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { useAuth } from '../context/AuthContext';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { useLayoutEffect } from 'react';

// export const ParentLoginScreen = ({ navigation }: any) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { setUser } = useAuth();

//   const handleLogin = () => {
//     if (email === 'parent@example.com' && password === 'parent123') {
//       setUser({ role: 'parent', email });
//       navigation.replace('Dashboard');
//     } else {
//       Alert.alert('Invalid Credentials', 'Use parent@example.com / parent123');
//     }
//   };

//   return (
//     <KeyboardAwareScrollView
//       style={{ flex: 1, backgroundColor: '#f6f6f8' }}
//       contentContainerStyle={{
//         paddingHorizontal: 24,
//         paddingTop: 40,
//         flexGrow: 1, // Allows content to grow and center if needed
//       }}
//       enableOnAndroid={true} // Important for Android
//       extraHeight={110} // Gives a little extra space above keyboard
//       keyboardShouldPersistTaps="handled"
//     >
//       {/* Top Bar
//       <TouchableOpacity
//         style={styles.backButton}
//         onPress={() => navigation.goBack()}
//       >
//         <Icon name="arrow-left" size={28} color="#120d1b" />
//       </TouchableOpacity> */}

//       {/* Logo */}
//       <View style={styles.logoBox}>
//         <Icon name="home-outline" size={40} color="#1B337F" />
//       </View>

//       {/* Heading */}
//       <Text style={styles.heading}>Welcome Back Parent</Text>

//       {/* Social Buttons */}
//       <View style={styles.socialRow}>
//         <TouchableOpacity style={styles.socialButton}>
//           <Icon name="google" size={22} color="#DB4437" />
//           <Text style={styles.socialText}>Google</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.socialButton}>
//           <Icon name="apple" size={22} color="#000" />
//           <Text style={styles.socialText}>Apple</Text>
//         </TouchableOpacity>
//       </View>
//       {/* Divider
//       <View style={styles.divider}>
//         <View style={styles.line} />
//         <Text style={styles.orText}>or</Text>
//         <View style={styles.line} />
//       </View> */}
//       {/* Email */}
//       <Text style={styles.label}>Email</Text>
//       <View style={styles.inputWrapper}>
//         <TextInput
//           placeholder="Enter your email"
//           placeholderTextColor={'gray'}
//           value={email}
//           onChangeText={setEmail}
//           style={styles.input}
//           keyboardType="email-address"
//         />
//         <Icon name="email-outline" size={20} color="#888" />
//       </View>

//       {/* Password */}
//       <View style={styles.passwordHeader}>
//         <Text style={styles.label}>Password</Text>
//         <Text style={styles.forgot}>Forgot?</Text>
//       </View>

//       <View style={styles.inputWrapper}>
//         <TextInput
//           placeholder="Enter your password"
//           placeholderTextColor={'gray'}
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//           style={styles.input}
//         />
//         <Icon name="lock-outline" size={20} color="#888" />
//       </View>

//       {/* Continue Button */}
//       <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
//         <Text style={styles.primaryText}>Continue</Text>
//         <Icon name="arrow-right" size={22} color="#FFF" />
//       </TouchableOpacity>

//       {/* Footer */}
//       <View style={styles.footer}>
//         <Text style={styles.footerText}>Don't have an account?</Text>
//         <TouchableOpacity onPress={() => navigation.navigate('ParentSignup')}>
//           <Text style={styles.signup}> Sign Up</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAwareScrollView>
//   );
// };

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { CustomInput } from '../components/CustomInput';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const ParentLoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();

  const handleLogin = () => {
    if (email === 'parent@example.com' && password === 'parent123') {
      login(email);
    } else {
      Alert.alert('Invalid Credentials', 'Use parent@example.com / parent123');
    }
  };

  const handleTabChange = (tab: 'login' | 'signup') => {
    if (tab === 'signup') {
      navigation.replace('ParentSignup');
    }
  };

  return (
    <AuthLayout
      title="Welcome Back Parent"
      subtitle="Sign up to support your child’s learning at home"
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

