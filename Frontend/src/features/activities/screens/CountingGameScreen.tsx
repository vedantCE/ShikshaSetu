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
  withTiming,
  withSequence,
  ZoomIn,
  FadeInDown,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Tts from 'react-native-tts';
import LottieView from 'lottie-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/RootNavigator';

const { width, height } = Dimensions.get('window');
const ITEM_SIZE = 70;

const EMOJI_THEMES = ['🍎', '⭐', '🎈', '🧸', '🦋', '⚽', '🚗'];

type GameObject = {
  id: number;
  x: number;
  y: number;
  tapped: boolean;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CountingGame'>;
};

// Simple Object Component
const ObjectItem = ({
  item,
  emoji,
  onTap,
}: {
  item: GameObject;
  emoji: string;
  onTap: (id: number) => void;
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(item.tapped ? 0.3 : 1);

  useEffect(() => {
    if (item.tapped) {
      scale.value = withSequence(withSpring(1.3), withSpring(0.9));
      opacity.value = withTiming(0.4);
    }
  }, [item.tapped, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    if (!item.tapped) {
      onTap(item.id);
    }
  };

  return (
    <Animated.View
      style={[
        styles.itemContainer,
        { left: item.x, top: item.y },
        animatedStyle,
      ]}
      entering={ZoomIn.delay(item.id * 100).springify()}
    >
      <Pressable onPress={handlePress} style={styles.pressableItem}>
        <View style={styles.itemBg}>
          <Text style={styles.emojiText}>{emoji}</Text>
        </View>
        {item.tapped && (
          <View style={styles.checkmark}>
            <Icon name="check-circle" size={24} color="#4CAF50" />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

export const CountingGameScreen = ({ navigation }: Props) => {
  const [level, setLevel] = useState(1); // determines difficulty
  const [targetCount, setTargetCount] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [objects, setObjects] = useState<GameObject[]>([]);
  const [themeEmoji, setThemeEmoji] = useState('🍎');
  const [isCompleted, setIsCompleted] = useState(false);

  // Setup TTS
  useEffect(() => {
    Tts.getInitStatus().then(() => {
      Tts.setDefaultRate(0.4); // Slow down for kids
      Tts.setDefaultPitch(1.2); // Make it slightly high-pitched and friendly
    });
    return () => {
      Tts.stop();
    };
  }, []);

  const generateObjects = useCallback(() => {
    // Basic difficulty progression: Level 1-> 1-3 items, Level 5 -> 8-10 items
    const minCount = Math.min(Math.max(1, level), 8);
    const maxCount = Math.min(level + 2, 10);
    const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;

    setTargetCount(count);
    setCurrentCount(0);
    setIsCompleted(false);

    // Randomize theme
    const randomEmoji = EMOJI_THEMES[Math.floor(Math.random() * EMOJI_THEMES.length)];
    setThemeEmoji(randomEmoji);

    // Grid placement to prevent overlaps
    const cols = 3;
    const rows = 4;
    const cellWidth = (width - 40) / cols;
    // reserve some height for header and footer (-200)
    const cellHeight = (height - 250) / rows;

    const availableCells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        availableCells.push({ r, c });
      }
    }

    // Shuffle cells
    availableCells.sort(() => Math.random() - 0.5);

    const newObjects: GameObject[] = [];
    for (let i = 0; i < count; i++) {
      const cell = availableCells[i];
      // add jitter
      const jitterX = Math.random() * (cellWidth - ITEM_SIZE);
      const jitterY = Math.random() * (cellHeight - ITEM_SIZE);
      
      const x = 20 + cell.c * cellWidth + jitterX; // 20 padding
      const y = cell.r * cellHeight + jitterY;

      newObjects.push({
        id: i + 1,
        x,
        y,
        tapped: false,
      });
    }

    // randomize presentation order
    newObjects.sort(() => Math.random() - 0.5);
    setObjects(newObjects);
  }, [level]);

  useEffect(() => {
    generateObjects();
  }, [generateObjects]);

  const handleTap = (id: number) => {
    const nextCount = currentCount + 1;
    setCurrentCount(nextCount);
    
    // Play audio
    const countSpelledOut = nextCount.toString(); 
    Tts.stop();
    Tts.speak(countSpelledOut);

    setObjects((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, tapped: true } : obj))
    );

    if (nextCount === targetCount) {
      setTimeout(() => {
        setIsCompleted(true);
        Tts.speak(`Awesome! You counted ${targetCount} ${themeEmoji}!`);
      }, 500);
    }
  };

  const handleNextLevel = () => {
    setLevel((prev) => Math.min(prev + 1, 10));
    generateObjects();
  };

  return (
    <LinearGradient colors={['#E0F7FA', '#B2EBF2', '#80DEEA']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={28} color="#00796B" />
          </Pressable>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Counted: <Text style={styles.highlightText}>{currentCount}</Text> / {targetCount}
            </Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Lv {level}</Text>
          </View>
        </View>

        {/* Game Area */}
        <View style={styles.gameArea}>
          {!isCompleted &&
            objects.map((obj) => (
              <ObjectItem
                key={obj.id}
                item={obj}
                emoji={themeEmoji}
                onTap={handleTap}
              />
            ))}
        </View>

        {/* Completion Modal */}
        {isCompleted && (
          <Animated.View
            entering={FadeInDown.springify()}
            style={styles.completionContainer}
          >
            <Text style={styles.completionTitle}>Great Job!</Text>
            <Text style={styles.completionSub}>
              You found all {targetCount} {themeEmoji}!
            </Text>
            
            <Pressable onPress={handleNextLevel} style={styles.playAgainBtn}>
              <Text style={styles.playAgainText}>Next Level</Text>
              <Icon name="arrow-right-circle" size={24} color="#FFF" />
            </Pressable>
          </Animated.View>
        )}
      </SafeAreaView>
      
      {/* Absolute Confetti */}
      {isCompleted && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
           {/* Fallback to Lottie if available, else a simple local lottie via URL if absent. 
               We will assume no standard confetti lottie is physically placed, but we try one generic approach 
               Wait, we shouldn't fail if lottie is missing. We use a purely native view or just omit confetti if missing. 
               Let's try standard Lottie from lottie-react-native, hopefully there is some animation locally, but since we don't have a specific confetti.json, 
               I'll omit LottieView to prevent a crash from missing asset, or just provide a placeholder.
           */}
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
  },
  progressContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  progressText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00796B',
  },
  highlightText: {
    color: '#E64A19',
    fontSize: 24,
  },
  levelBadge: {
    backgroundColor: '#FFCA28',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },
  levelText: {
    fontWeight: '900',
    color: '#424242',
    fontSize: 16,
  },
  gameArea: {
    flex: 1,
    position: 'relative',
    marginHorizontal: 10,
  },
  itemContainer: {
    position: 'absolute',
    width: ITEM_SIZE,
    height: ITEM_SIZE,
  },
  pressableItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemBg: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    backgroundColor: '#FFF',
    borderRadius: ITEM_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  emojiText: {
    fontSize: 36,
  },
  checkmark: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  completionContainer: {
    position: 'absolute',
    bottom: height * 0.15,
    alignSelf: 'center',
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    width: '85%',
  },
  completionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  completionSub: {
    fontSize: 18,
    color: '#555',
    marginBottom: 25,
    textAlign: 'center',
  },
  playAgainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF7043',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 30,
    gap: 10,
  },
  playAgainText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
