
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  FadeInDown,
  FadeInUp,
  FadeInRight,
  ZoomIn,
} from 'react-native-reanimated';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/RootNavigator';
import { useAuth } from '../../auth/context/AuthContext';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ActivityHub'>;
};

// --- Animations ---
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ScalePressable = ({ children, onPress, style }: { children: React.ReactNode; onPress: () => void; style?: any }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
};

export const ActivityHubScreen = ({ navigation }: Props) => {
  const { user, currentStudent } = useAuth(); // Assuming useAuth provides user info

  // Helper for greeting based on time
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning!';
    if (hours < 18) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1️⃣ HEADER SECTION */}
        <Animated.View
          entering={FadeInDown.duration(600).springify()}
          style={styles.header}
        >
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              {/* Placeholder Avatar */}
              <Image source={require('../assets/Activityhub/abc.png')} style={styles.avatar} />
            </View>
            <View>
              <Text style={styles.greetingText}>{getGreeting()}</Text>
              <Text style={styles.usernameText}>
                {currentStudent?.name || user?.name || 'Student'}
              </Text>
            </View>
          </View>

          <View style={styles.coinBadge}>
            <Icon name="star-circle" size={20} color="#FFF" />
            <Text style={styles.coinText}>12000</Text>
          </View>
        </Animated.View>

        {/* 2️⃣ DAILY HABIT CARD */}
        <Animated.View entering={FadeInUp.delay(200).duration(600).springify()}>
          <ScalePressable onPress={() => { }} style={styles.habitCard}>
            <View style={styles.habitTextContainer}>
              <Text style={styles.habitLabel}>Today's good habit</Text>
              <Text style={styles.habitQuote}>"Kindness makes the world a better place."</Text>

              <View style={styles.habitActions}>
                <View style={styles.playButtonSmall}>
                  <Text style={styles.playTextSmall}>Play</Text>
                  <Icon name="play-circle-outline" size={16} color="#333" />
                </View>
                <View style={styles.pointsBadge}>
                  <Icon name="star" size={14} color="#4A90E2" />
                  <Text style={styles.pointsText}>100</Text>
                </View>
              </View>
            </View>
            <Image
              source={require('../assets/Activityhub/habits.png')} // habits illustration
              style={styles.habitImage}
              resizeMode="contain"
            />
          </ScalePressable>
        </Animated.View>

        {/* 3️⃣ FEATURE CARDS ROW */}
        <View style={styles.featuresRow}>
          {/* Alphabets */}
          <Animated.View entering={FadeInRight.delay(300).springify()} style={styles.featureWrapper}>
            <ScalePressable
              onPress={() => navigation.navigate('LetterGrid')} // Or 'Tracing' depending on flow
              style={[styles.featureCard, { backgroundColor: '#E3F2FD' }]}
            >
              <Image source={require('../assets/Activityhub/alphabets_icon.png')} style={styles.featureIcon} resizeMode="contain" />
            </ScalePressable>
            <Text style={styles.featureTitle}>Alphabets</Text>
          </Animated.View>

          {/* Numbers */}
          <Animated.View entering={FadeInRight.delay(400).springify()} style={styles.featureWrapper}>
            <ScalePressable
              onPress={() => navigation.navigate('NumberGrid')} // Or 'NumberTracingScreen'
              style={[styles.featureCard, { backgroundColor: '#FFEBEE' }]}
            >
              <Image source={require('../assets/Activityhub/numbers_icon.png')} style={styles.featureIcon} resizeMode="contain" />
            </ScalePressable>
            <Text style={styles.featureTitle}>Numbers</Text>
          </Animated.View>

          {/* More */}
          <Animated.View entering={FadeInRight.delay(500).springify()} style={styles.featureWrapper}>
            <ScalePressable
              onPress={() => navigation.navigate('MoreFeatures')}
              style={[styles.featureCard, { backgroundColor: '#FFF3E0' }]}
            >
              <Image source={require('../assets/Activityhub/more_icon.png')} style={styles.featureIcon} resizeMode="contain" />
            </ScalePressable>
            <Text style={styles.featureTitle}>More</Text>
          </Animated.View>
        </View>

        {/* 4️⃣ PUZZLE GAME CARD */}
        <Animated.View entering={ZoomIn.delay(600).springify()}>
          <ScalePressable
            onPress={() => { }} // Navigate to PuzzleScreen when available
            style={styles.puzzleCard}
          >
            <LinearGradient
              colors={['#ffffff', '#f0f4f8']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.puzzleGradient}
            >
              <View style={styles.puzzleContent}>
                <View>
                  <Text style={styles.puzzleTitle}>Puzzle Game</Text>
                  <Text style={styles.puzzleSubtitle}>Play & match the puzzles</Text>
                </View>
                <View style={styles.playButtonProps}>
                  <Text style={styles.playButtonText}>Play</Text>
                  <Icon name="play-circle" size={20} color="#FFF" />
                </View>
              </View>
            </LinearGradient>
          </ScalePressable>
        </Animated.View>

        {/* 5️⃣ STORIES SECTION */}
        <Animated.View entering={FadeInUp.delay(700).springify()} style={styles.storiesSection}>
          <View style={styles.storiesHeader}>
            <Text style={styles.storiesTitle}>More Stories</Text>
            <Pressable onPress={() => navigation.navigate('MoreFeatures')}>
              <Text style={styles.seeAllText}>See All</Text>
            </Pressable>
          </View>

          <ScalePressable onPress={() => { }} style={styles.storyCard}>
            <LinearGradient
              colors={['#FFF8E1', '#FFF3E0']}
              style={styles.storyGradient}
            >
              <View style={styles.storyContent}>
                <Text style={styles.storyCategory}>Mystical Stories</Text>
                <Text style={styles.storyName}>"Story About The Happy Tiger."</Text>

                <View style={styles.storyActions}>
                  <View style={styles.playButtonStory}>
                    <Text style={styles.playStoryText}>Play</Text>
                    <Icon name="play-circle-outline" size={16} color="#333" />
                  </View>
                  <View style={styles.durationBadge}>
                    <Icon name="clock-outline" size={14} color="#666" />
                    <Text style={styles.durationText}>14 min</Text>
                  </View>
                </View>
              </View>
              <LottieView
                source={require('../assets/Activityhub/Tiger Happy.json')}
                autoPlay
                loop
                style={styles.storyLottie}
              />
            </LinearGradient>
          </ScalePressable>
        </Animated.View>

      </ScrollView>

      {/* 6️⃣ BOTTOM TAB NAVIGATION (Simplified Visual Representation if needed, assuming Main Tab Navigator handles this) */}
      {/* Since this screen is likely inside a Tab Navigator, we rely on the parent navigator. 
          If we need to mimic the custom tab bar from the reference image, we can create a custom tab bar component 
          in the MainTabNavigator configuration. For now, we assume standard React Navigation tabs or the existing bottom bar.
      */}
      <View style={styles.bottomSpacer} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 0, // Space for bottom tab
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E1F5FE', // Light blue bg
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  greetingText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  usernameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#448AFF', // Blue badge
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  coinText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Daily Habit Card
  habitCard: {
    backgroundColor: '#E3F2FD', // pastel blue/white
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    height: 180,
  },
  habitTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  habitLabel: {
    fontSize: 12,
    color: '#90A4AE',
    marginBottom: 8,
    fontWeight: '600',
  },
  habitQuote: {
    fontSize: 18,
    color: '#37474F',
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 24,
  },
  habitActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playButtonSmall: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    gap: 4,
  },
  playTextSmall: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  pointsBadge: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    gap: 4,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  habitImage: {
    width: 100,
    height: '100%',
  },

  // Feature Cards Row
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  featureWrapper: {
    alignItems: 'center',
    width: (width - 60) / 3,
  },
  featureCard: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  // Puzzle Card
  puzzleCard: {
    borderRadius: 24,
    marginBottom: 24,
    overflow: 'hidden', // for gradient
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  puzzleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    height: 100,
  },
  puzzleContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  puzzleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  puzzleSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  playButtonProps: {
    flexDirection: 'row',
    backgroundColor: '#448AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    gap: 6,
  },
  playButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Stories Section
  storiesSection: {
    marginBottom: 20,
  },
  storiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  storiesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#F06292', // pinkish
    fontWeight: '600',
  },
  storyCard: {
    borderRadius: 24,
    height: 180,
    overflow: 'hidden',
    backgroundColor: '#FFF8E1', // fallback
  },
  storyBackground: {
    flex: 1,
  },
  storyGradient: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storyLottie: {
    width: 140,
    height: 140,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  storyContent: {
    width: '65%', // Limit width so text doesn't overlap image on right
  },
  storyCategory: {
    fontSize: 12,
    color: '#8D6E63',
    fontWeight: '600',
    marginBottom: 6,
  },
  storyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E2723',
    marginBottom: 16,
    lineHeight: 26,
  },
  storyActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playButtonStory: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    gap: 4,
  },
  playStoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 20,
  },
});