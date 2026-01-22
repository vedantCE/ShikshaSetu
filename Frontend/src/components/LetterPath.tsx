import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface LetterPathProps {
  pathData: string;
  size?: number;
}

export const LetterPath: React.FC<LetterPathProps> = ({
  pathData,
  size = 100,
}) => {
  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox="0 0 300 250">
        <Path
          d={pathData}
          stroke="#333"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
