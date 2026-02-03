import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

interface SuccessFeedbackProps {
  success: boolean;
  stars: number;
}

export const SuccessFeedback: React.FC<SuccessFeedbackProps> = ({
  success,
  stars,
}) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.2, { damping: 2 }),
      withSpring(1)
    );
  }, [success, stars]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={[styles.text, success ? styles.success : styles.tryAgain]}>
        {success ? '🎉 Great Job!' : '💪 Try Again!'}
      </Text>
      {success && (
        <Text style={styles.stars}>
          {'⭐'.repeat(stars)}
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  success: {
    color: '#4CAF50',
  },
  tryAgain: {
    color: '#FF9800',
  },
  stars: {
    fontSize: 32,
    marginTop: 8,
  },
});