import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CustomInputProps extends TextInputProps {
  label: string;
  icon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  error?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  icon,
  rightIcon,
  onRightIconPress,
  style,
  error,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#A0A0A0"
          {...props}
        />
        {rightIcon && (
          <Icon
            name={rightIcon}
            size={20}
            color="#808080"
            onPress={onRightIconPress}
            style={styles.rightIcon}
          />
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#808080',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  rightIcon: {
    marginLeft: 10,
  },
  inputError: {
    borderColor: '#E03131',
  },
  errorText: {
    color: '#E03131',
    fontSize: 12,
    marginTop: 6,
  },
});
