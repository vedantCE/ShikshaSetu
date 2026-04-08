import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Tts from 'react-native-tts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/RootNavigator';

import { AnimatedAppleItem, BasketItemData } from '../components/AnimatedAppleItem';
import { ADDITION_LEVELS } from '../data/additionLevels';
import { useAuth } from '../../auth/context/AuthContext';

const { width, height } = Dimensions.get('window');

const BASKET_SIZE = 100;
const BASKET_X = (width - BASKET_SIZE) / 2;
const BASKET_Y = height - 250;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AdditionBasketGame'>;
  route: RouteProp<RootStackParamList, 'AdditionBasketGame'>;
};

export const AdditionBasketGameScreen = ({ navigation, route }: Props) => {
  const { currentStudent } = useAuth();
  
  // Requirement: Maintain currentLevel instead of relying strictly on route params
  const [currentLevel, setCurrentLevel] = useState(route.params.level);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  
  const levelData = ADDITION_LEVELS.find((l) => l.level === currentLevel) || ADDITION_LEVELS[0];
  const maxQuestions = levelData.problems.length;

  const [questionIndex, setQuestionIndex] = useState(0);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  
  const [basketCount, setBasketCount] = useState(0);
  const [items, setItems] = useState<BasketItemData[]>([]);
  const [isQuestionCompleted, setIsQuestionCompleted] = useState(false);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);
  
  // Debug output requested by prompt
  useEffect(() => {
    console.log("Current Level:", currentLevel);
    console.log("Completed:", completedLevels);
  }, [currentLevel, completedLevels]);

  // Basket Bounce Physics
  const basketScale = useSharedValue(1);
  const triggerBasketBounce = useCallback(() => {
    basketScale.value = withSequence(
      withSpring(1.2, { damping: 10, stiffness: 150 }),
      withSpring(1, { damping: 12, stiffness: 100 })
    );
  }, [basketScale]);

  const animatedBasketStyle = useAnimatedStyle(() => ({
    transform: [{ scale: basketScale.value }],
  }));

  useEffect(() => {
    Tts.getInitStatus().then(() => {
      Tts.setDefaultRate(0.35); 
      Tts.setDefaultPitch(1.2);
    });
    return () => { Tts.stop(); };
  }, []);

  const total = num1 + num2;
  const emoji = '🍎'; 

  const generateQuestion = useCallback((qIndex: number) => {
    const problem = levelData.problems[qIndex];
    setNum1(problem.num1);
    setNum2(problem.num2);
    setBasketCount(0);
    setIsQuestionCompleted(false);
    
    const padding = 20;
    const topMargin = 150; 
    const halfWidth = width / 2;
    const newItems: BasketItemData[] = [];

    // Layout left/right mapping
    for (let i = 0; i < problem.num1; i++) {
      const c = i % 2;
      const r = Math.floor(i / 2);
      newItems.push({
        id: `A-${qIndex}-${i}`,
        startX: padding + c * ((halfWidth - padding) / 2) + Math.random() * 5,
        startY: topMargin + r * 75 + Math.random() * 5,
        tapped: false,
      });
    }

    for (let i = 0; i < problem.num2; i++) {
      const c = i % 2;
      const r = Math.floor(i / 2);
      newItems.push({
        id: `B-${qIndex}-${i}`,
        startX: halfWidth + c * ((halfWidth - padding) / 2) + Math.random() * 5,
        startY: topMargin + r * 75 + Math.random() * 5,
        tapped: false,
      });
    }

    setItems(newItems);
    
    setTimeout(() => {
      Tts.speak(`Tap the apples to count!`);
    }, 500);

  }, [levelData.problems]);

  // Boot the first question
  useEffect(() => {
    generateQuestion(0);
  }, [generateQuestion]);

  const handleAppleTap = useCallback((id: string) => {
    // We update items state to mark the item as tapped.
    setItems((prevItems) => {
      const activeIdx = prevItems.findIndex((i) => i.id === id);
      // Ensure we only mark if it wasn't already tapped (Double tap prevention via Unique ID state)
      if (activeIdx > -1 && !prevItems[activeIdx].tapped) {
        const nextState = [...prevItems];
        nextState[activeIdx] = { ...nextState[activeIdx], tapped: true };
        
        // Correct functional state update to prevent stale closures and missed counts
        setBasketCount((prevCount) => {
          const nextCount = prevCount + 1;
          console.log("Basket Count:", nextCount);
          
          // Trigger audio for the exact live state
          Tts.stop();
          Tts.speak(nextCount.toString());
          
          return nextCount;
        });

        return nextState;
      }
      return prevItems;
    });
  }, []);

  const saveProgress = async () => {
    try {
      const studentId = currentStudent?.id || 'guest';
      const storageKey = `@addition_basket_completed_${studentId}`;
      const saved = await AsyncStorage.getItem(storageKey);
      let currentCompleted = saved ? JSON.parse(saved) : [];
      
      // Prevent duplicates
      if (!currentCompleted.includes(currentLevel)) {
        currentCompleted.push(currentLevel);
      }
      
      setCompletedLevels(currentCompleted);
      await AsyncStorage.setItem(storageKey, JSON.stringify(currentCompleted));
    } catch (e) {}
  };

  const handleAppleAnimationEnd = useCallback((id: string) => {
    triggerBasketBounce();
    
    setBasketCount((currentCount) => {
      if (currentCount === total && !isQuestionCompleted) {
        setIsQuestionCompleted(true);
        setTimeout(() => {
          Tts.speak(`${num1} plus ${num2} equals ${total}`);
          
          setTimeout(() => {
            if (questionIndex + 1 >= maxQuestions) {
              saveProgress();
              setIsLevelCompleted(true);
              Tts.speak("Level Completed! Great job!");
            } else {
              // Proceed to next question automatically after review
              setQuestionIndex(q => q + 1);
              generateQuestion(questionIndex + 1);
            }
          }, 3000); // Wait 3s before advancing
        }, 800);
      }
      return currentCount;
    });
  }, [triggerBasketBounce, isQuestionCompleted, num1, num2, total, questionIndex, maxQuestions, generateQuestion, saveProgress]);

  return (
    <LinearGradient colors={['#FFFDE7', '#FFF9C4']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <Animated.View entering={FadeInUp.springify()} style={styles.header}>
           <Pressable 
             onPress={() => {
               console.log('BasketGame Navigation State:', navigation.getState());
               navigation.replace('AdditionLevelSelect');
             }} 
             style={styles.backBtn}
           >
            <Icon name="close" size={28} color="#FF8F00" />
          </Pressable>
          <View style={styles.headerCenter}>
             <Text style={styles.levelTitle}>Level {currentLevel}</Text>
             <Text style={styles.progressText}>Question {questionIndex + 1} / {maxQuestions}</Text>
             <View style={styles.progressBarBg}>
               <View style={[styles.progressBarFill, { width: `${((questionIndex + 1) / maxQuestions) * 100}%` }]} />
             </View>
          </View>
        </Animated.View>
        
        <View style={styles.equationBadge}>
          <Text style={styles.equationText}>
            {num1} {emoji}   +   {num2} {emoji}
          </Text>
        </View>

        {/* Live Score Counter */}
        <View style={styles.basketStatsContainer}>
           <Text style={styles.basketStatsText}>Basket: {basketCount}</Text>
        </View>

        {/* Play Area */}
        <View style={styles.playArea}>
           {items.map((item) => (
             <AnimatedAppleItem
               key={item.id}
               item={item}
               emoji={emoji}
               basketX={BASKET_X + 20} 
               basketY={BASKET_Y}
               onTap={handleAppleTap}
               onAnimationEnd={handleAppleAnimationEnd}
             />
           ))}
        </View>
        
        {/* Animated Custom Basket Container */}
        <Animated.View
          style={[styles.basketContainer, animatedBasketStyle, { left: BASKET_X, top: BASKET_Y }]}
          pointerEvents="none"
        >
          {/* New Large Circular Badge Above Basket */}
          <View style={styles.largeFloatingCounter}>
            <Text style={styles.largeFloatingCounterText}>{basketCount}</Text>
          </View>
          <Text style={styles.basketEmoji}>🧺</Text>
        </Animated.View>

        {/* Success Modal (End of Level) */}
        {isLevelCompleted && (
          <Animated.View entering={FadeInDown.springify()} style={styles.resultContainer}>
            <Text style={styles.finalEquationText}>Level {currentLevel} Complete!</Text>
            <Text style={styles.subText}>You are doing an amazing job!</Text>
            
            <Pressable 
               onPress={() => {
                 if (currentLevel < 10) {
                    // Reset specifically requested by prompt:
                    setCurrentLevel(prev => prev + 1);
                    setBasketCount(0);
                    setItems([]);
                    setQuestionIndex(0);
                    setIsLevelCompleted(false);
                    // Generate new question handles the rest
                    // Must wait for state update layout or run sequentially
                 } else {
                    navigation.replace('AdditionLevelSelect');
                 }
               }} 
               style={styles.nextBtn}>
              <Text style={styles.nextBtnText}>{currentLevel < 10 ? 'Next Level' : 'Finish'}</Text>
              <Icon name={currentLevel < 10 ? "arrow-right-circle" : "star"} size={24} color="#FFF" />
            </Pressable>
          </Animated.View>
        )}
        
        {/* Temporary pop-up just showing the solution if it's not the final level question */}
        {isQuestionCompleted && !isLevelCompleted && (
           <Animated.View entering={FadeInUp.springify()} style={styles.tempResult}>
             <Text style={styles.tempResultText}>{num1} + {num2} = {total}</Text>
           </Animated.View>
        )}

      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, position: 'relative' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    zIndex: 20,
  },
  backBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    marginRight: 10,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 20, fontWeight: 'bold', color: '#F57C00'
  },
  progressText: {
    fontSize: 14, color: '#795548', marginBottom: 4
  },
  progressBarBg: {
    width: '60%', height: 8, backgroundColor: '#FFE082', borderRadius: 4, overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%', backgroundColor: '#4CAF50'
  },
  equationBadge: {
    alignSelf: 'center',
    backgroundColor: '#FFCA28',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 3 },
    marginTop: 5,
    zIndex: 20,
  },
  equationText: { color: '#4E342E', fontWeight: 'bold', fontSize: 24, letterSpacing: 2 },
  basketStatsContainer: {
    position: 'absolute',
    top: 75,
    right: 15,
    backgroundColor: '#81C784',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    zIndex: 20,
  },
  basketStatsText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  playArea: {
    flex: 1,
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
  },
  basketContainer: {
    position: 'absolute',
    width: BASKET_SIZE,
    height: BASKET_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  basketEmoji: {
    fontSize: 90,
  },
  largeFloatingCounter: {
    position: 'absolute',
    top: -30,
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
    elevation: 5,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 3 },
    zIndex: 10,
  },
  largeFloatingCounterText: {
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#FFF'
  },
  tempResult: {
    position: 'absolute',
    top: height * 0.4,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 30,
    zIndex: 40,
  },
  tempResultText: {
    fontSize: 48, fontWeight: 'bold', color: '#0288D1'
  },
  resultContainer: {
    position: 'absolute',
    bottom: height * 0.2,
    alignSelf: 'center',
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    width: '85%',
    zIndex: 30,
  },
  finalEquationText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6F00',
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16, color: '#555', marginBottom: 20, textAlign: 'center'
  },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#66BB6A', paddingHorizontal: 25, paddingVertical: 15, borderRadius: 30, gap: 10,
  },
  nextBtnText: {
    color: '#FFF', fontSize: 20, fontWeight: 'bold'
  }
});
