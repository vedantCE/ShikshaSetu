import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  interpolate,
  Extrapolation,
  FadeIn,
  useDerivedValue,   //Added for safe value reading
} from 'react-native-reanimated';
import { useAuth } from '../../auth/context/AuthContext';
import { startGame, submitAnswer, endGame } from '../services/tugOfWarApi';
import LoaderScreen from '../../../components/LoaderScreen';
import { useDeferredLoader } from '../../../utils/useDeferredLoader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ROPE_WIDTH = SCREEN_WIDTH - 40;
const GAME_DURATION = 30;

//Safe Math Parser
const safeSolveMath = (expression: string): number => {
  const sanitized = expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/[^0-9+\-*/.\s()]/g, '')
    .trim();

  const match = sanitized.match(
    /^(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)$/
  );
  if (!match) return 0;

  const a = parseFloat(match[1]);
  const op = match[2];
  const b = parseFloat(match[3]);

  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b !== 0 ? a / b : 0;
    default: return 0;
  }
};

// Memoised Keypad
const NumberKey = React.memo(
  ({ num, onPress, color }: { num: string; onPress: (v: string) => void; color: string }) => (
    <Pressable
      style={[styles.key, { backgroundColor: num === '✓' ? color : '#F1F5F9' }]}
      onPress={() => onPress(num)}
    >
      <Text style={[styles.keyText, num === '✓' && { color: '#FFF' }]}>{num}</Text>
    </Pressable>
  ),
);

const Keypad = React.memo(
  ({ onKey, color }: { onKey: (v: string) => void; color: string }) => {
    const keys = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['C', '0', '✓'],
    ];

    return (
      <View style={styles.keypad}>
        {keys.map((row, ri) => (
          <View key={ri} style={styles.keyRow}>
            {row.map((k) => (
              <NumberKey key={k} num={k} onPress={onKey} color={color} />
            ))}
          </View>
        ))}
      </View>
    );
  },
);

//Stick figures
const StickFigure = React.memo(({ color, flip }: { color: string; flip?: boolean }) => (
  <View style={[styles.figure, flip && { transform: [{ scaleX: -1 }] }]}>
    <View style={[styles.figHead, { backgroundColor: color }]} />
    <View style={[styles.figBody, { backgroundColor: color }]} />
    <View style={[styles.figArm, { backgroundColor: color }]} />
    <View style={styles.figLegs}>
      <View style={[styles.figLeg, { backgroundColor: color, transform: [{ rotate: '-20deg' }] }]} />
      <View style={[styles.figLeg, { backgroundColor: color, transform: [{ rotate: '10deg' }] }]} />
    </View>
  </View>
));

