import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

// Horizontal scaling (for widths, margins, etc.)
const scale = (size: number): number => (width / 360) * size;

// Vertical scaling (for heights, vertical paddings, etc.) ← NOW A FUNCTION!
const verticalScale = (size: number): number => (height / 680) * size;

// Moderate scaling (gentle for things that shouldn't grow too much)
const moderateScale = (size: number, factor = 0.5): number =>
  size + (scale(size) - size) * factor;  // Updated to use the new scale() function

// Font scaling (respects system font size settings too)
const fontScale = (size: number): number => PixelRatio.getFontScale() * scale(size);


interface AuthLayoutProps {
  title: string;
  subtitle: string;
  activeTab: 'login' | 'signup';
  onTabChange: (tab: 'login' | 'signup') => void;
  children: React.ReactNode;
  primaryButtonText: string;
  onPrimaryButtonPress: () => void;
  onBackPress: () => void;
  footer?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  activeTab,
  onTabChange,
  children,
  primaryButtonText,
  onPrimaryButtonPress,
  onBackPress,
  footer,
}) => {
  return (
    <View style={styles.container}>
      {/* <SafeAreaView style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </SafeAreaView> */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Icon name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>
      </SafeAreaView>

      <KeyboardAwareScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'login' && styles.activeTab]}
              onPress={() => onTabChange('login')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'login' && styles.activeTabText,
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'signup' && styles.activeTab]}
              onPress={() => onTabChange('signup')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'signup' && styles.activeTabText,
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {children}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onPrimaryButtonPress}
          >
            <Text style={styles.primaryButtonText}>{primaryButtonText}</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>
              Or {activeTab === 'login' ? 'login' : 'sign up'} with
            </Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="google" size={20} color="#EA4335" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="facebook" size={20} color="#1877F2" />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
          </View>

          {footer}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B337F',
  },
  // header: {
  //   paddingHorizontal: 24,
  //   paddingTop: 40,        // keeps safe space for notch/status bar
  //   paddingBottom: 30,     // reduced a bit for tighter feel
  // },
  header: {
    paddingHorizontal: moderateScale(24),     // ~24 on standard, scales up/down
    paddingTop: verticalScale(20),            // safe for notch + responsive
    paddingBottom: verticalScale(10),
  },
  // backButton: {
  //   width: 40,
  //   height: 40,
  //   borderRadius: 8,
  //   backgroundColor: 'rgba(255, 255, 255, 0.1)',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   // marginBottom: 20,
  // },
  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  // headerTextContainer: {
  //   flex: 1,               // takes remaining space
  //   marginLeft: 16,        // space between back button and title
  //   // removed marginTop – now aligned horizontally
  // },
  headerTextContainer: {
    flex: 1,
    marginLeft: moderateScale(16),
  },
  // title: {
  //   fontSize: 28,
  //   fontWeight: '700',
  //   color: '#FFF',
  //   lineHeight: 34,
  // },
  title: {
    fontSize: fontScale(28),                  // scales nicely on all devices
    fontWeight: '700',
    color: '#FFF',
    lineHeight: fontScale(34),
  },
  // subtitle: {
  //   fontSize: 14,
  //   color: 'rgba(255, 255, 255, 0.7)',
  //   marginTop: 4,
  //   lineHeight: 20,
  // },
  // contentContainer: {
  //   flex: 1,
  //   backgroundColor: '#FFF',
  //   borderTopLeftRadius: 30,
  //   borderTopRightRadius: 30,
  // },
  // scrollContent: {
  //   flexGrow: 1,
  //   paddingBottom: 30,
  // },
  // card: {
  //   paddingHorizontal: 24,
  //   paddingTop: 30,
  // },
  // tabContainer: {
  //   flexDirection: 'row',
  //   backgroundColor: '#F5F5F5',
  //   borderRadius: 12,
  //   padding: 4,
  //   marginBottom: 24,
  // },
  // tab: {
  //   flex: 1,
  //   paddingVertical: 12,
  //   alignItems: 'center',
  //   borderRadius: 10,
  // },
  subtitle: {
    fontSize: fontScale(14),
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: verticalScale(4),
    lineHeight: fontScale(20),
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: moderateScale(30),
    borderTopRightRadius: moderateScale(30),
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(30),
  },
  card: {
    paddingHorizontal: moderateScale(24),
    paddingTop: verticalScale(20),
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: moderateScale(12),
    padding: moderateScale(4),
    marginBottom: verticalScale(16),
  },
  tab: {
    flex: 1,
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    borderRadius: moderateScale(10),
  },
  // activeTab: {
  //   backgroundColor: '#FFF',
  //   elevation: 2,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 2,
  // },
  activeTab: {
  backgroundColor: '#FFF',
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: moderateScale(2),  // scales shadow for larger screens
},
  // tabText: {
  //   fontSize: 16,
  //   fontWeight: '600',
  //   color: '#808080',
  // },
  tabText: {
  fontSize: fontScale(16),
  fontWeight: '600',
  color: '#808080',
},
  activeTabText: {
    color: '#1B337F',
  },
  // primaryButton: {
  //   backgroundColor: '#1B337F',
  //   borderRadius: 12,
  //   height: 56,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginTop: 20,
  // },
  // primaryButtonText: {
  //   color: '#FFF',
  //   fontSize: 16,
  //   fontWeight: '700',
  // },
  primaryButton: {
    backgroundColor: '#1B337F',
    borderRadius: moderateScale(12),
    height: verticalScale(56),                // keeps touch-friendly height
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(12),
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: fontScale(16),
    fontWeight: '700',
  },
  // dividerContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginVertical: 24,
  // },
  // divider: {
  //   flex: 1,
  //   height: 1,
  //   backgroundColor: '#E0E0E0',
  // },
  // dividerText: {
  //   marginHorizontal: 16,
  //   color: '#808080',
  //   fontSize: 14,
  // },
  // socialContainer: {
  //   flexDirection: 'row',
  //   gap: 12,
  // },
  dividerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: verticalScale(16),  // was fixed 24 → now scales vertically
},

divider: {
  flex: 1,
  height: 1,
  backgroundColor: '#E0E0E0',
},

dividerText: {
  marginHorizontal: moderateScale(16),  // was fixed 16 → scales horizontally
  color: '#808080',
  fontSize: fontScale(14),             // scales font nicely
},

socialContainer: {
  flexDirection: 'row',
  gap: moderateScale(12),              // was fixed 12 → now responsive gap
},
  // socialButton: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   height: 56,
  //   borderRadius: 12,
  //   borderWidth: 1,
  //   borderColor: '#E0E0E0',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   gap: 8,
  // },
  // socialButtonText: {
  //   fontSize: 15,
  //   fontWeight: '600',
  //   color: '#1B337F',
  // },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    height: verticalScale(56),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  socialButtonText: {
    fontSize: fontScale(15),
    fontWeight: '600',
    color: '#1B337F',
  },
});
