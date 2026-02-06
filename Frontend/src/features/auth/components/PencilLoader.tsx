import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  G,
  Rect,
  Polygon,
  Defs,
  ClipPath,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

export const PencilLoader = () => {
  const rotate = useSharedValue(0);
  const strokeOffset = useSharedValue(440);

  useEffect(() => {
    rotate.value = withRepeat(
      withTiming(720, {
        duration: 3000,
        easing: Easing.linear,
      }),
      -1
    );

    strokeOffset.value = withRepeat(
      withTiming(165, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1,
      true
    );
  }, []);

  const rotateProps = useAnimatedProps(() => ({
    transform: [
      { translateX: 100 },
      { translateY: 100 },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const strokeProps = useAnimatedProps(() => ({
    strokeDashoffset: strokeOffset.value,
  }));

  return (
    <View style={styles.container}>
      <Svg width={200} height={200} viewBox="0 0 200 200">
        <Defs>
          <ClipPath id="eraserClip">
            <Rect width={30} height={30} rx={5} ry={5} />
          </ClipPath>
        </Defs>

        {/* Circular Stroke */}
        <AnimatedCircle
          cx={100}
          cy={100}
          r={70}
          stroke="rgb(60,120,255)"
          strokeWidth={2}
          fill="none"
          strokeDasharray="440 440"
          animatedProps={strokeProps}
          strokeLinecap="round"
        />

        {/* Pencil Rotate Group */}
        <AnimatedG animatedProps={rotateProps}>
          {/* Pencil Body */}
          <Circle
            r={64}
            stroke="rgb(50,100,255)"
            strokeWidth={30}
            fill="none"
            strokeDasharray="402 402"
          />

          <Circle
            r={74}
            stroke="rgb(80,140,255)"
            strokeWidth={10}
            fill="none"
            strokeDasharray="465 465"
          />

          <Circle
            r={54}
            stroke="rgb(30,80,200)"
            strokeWidth={10}
            fill="none"
            strokeDasharray="339 339"
          />

          {/* Eraser */}
          <G transform="rotate(-90) translate(49 0)">
            <Rect width={30} height={30} rx={5} ry={5} fill="#9bbcff" />
            <Rect width={5} height={30} fill="#7aa5ff" clipPath="url(#eraserClip)" />
            <Rect y={0} width={30} height={20} fill="#eee" />
          </G>

          {/* Pencil Tip */}
          <G transform="rotate(-90) translate(49 -30)">
            <Polygon points="15 0 30 30 0 30" fill="#f2c26b" />
            <Polygon points="15 0 6 30 0 30" fill="#e0a848" />
            <Polygon points="15 0 20 10 10 10" fill="#222" />
          </G>
        </AnimatedG>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
