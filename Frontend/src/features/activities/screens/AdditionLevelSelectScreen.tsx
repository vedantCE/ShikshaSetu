import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeInUp, FadeInDown, ZoomIn } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { ADDITION_LEVELS } from '../data/additionLevels';
import { useAuth } from '../../auth/context/AuthContext';

const { width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AdditionLevelSelect'>;
};

export const AdditionLevelSelectScreen = ({ navigation }: Props) => {
  const { currentStudent } = useAuth();
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  const loadProgress = useCallback(async () => {
    try {
      const studentId = currentStudent?.id || 'guest';
      const storageKey = `@addition_basket_completed_${studentId}`;
      const saved = await AsyncStorage.getItem(storageKey);
      if (saved) {
        setCompletedLevels(JSON.parse(saved));
      } else {
        setCompletedLevels([]);
      }
    } catch (err) {
      console.warn('Error loading progress', err);
    }
  }, [currentStudent?.id]);

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [loadProgress])
  );

  const handleSelectLevel = (level: number) => {
    const isUnlocked = level === 1 || completedLevels.includes(level - 1) || completedLevels.includes(level);
    if (isUnlocked) {
      navigation.navigate('AdditionBasketGame', { level });
    }
  };

  return (
    <LinearGradient colors={['#FFFDE7', '#FFF9C4']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <Animated.View entering={FadeInUp.springify()} style={styles.header}>
          <Pressable 
            onPress={() => {
              console.log('LevelSelect Navigation State:', navigation.getState());
              navigation.navigate('ActivityHub');
            }} 
            style={styles.backBtn}
          >
            <Icon name="arrow-left" size={28} color="#FF8F00" />
          </Pressable>
          <Text style={styles.headerTitle}>Basket Math</Text>
        </Animated.View>

        <Text style={styles.subTitle}>Select a Level</Text>

        <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
          {ADDITION_LEVELS.map((lvlStats, index) => {
            const isUnlocked = lvlStats.level === 1 || completedLevels.includes(lvlStats.level - 1) || completedLevels.includes(lvlStats.level);
            const isCompleted = completedLevels.includes(lvlStats.level);

            return (
              <Animated.View 
                key={lvlStats.level} 
                entering={ZoomIn.delay(index * 100).springify()}
                style={styles.cardWrapper}
              >
                <Pressable
                  onPress={() => handleSelectLevel(lvlStats.level)}
                  style={[styles.levelCard, !isUnlocked && styles.lockedCard]}
                >
                  <LinearGradient
                    colors={isUnlocked ? ['#FFF', '#F1F8E9'] : ['#E0E0E0', '#EEEEEE']}
                    style={styles.cardGradient}
                  >
                    {!isUnlocked ? (
                      <Icon name="lock" size={32} color="#9E9E9E" />
                    ) : (
                      <>
                        <Text style={styles.levelNum}>{lvlStats.level}</Text>
                        {isCompleted && (
                          <View style={styles.badge}>
                            <Icon name="star" size={16} color="#FFCA28" />
                          </View>
                        )}
                      </>
                    )}
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  backBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F57C00',
  },
  subTitle: {
    fontSize: 18,
    color: '#795548',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  cardWrapper: {
    width: (width - 50) / 3, // 3 columns
    aspectRatio: 1,
    marginBottom: 15,
  },
  levelCard: {
    flex: 1,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 3 },
    overflow: 'hidden',
  },
  lockedCard: {
    elevation: 1,
    opacity: 0.8,
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelNum: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 2,
  }
});