//Main Screen
const TugOfWarScreen = ({ route, navigation }: any) => {
  const difficulty: string = route?.params?.difficulty || 'easy';
  const { user } = useAuth();

  // Game state
  const [gameId, setGameId] = useState<number | null>(null);
  const [timer, setTimer] = useState(GAME_DURATION);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [team1Q, setTeam1Q] = useState('');
  const [team2Q, setTeam2Q] = useState('');
  const [team1Input, setTeam1Input] = useState('');
  const [team2Input, setTeam2Input] = useState('...');
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const showLoadingScreen = useDeferredLoader(loading);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const aiRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameIdRef = useRef<number | null>(null);
  const gameOverRef = useRef(false);

  // Animation values
  const ropeX = useSharedValue(0);
  const bounceTeam1 = useSharedValue(0);
  const bounceTeam2 = useSharedValue(0);

  // FIXED: Safe way to read rope position during render
  // useDerivedValue allows us to safely access .value without triggering Reanimated warning
  const ropePosition = useDerivedValue(() => ropeX.value);

  // Rope animated style
  const ropeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: ropeX.value }],
  }));

  // Team lean styles
  const team1LeanStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(ropeX.value, [-100, 0, 100], [-8, -3, 2], Extrapolation.CLAMP)}deg` },
      { scale: 1 + bounceTeam1.value * 0.05 },
    ],
  }));

  const team2LeanStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(ropeX.value, [-100, 0, 100], [-2, 3, 8], Extrapolation.CLAMP)}deg` },
      { scale: 1 + bounceTeam2.value * 0.05 },
    ],
  }));

  //Initialize game
  const initGame = useCallback(async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      const data = await startGame(user.token, difficulty);
      setGameId(data.gameId);
      gameIdRef.current = data.gameId;
      setTeam1Q(data.team1Question.question);
      setTeam2Q(data.team2Question.question);
      setTeam1Score(0);
      setTeam2Score(0);
      setTeam1Input('');
      setTeam2Input('...');
      setTimer(GAME_DURATION);
      setGameOver(false);
      gameOverRef.current = false;
      ropeX.value = 0;                    // Safe to write here
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to start game');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [user?.token, difficulty, navigation, ropeX]);

  useEffect(() => {
    initGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (aiRef.current) clearTimeout(aiRef.current);
    };
  }, [initGame]);

  //Countdown timer
  useEffect(() => {
    if (loading || gameOver) return;
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, gameOver]);

  //AI opponent (Team 2)
  useEffect(() => {
    if (loading || gameOver) return;
    scheduleAI();
    return () => {
      if (aiRef.current) clearTimeout(aiRef.current);
    };
  }, [loading, gameOver, team2Q]);

  const scheduleAI = useCallback(() => {
    if (aiRef.current) clearTimeout(aiRef.current);
    const delay = 2500 + Math.random() * 2500;
    aiRef.current = setTimeout(() => {
      if (gameOverRef.current) return;
      handleAISubmit();
    }, delay);
  }, [team2Q]);

  const handleAISubmit = useCallback(async () => {
    if (!user?.token || !gameIdRef.current || gameOverRef.current) return;

    const isCorrect = Math.random() < 0.6;
    let aiAnswer: number;
    try {
      const qPart = team2Q.replace('= ?', '').trim();
      const correctVal = safeSolveMath(qPart);
      aiAnswer = isCorrect ? correctVal : correctVal + Math.floor(Math.random() * 5) + 1;
    } catch {
      aiAnswer = 0;
    }

    setTeam2Input(String(aiAnswer));

    try {
      const res = await submitAnswer(user.token, gameIdRef.current, 'team2', aiAnswer);
      setTeam1Score(res.team1Score);
      setTeam2Score(res.team2Score);
      setTeam2Q(res.newQuestion.question);
      setTeam2Input('...');

      ropeX.value = withSpring(res.ropePosition, { damping: 12, stiffness: 100 });

      if (res.correct) {
        bounceTeam2.value = withSequence(
          withTiming(1, { duration: 150 }),
          withTiming(0, { duration: 150 })
        );
      }
      if (res.winner) {
        handleWin(res.winner, res.team1Score, res.team2Score);
      }
    } catch {
      // ignore AI errors silently
    }
  }, [team2Q, user?.token]);

  //Team 1 input handling
  const handleTeam1Key = useCallback((key: string) => {
    if (gameOverRef.current) return;
    if (key === 'C') {
      setTeam1Input('');
      return;
    }
    if (key === '✓') {
      handleTeam1Submit();
      return;
    }
    setTeam1Input((prev) => (prev.length >= 4 ? prev : prev + key));
  }, []);

  const handleTeam1Submit = useCallback(async () => {
    if (!user?.token || !gameIdRef.current || gameOverRef.current) return;
    const answerNum = Number(team1Input);
    if (team1Input === '' || isNaN(answerNum)) return;

    try {
      const res = await submitAnswer(user.token, gameIdRef.current, 'team1', answerNum);
      setTeam1Score(res.team1Score);
      setTeam2Score(res.team2Score);
      setTeam1Q(res.newQuestion.question);
      setTeam1Input('');

      ropeX.value = withSpring(res.ropePosition, { damping: 12, stiffness: 100 });

      if (res.correct) {
        bounceTeam1.value = withSequence(
          withTiming(1, { duration: 150 }),
          withTiming(0, { duration: 150 })
        );
      }
      if (res.winner) {
        handleWin(res.winner, res.team1Score, res.team2Score);
      }
    } catch (err: any) {
      // silently handle
    }
  }, [team1Input, user?.token]);

  // Finish / Win
  // FIXED: Now using ropePosition.value (derived) instead of ropeX.value
  const finishGame = useCallback(() => {
    if (gameOverRef.current) return;
    gameOverRef.current = true;
    setGameOver(true);

    if (timerRef.current) clearInterval(timerRef.current);
    if (aiRef.current) clearTimeout(aiRef.current);

    // Safe reading of rope position using useDerivedValue
    const currentRope = ropePosition.value;

    let w = 'draw';
    if (currentRope < -5) w = 'team1';
    else if (currentRope > 5) w = 'team2';

    // Save to backend
    if (user?.token && gameIdRef.current) {
      endGame(user.token, gameIdRef.current, team1Score, team2Score, w, GAME_DURATION)
        .catch(() => {});
    }

    // Navigate to result
    setTimeout(() => {
      navigation.replace('TugOfWarResult', {
        winner: w,
        team1Score,
        team2Score,
        duration: GAME_DURATION,
        difficulty,
      });
    }, 500);
  }, [user?.token, difficulty, navigation, team1Score, team2Score, ropePosition]);

  const handleWin = useCallback(
    (winner: string, s1: number, s2: number) => {
      if (gameOverRef.current) return;
      gameOverRef.current = true;
      setGameOver(true);

      if (timerRef.current) clearInterval(timerRef.current);
      if (aiRef.current) clearTimeout(aiRef.current);

      if (user?.token && gameIdRef.current) {
        endGame(user.token, gameIdRef.current, s1, s2, winner, GAME_DURATION - timer).catch(() => {});
      }

      setTimeout(() => {
        navigation.replace('TugOfWarResult', {
          winner,
          team1Score: s1,
          team2Score: s2,
          duration: GAME_DURATION - timer,
          difficulty,
        });
      }, 500);
    },
    [user?.token, timer, difficulty, navigation],
  );

  //Render
  if (loading) {
    if (showLoadingScreen) {
      return <LoaderScreen text="Setting up the arena..." />;
    }

    return null;
  }

  return (
    <SafeAreaView style={styles.root}>
      {/* Top Bar */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.topBar}>
        <Text style={styles.gameTitle}>TUG OF WAR: MATHEMATICS</Text>
        <View style={styles.scoreRow}>
          <View style={[styles.scoreBadge, { backgroundColor: '#3B82F6' }]}>
            <Text style={styles.teamLabel}>TEAM 1</Text>
            <Text style={styles.scoreText}>{team1Score}</Text>
          </View>

          <View style={styles.timerContainer}>
            <View style={styles.timerCircle}>
              <Text style={styles.timerText}>{timer}s</Text>
            </View>
          </View>

          <View style={[styles.scoreBadge, { backgroundColor: '#F97316' }]}>
            <Text style={styles.teamLabel}>TEAM 2</Text>
            <Text style={styles.scoreText}>{team2Score}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Arena */}
      <View style={styles.arena}>
        <View style={styles.centerLine} />
        <View style={styles.ropeArea}>
          <Animated.View style={[styles.teamChars, team1LeanStyle]}>
            <StickFigure color="#3B82F6" />
            <StickFigure color="#3B82F6" />
          </Animated.View>

          <Animated.View style={[styles.rope, ropeAnimStyle]}>
            <View style={styles.ropeBar} />
            <View style={styles.ropeMark} />
          </Animated.View>

          <Animated.View style={[styles.teamChars, team2LeanStyle]}>
            <StickFigure color="#F97316" flip />
            <StickFigure color="#F97316" flip />
          </Animated.View>
        </View>
        <Text style={styles.arenaLabel}>TUG OF WAR ARENA</Text>
      </View>

      {/* Bottom Panels */}
      <View style={styles.panelsRow}>
        {/* Team 1 Panel */}
        <View style={[styles.panel, styles.panelBlue]}>
          <View style={[styles.questionBadge, { backgroundColor: '#3B82F6' }]}>
            <Text style={styles.questionBadgeText}>Question</Text>
          </View>
          <Text style={styles.questionText}>{team1Q}</Text>
          <View style={[styles.answerBox, { borderColor: '#3B82F6' }]}>
            <Text style={styles.answerText}>{team1Input || '...'}</Text>
          </View>
          <Keypad onKey={handleTeam1Key} color="#3B82F6" />
          <View style={styles.actionRow}>
            <Pressable style={styles.clearBtn} onPress={() => setTeam1Input('')}>
              <Text style={styles.clearText}>CLEAR</Text>
            </Pressable>
            <Pressable style={[styles.submitBtn, { backgroundColor: '#3B82F6' }]} onPress={handleTeam1Submit}>
              <Text style={styles.submitText}>SUBMIT</Text>
            </Pressable>
          </View>
        </View>

        {/* Team 2 Panel (AI) */}
        <View style={[styles.panel, styles.panelOrange]}>
          <View style={[styles.questionBadge, { backgroundColor: '#F97316' }]}>
            <Text style={styles.questionBadgeText}>Question</Text>
          </View>
          <Text style={styles.questionText}>{team2Q}</Text>
          <View style={[styles.answerBox, { borderColor: '#F97316' }]}>
            <Text style={styles.answerText}>{team2Input}</Text>
          </View>
          <Keypad onKey={() => {}} color="#F97316" />
          <View style={styles.actionRow}>
            <Pressable style={styles.clearBtn} disabled>
              <Text style={[styles.clearText, { opacity: 0.4 }]}>CLEAR</Text>
            </Pressable>
            <Pressable style={[styles.submitBtn, { backgroundColor: '#F97316' }]} disabled>
              <Text style={styles.submitText}>SUBMIT</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

