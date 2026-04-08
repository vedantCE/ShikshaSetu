import React, { useEffect, memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
  ZoomIn
} from 'react-native-reanimated';

export type BasketItemData = {
  id: string;
  startX: number;
  startY: number;
  tapped: boolean;
};

type Props = {
  item: BasketItemData;
  emoji: string;
  basketX: number;
  basketY: number;
  onTap: (id: string) => void;
  onAnimationEnd: (id: string) => void;
};

const ITEM_SIZE = 60;

const AppleItemComponent = ({ item, emoji, basketX, basketY, onTap, onAnimationEnd }: Props) => {
  const translateX = useSharedValue(item.startX);
  const translateY = useSharedValue(item.startY);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // When tapped is turned to true from parent
  useEffect(() => {
    if (item.tapped) {
      // 1. Scale pop
      scale.value = withSequence(
        withSpring(1.3, { damping: 10, stiffness: 100 }),
        withSpring(0.7, { damping: 12, stiffness: 90 }) // shrink slightly while flying
      );
      
      // 2. Fly to basket
      translateX.value = withTiming(basketX, { duration: 600 });
      translateY.value = withTiming(basketY, { duration: 600 }, (finished) => {
        if (finished) {
          // Hide when it hits the basket
          opacity.value = withTiming(0, { duration: 150 });
          // Notify parent so basket can bounce safely
          runOnJS(onAnimationEnd)(item.id);
        }
      });
    }
  }, [item.tapped, basketX, basketY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value }
    ],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    if (!item.tapped) {
      onTap(item.id);
    }
  };

  return (
    <Animated.View
      entering={ZoomIn.delay(Math.random() * 300).springify()}
      style={[styles.container, animatedStyle]}
      pointerEvents={item.tapped ? 'none' : 'auto'}
    >
      <Pressable onPress={handlePress} style={styles.pressable}>
        <View style={styles.itemBg}>
          <Text style={styles.emojiText}>{emoji}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export const AnimatedAppleItem = memo(AppleItemComponent, (prev, next) => {
  return prev.item.tapped === next.item.tapped && 
         prev.basketX === next.basketX && 
         prev.basketY === next.basketY;
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    top: 0,
    left: 0,
    zIndex: 10,
    marginTop: 120,
  },
  pressable: {
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
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  emojiText: {
    fontSize: 32,
  },
});
