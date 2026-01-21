import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';

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

export const TracingCanvas: React.FC<TracingCanvasProps> = ({
  letterPath,
  onComplete,
  width = 300,
  height = 250,
}) => {
  const [userPath, setUserPath] = useState('');
  const [points, setPoints] = useState<Point[]>([]);

  const pan = Gesture.Pan()
    .onStart(e => {
      const newPoints = [{ x: e.x, y: e.y }];
      setPoints(newPoints);
      setUserPath(`M ${e.x} ${e.y}`);
    })
    .onUpdate(e => {
      setPoints(prev => [...prev, { x: e.x, y: e.y }]);
      setUserPath(prev => `${prev} L ${e.x} ${e.y}`);
    })
    .onEnd(() => {
      onComplete(points);
    });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={pan}>
        <View>
          <Svg width={width} height={height} style={styles.svg}>
            <Path
              d={letterPath}
              stroke="#DDD"
              strokeWidth="20"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d={userPath}
              stroke="#4A90E2"
              strokeWidth="8"
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