//Styles
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F6F8FB' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 16, color: '#64748B' },

  topBar: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8 },
  gameTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    color: '#0F172A',
    letterSpacing: 1,
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 70,
  },
  teamLabel: { fontSize: 9, fontWeight: '600', color: 'rgba(255,255,255,0.8)', letterSpacing: 0.5 },
  scoreText: { fontSize: 22, fontWeight: '800', color: '#FFF' },
  timerContainer: { alignItems: 'center' },
  timerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  timerText: { fontSize: 18, fontWeight: '800', color: '#0F172A' },

  arena: {
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  centerLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    left: '50%',
  },
  ropeArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: ROPE_WIDTH,
    height: 80,
  },
  teamChars: {
    flexDirection: 'row',
    gap: -8,
  },
  rope: {
    flex: 1,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  ropeBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#92400E',
    borderRadius: 4,
  },
  ropeMark: {
    position: 'absolute',
    width: 14,
    height: 14,
    backgroundColor: '#EF4444',
    borderRadius: 2,
  },
  arenaLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    letterSpacing: 1.5,
    marginTop: 4,
  },

  figure: { alignItems: 'center', width: 24, height: 50 },
  figHead: { width: 14, height: 14, borderRadius: 7, marginBottom: 2 },
  figBody: { width: 4, height: 14, borderRadius: 2 },
  figArm: { width: 18, height: 3, borderRadius: 1.5, position: 'absolute', top: 18 },
  figLegs: { flexDirection: 'row', gap: 4, marginTop: 1 },
  figLeg: { width: 3, height: 14, borderRadius: 1.5 },

  panelsRow: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 8,
    gap: 8,
    paddingBottom: 4,
  },
  panel: {
    flex: 1,
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
  },
  panelBlue: {
    borderWidth: 2,
    borderColor: '#3B82F6',
    backgroundColor: '#FFF',
  },
  panelOrange: {
    borderWidth: 2,
    borderColor: '#F97316',
    backgroundColor: '#FFF',
  },
  questionBadge: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  questionBadgeText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  answerBox: {
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  answerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },

  keypad: { gap: 3, marginBottom: 4 },
  keyRow: { flexDirection: 'row', gap: 3 },
  key: {
    width: (SCREEN_WIDTH / 2 - 40) / 3 - 4,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },

  actionRow: {
    flexDirection: 'row',
    gap: 6,
    width: '100%',
  },
  clearBtn: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    alignItems: 'center',
  },
  clearText: { fontSize: 11, fontWeight: '700', color: '#64748B' },
  submitBtn: {
    flex: 2,
    borderRadius: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  submitText: { fontSize: 11, fontWeight: '700', color: '#FFF' },
});

export default TugOfWarScreen;