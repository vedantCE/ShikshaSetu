import React, { memo } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SIZES, SPACING } from '../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = memo(({ value, onChangeText, onFilterPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Icon name="search" size={24} color={COLORS.textDark} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="search"
          placeholderTextColor={COLORS.textDark}
          value={value}
          onChangeText={onChangeText}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')}>
            <Icon name="close" size={20} color={COLORS.textDark} />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <Icon name="tune" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.m,
    marginVertical: SPACING.s,
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightPurple,
    borderRadius: 30,
    height: 48,
    paddingHorizontal: SPACING.m,
    marginRight: SPACING.s,
  },
  searchIcon: {
    marginRight: SPACING.s,
  },
  input: {
    flex: 1,
    fontSize: SIZES.body,
    color: COLORS.textDark,
    paddingVertical: 0,
  },
  filterButton: {
    backgroundColor: COLORS.textDark,
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchBar;
