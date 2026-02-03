import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/RootNavigator';
import { TracingCanvas } from '../components/TracingCanvas';
import { SuccessFeedback } from '../components/SuccessFeedback';
import { getLetterPath } from '../constants/LetterPaths';
import { parseSVGPath, validateTracing } from '../utils/tracingValidator';
import { saveProgress } from '../storage/progressStore';
import { TRACING_THRESHOLD, ALPHABET } from '../constants/Alphabet';

type TracingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Tracing'>;
  route: RouteProp<RootStackParamList, 'Tracing'>;
};

export const TracingScreen: React.FC<TracingScreenProps> = ({
  navigation,
  route,
}) => {
  const { letter } = route.params;
  const [showFeedback, setShowFeedback] = useState(false);
  const [success, setSuccess] = useState(false);
  const [stars, setStars] = useState(0);
  const [key, setKey] = useState(0);

  const letterPath = getLetterPath(letter);
  const letterPoints = parseSVGPath(letterPath);

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleComplete = (userPoints: { x: number; y: number }[]) => {
    // Delay slightly to allow final render
    setTimeout(() => {
      if (!isMountedRef.current) return;

      try {
        console.log('TRACE END - Validating', userPoints.length);

        // 🔥 HARD LIMIT points (CRITICAL)
        // Ensure we don't block JS thread with huge arrays
        const sampledPoints = userPoints.slice(0, 300);

        const accuracy = validateTracing(sampledPoints, letterPoints);
        console.log('Accuracy:', accuracy);

        const isSuccess = accuracy >= TRACING_THRESHOLD;

        setSuccess(isSuccess);
        setShowFeedback(true);

        if (isSuccess) {
          // ⭐ Star Logic: 90%+ = 4 stars, 70-89% = 3 stars
          const earnedStars = accuracy >= 0.9 ? 4 : 3;

          setStars(earnedStars);
          saveProgress(letter, earnedStars).catch((err) => console.log('Save error', err));

          // 🚀 Auto-Advance Logic
          setTimeout(() => {
            if (!isMountedRef.current) return;

            const currentIndex = ALPHABET.indexOf(letter);
            const nextIndex = currentIndex + 1;

            if (nextIndex < ALPHABET.length) {
              const nextLetter = ALPHABET[nextIndex];
              // Replace avoids infinite back-stack
              navigation.replace('Tracing', { letter: nextLetter });
            } else {
              // End of alphabet - go back to grid
              navigation.navigate('LetterGrid');
            }
          }, 2000); // 2 seconds delay
        } else {
          // Failure - auto-hide after 2s
          setTimeout(() => {
            if (isMountedRef.current) {
              setShowFeedback(false);
              setKey(prev => prev + 1); // Auto-reset canvas
            }
          }, 2000);
        }

      } catch (e) {
        console.log('Tracing error', e);
      }
    }, 100);
  };


  const handleReset = () => {
    setKey(prev => prev + 1);
    setShowFeedback(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trace the Letter</Text>
      <Text style={styles.letter}>{letter}</Text>

      <TracingCanvas
        key={key}
        letterPath={letterPath}
        onComplete={handleComplete}
      />

      {showFeedback && <SuccessFeedback success={success} stars={stars} />}

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  letter: {
    fontSize: 72,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4A90E2',
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});