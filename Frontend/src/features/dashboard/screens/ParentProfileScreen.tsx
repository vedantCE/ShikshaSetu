import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../auth/context/AuthContext';
import {
  launchCamera,
  launchImageLibrary,
  type ImagePickerResponse,
} from 'react-native-image-picker';

const ParentProfileScreen = ({ navigation }: any) => {
  const { user, students } = useAuth();
  const [avatar, setAvatar] = useState<string | null>(null);

  const handlePickerResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) return;
    if (response.errorCode) {
      Alert.alert('Error', response.errorMessage || 'Failed to pick image');
      return;
    }
    const uri = response.assets?.[0]?.uri;
    if (uri) setAvatar(uri);
  };

  const pickAvatar = () => {
    Alert.alert('Select Photo', 'Choose a source', [
      {
        text: 'Camera',
        onPress: () =>
          launchCamera(
            { mediaType: 'photo', quality: 0.7, maxWidth: 400, maxHeight: 400 },
            handlePickerResponse,
          ),
      },
      {
        text: 'Gallery',
        onPress: () =>
          launchImageLibrary(
            { mediaType: 'photo', quality: 0.7, maxWidth: 400, maxHeight: 400 },
            handlePickerResponse,
          ),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="arrow-left" size={24} color="#1A1A2E" />
        </Pressable>
        <Text style={styles.headerTitle}>Parent Profile</Text>
       
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* LEFT: Avatar */}
          <View style={styles.profileLeft}>
            <Image
              source={require('../assets/Homescreen/student.png')}
              style={styles.profileAvatar}
            />

            {/* Edit icon */}
            <Pressable style={styles.editIcon}>
              <Icon name="pencil" size={14} color="#fff" />
            </Pressable>
          </View>

          {/* RIGHT: Info */}
          <View style={styles.profileRight}>
            <Text style={styles.profileName}>{user?.name || 'Parent'}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>PREMIUM MEMBER</Text>
            </View>
          </View>
        </View>

        {/* Linked Children */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Linked Children</Text>
          <Pressable style={styles.switchProfileRow}>
          </Pressable>
        </View>

        <Pressable
          style={styles.linkChildBtn}
          onPress={() => navigation.navigate('ParentAddChild')}
        >
          <Icon name="plus-circle" size={20} color="#1B337F" />
          <Text style={styles.linkChildText}>Link Another Child</Text>
        </Pressable>

        {/* Account Settings */}
        <Text style={styles.groupHeading}>ACCOUNT</Text>

        <View style={styles.listGroup}>
          <Pressable
            style={styles.listItem}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <View style={styles.listIconBg}>
              <Icon name="account" size={20} color="#1B337F" />
            </View>
            <Text style={styles.listItemText}>Edit Profile</Text>
            <Icon name="chevron-right" size={24} color="#9CA3AF" />
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            style={styles.listItem}
            onPress={() => navigation.navigate('Notifications')}
          >
            <View style={styles.listIconBg}>
              <Icon name="bell" size={20} color="#1B337F" />
            </View>
            <Text style={styles.listItemText}>Notifications</Text>
            <Icon name="chevron-right" size={24} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Child Controls */}
        <Text style={styles.groupHeading}>CHILD CONTROLS</Text>

        <View style={styles.listGroup}>
          <Pressable style={styles.listItem}>
            <View style={styles.listIconBg}>
              <Icon name="timer-outline" size={20} color="#1B337F" />
            </View>
            <Text style={styles.listItemText}>Screen Time Limits</Text>
            <Icon name="chevron-right" size={24} color="#9CA3AF" />
          </Pressable>
          <View style={styles.divider} />
          <View style={styles.listItem}>
            <View style={styles.listIconBg}>
              <Icon name="brain" size={20} color="#1B337F" />
            </View>
            <Text style={styles.listItemText}>Adaptive Learning Mode</Text>
            <View style={styles.toggleTrackOff}>
              <View style={styles.toggleThumbOff} />
            </View>
          </View>
        </View>

        {/* Data & Privacy */}
        <Text style={styles.groupHeading}>DATA & PRIVACY</Text>

        <View style={styles.listGroup}>
          <Pressable style={styles.listItem}>
            <View style={styles.listIconBgPurple}>
              <Icon name="download" size={20} color="#6366F1" />
            </View>
            <Text style={styles.listItemText}>Export Activity Data</Text>
            <Icon name="chevron-right" size={24} color="#9CA3AF" />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.listItem}>
            <View style={styles.listIconBgRed}>
              <Icon name="logout-variant" size={20} color="#EF4444" />
            </View>
            <Text style={styles.listItemTextRed}>Log Out</Text>
          </Pressable>
        </View>

        <Text style={styles.versionText}>App Version 2.4.1 (Build 204)</Text>
      </ScrollView>
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
    padding: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    textAlign:'center',
  },
 
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  profileLeft: {
    position: 'relative',
    marginRight: 16,
  },

  profileAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },

  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1B337F',
    borderRadius: 12,
    padding: 4,
  },

  profileRight: {
    flex: 1,
    justifyContent: 'center',
  },

  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  profileEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },

  badge: {
    marginTop: 8,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },

  badgeText: {
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '600',
  },

  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E8F4FD',
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1B337F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  parentName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  parentEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  premiumBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  switchProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B337F',
    marginLeft: 4,
  },
  childrenRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  childBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  miniChildAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  childName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  childLevel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  linkChildBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  linkChildText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1B337F',
    marginLeft: 8,
  },
  groupHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginLeft: 16,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  listGroup: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  listIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  listIconBgPurple: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  listIconBgRed: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  listItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A2E',
  },
  listItemTextRed: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#EF4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 68,
  },
  toggleTrackOff: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleThumbOff: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  noChildrenText: {
    color: '#6B7280',
    fontStyle: 'italic',
    padding: 12,
  },
});

export default ParentProfileScreen;
