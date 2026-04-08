import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  launchImageLibrary,
  type ImagePickerResponse,
} from 'react-native-image-picker';
import { useAuth } from '../../../auth/context/AuthContext';
import {
  fetchProfile,
  fetchProfileSchema,
  patchParentProfile,
  type ProfileSchemaField,
} from '../../../auth/services/profileApi';
import LoaderScreen from '../../../../components/LoaderScreen';

const SYSTEM_KEYS = new Set(['user_id', 'user_role', 'created_at', 'updated_at', 'user_password']);

const EditProfileScreen = ({ navigation }: any) => {
  const { user, updateUser } = useAuth();
  const [schema, setSchema] = useState<ProfileSchemaField[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [initialData, setInitialData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const editableFields = useMemo(
    () => schema.filter((field) => field.editable && !SYSTEM_KEYS.has(field.key)),
    [schema],
  );

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }

      try {
        const [schemaRes, profileRes] = await Promise.all([
          fetchProfileSchema(user.token),
          fetchProfile(user.token),
        ]);

        setSchema(schemaRes.fields || []);

        const mergedProfile = {
          ...profileRes.user,
          name: profileRes.user?.user_name ?? profileRes.user?.name,
          email: profileRes.user?.user_email ?? profileRes.user?.email,
        };

        setFormData(mergedProfile);
        setInitialData(mergedProfile);
      } catch (error: any) {
        Alert.alert('Error', error?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user?.token]);

  const onImagePick = (fieldKey: string) => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.7, maxWidth: 600, maxHeight: 600 },
      (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorCode) {
          return;
        }

        const uri = response.assets?.[0]?.uri;
        if (uri) {
          setFormData((prev) => ({ ...prev, [fieldKey]: uri }));
        }
      },
    );
  };

  const validate = () => {
    for (const field of editableFields) {
      const value = formData[field.key];
      const trimmed = typeof value === 'string' ? value.trim() : value;

      if (field.required && (trimmed === '' || trimmed === null || trimmed === undefined)) {
        return `${field.label} is required`;
      }

      if (field.type === 'email' && trimmed) {
        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(trimmed));
        if (!validEmail) {
          return `Please enter a valid ${field.label.toLowerCase()}`;
        }
      }
    }

    return null;
  };

  const buildChangedFields = () => {
    const changed: Record<string, any> = {};

    editableFields.forEach((field) => {
      const current = formData[field.key];
      const initial = initialData[field.key];
      const normalizedCurrent = typeof current === 'string' ? current.trim() : current;
      const normalizedInitial = typeof initial === 'string' ? initial.trim() : initial;

      if (normalizedCurrent !== normalizedInitial) {
        changed[field.key] = normalizedCurrent;
      }
    });

    return changed;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    const changedFields = buildChangedFields();
    if (Object.keys(changedFields).length === 0) {
      Alert.alert('No changes', 'Nothing to update.');
      return;
    }

    if (!user?.token) {
      Alert.alert('Error', 'Missing user session. Please login again.');
      return;
    }

    try {
      setSaving(true);
      const response = await patchParentProfile(user.token, changedFields);
      const updatedUser = response.user || {};

      await updateUser({
        ...updatedUser,
        name: updatedUser.user_name ?? updatedUser.name,
        email: updatedUser.user_email ?? updatedUser.email,
      });

      setInitialData((prev) => ({ ...prev, ...changedFields }));
      setFormData((prev) => ({ ...prev, ...changedFields }));

      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Update Failed', error?.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field: ProfileSchemaField) => {
    const value = formData[field.key];

    if (field.type === 'image') {
      return (
        <View key={field.key} style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>{field.label}</Text>
          <View style={styles.imageRow}>
            {value ? (
              <Image source={{ uri: String(value) }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="account" size={24} color="#9CA3AF" />
              </View>
            )}
            <Pressable style={styles.imageButton} onPress={() => onImagePick(field.key)}>
              <Icon name="image-plus" size={18} color="#1B337F" />
              <Text style={styles.imageButtonText}>Choose Image</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View key={field.key} style={styles.fieldCard}>
        <Text style={styles.fieldLabel}>{field.label}</Text>
        <TextInput
          value={value === undefined || value === null ? '' : String(value)}
          onChangeText={(text) => setFormData((prev) => ({ ...prev, [field.key]: text }))}
          style={styles.input}
          keyboardType={field.type === 'number' ? 'numeric' : field.type === 'email' ? 'email-address' : 'default'}
          autoCapitalize={field.type === 'email' ? 'none' : 'sentences'}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          placeholderTextColor="#9CA3AF"
        />
      </View>
    );
  };

  if (loading) {
    return <LoaderScreen text="Loading profile editor..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="arrow-left" size={24} color="#1A1A2E" />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {editableFields.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No editable fields found</Text>
            <Text style={styles.emptySubtext}>Profile schema returned no editable fields.</Text>
          </View>
        ) : (
          editableFields.map(renderField)
        )}

        <Pressable
          style={[styles.saveBtn, (saving || editableFields.length === 0) && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving || editableFields.length === 0}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
        </Pressable>
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
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  fieldCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  fieldLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 46,
    paddingHorizontal: 12,
    color: '#111827',
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E5E7EB',
  },
  avatarPlaceholder: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageButton: {
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageButtonText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#1B337F',
  },
  saveBtn: {
    backgroundColor: '#1B337F',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginTop: 8,
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  emptySubtext: {
    marginTop: 6,
    color: '#6B7280',
    fontSize: 13,
  },
});

export default EditProfileScreen;
