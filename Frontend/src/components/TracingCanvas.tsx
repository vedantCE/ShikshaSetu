
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  runOnJS,
} from 'react-native-reanimated';
// import { scheduleOnRN } from 'react-native-worklets';

interface Point {
  x: number;
  y: number;
}

interface TracingCanvasProps {
  letterPath: string;
  onComplete: (points: Point[]) => void;
  width?: number;
  height?: number;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Maximum number of points to store (prevents memory exhaustion)
const MAX_POINTS = 200;

// Worklet-safe function to convert points array to SVG path string
const pointsToSVGPath = (points: Point[]): string => {
  'worklet';
  if (points.length === 0) return '';

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }

  return path;
};

// Worklet-safe function to downsample points array when limit is reached
// Strategy: Keep first point, evenly sample middle points, keep recent points
const downsamplePoints = (points: Point[], newPoint: Point, maxPoints: number): Point[] => {
  'worklet';
  // If under limit, just add the new point
  if (points.length < maxPoints) {
    return [...points, newPoint];
  }

  // At limit: keep first point, sample middle, keep last 50 points, add new point
  const downsampled: Point[] = [];
  const keepRecent = 50;
  const keepFirst = 1;
  const availableSlots = maxPoints - keepFirst - keepRecent - 1; // -1 for new point

  // Always keep first point
  downsampled.push(points[0]);

  // Sample middle points (evenly distributed)
  const middleStart = keepFirst;
  const middleEnd = points.length - keepRecent;
  const middleRange = middleEnd - middleStart;

  if (middleRange > 0 && availableSlots > 0) {
    const step = Math.max(1, Math.floor(middleRange / availableSlots));
    for (let i = middleStart; i < middleEnd; i += step) {
      if (downsampled.length < maxPoints - keepRecent - 1) {
        downsampled.push(points[i]);
      }
    }
  }

  // Keep recent points (last 50)
  const recentStart = Math.max(keepFirst, points.length - keepRecent);
  for (let i = recentStart; i < points.length; i++) {
    downsampled.push(points[i]);
  }

  // Add new point (will be at most maxPoints length now)
  downsampled.push(newPoint);

  // Final safety: if somehow exceeded, trim to maxPoints
  if (downsampled.length > maxPoints) {
    return downsampled.slice(0, maxPoints);
  }

  return downsampled;
};

export const TracingCanvas: React.FC<TracingCanvasProps> = ({
  letterPath,
  onComplete,
  width = 300,
  height = 250,
}) => {
  // Store points as array instead of string (memory efficient)
  const points = useSharedValue<Point[]>([]);
  const frameCount = useSharedValue(0);

  // Convert points array to SVG path string only when rendering
  const animatedProps = useAnimatedProps(() => {
    'worklet';
    return {
      d: pointsToSVGPath(points.value),
    };
  });

  const pan = Gesture.Pan()
    .onStart(e => {
      'worklet';
      points.value = [{ x: e.x, y: e.y }];
      frameCount.value = 0;
    })
    .onUpdate(e => {
      'worklet';
      // Throttle: only update every 3rd frame to reduce worklet calls
      frameCount.value += 1;

      if (frameCount.value % 3 === 0) {
        // Use downsampling to prevent array from growing unbounded
        points.value = downsamplePoints(points.value, { x: e.x, y: e.y }, MAX_POINTS);
      }
    })
    .onEnd(() => {
      'worklet';
      // Signal completion on JS thread safely
      runOnJS(onComplete)(points.value);
    });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={pan}>
        <View>
          <Svg width={width} height={height} style={styles.svg}>
            {/* Letter guide */}
            <Path
              d={letterPath}
              stroke="#DDD"
              strokeWidth={20}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* User trace */}
            <AnimatedPath
              animatedProps={animatedProps}
              stroke="#4A90E2"
              strokeWidth={8}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
  },
});
