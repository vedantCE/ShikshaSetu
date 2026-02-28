import React, { memo } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { CATEGORIES } from '../constants/data';

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryPills: React.FC<CategoryPillsProps> = memo(({ selectedCategory, onSelectCategory }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <TouchableOpacity
              key={category}
              style={[
                styles.pill,
                isSelected ? styles.selectedPill : styles.unselectedPill,
              ]}
              onPress={() => onSelectCategory(category)}
            >
              <Text
                style={[
                  styles.pillText,
                  isSelected ? styles.selectedPillText : styles.unselectedPillText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.s,
  },
  title: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginLeft: SPACING.m,
    marginBottom: SPACING.s,
  },
  scrollContent: {
    paddingHorizontal: SPACING.m,
    gap: SPACING.s,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPill: {
    backgroundColor: COLORS.textDark,
  },
  unselectedPill: {
    backgroundColor: COLORS.lightPurple,
  },
  pillText: {
    fontSize: SIZES.caption,
    fontWeight: '500',
  },
  selectedPillText: {
    color: COLORS.white,
  },
  unselectedPillText: {
    color: COLORS.textDark,
  },
});

export default CategoryPills;
