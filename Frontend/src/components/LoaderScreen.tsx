import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';

type LoaderScreenProps = {
  text?: string;
  fullscreen?: boolean;
};

const LoaderScreen: React.FC<LoaderScreenProps> = ({
  text = 'Loading...',
  fullscreen = true,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        fullscreen ? styles.fullscreen : styles.inline,
        { opacity },
      ]}
    >
      <View style={styles.card}>
        <LottieView
          source={require('../assets/lottie/Sandy Loading.json')}
          autoPlay
          loop
          style={styles.animation}
        />
        <Text style={styles.text}>{text}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3FBFF',
  },
  fullscreen: {
    flex: 1,
  },
  inline: {
    width: '100%',
    minHeight: 220,
    borderRadius: 20,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#3A7CA5',
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
  },
  animation: {
    width: 220,
    height: 220,
  },
  text: {
    marginTop: -6,
    fontSize: 16,
    fontWeight: '700',
    color: '#1B337F',
    textAlign: 'center',
  },
});

export default LoaderScreen;
