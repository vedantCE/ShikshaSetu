import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { WebView } from 'react-native-webview';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { ObjectItem } from '../constants/data';
import GlassmorphicContainer from './GlassmorphicContainer';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.m * 3) / 2;

interface ObjectCardProps {
  item: ObjectItem;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

const formatLikes = (count: number) => {
  if (count < 1000) return count.toString();
  if (count < 10000) return (count / 1000).toFixed(1) + 'k';
  return (count / 1000).toFixed(1) + 'k';
};

const ObjectCard: React.FC<ObjectCardProps> = memo(({ item, isFavorite, onPress, onToggleFavorite }) => {
  // Random like count for demo
  const mockLikes = useMemo(() => Math.floor(Math.random() * 30000) + 1000, []);

  const embedUrl = useMemo(() => 
    `https://sketchfab.com/models/${item.modelId}/embed?ui_infos=0&ui_help=0&ui_annotations=0&ui_watermark=0&ui_controls=0&preload=1&autostart=1`,
    [item.modelId]
  );

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <GlassmorphicContainer style={styles.card}>
        <View style={styles.modelPlaceholder}>
          <WebView
            source={{ uri: embedUrl }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            cacheEnabled={true}
            androidLayerType="hardware"
            renderToHardwareTextureAndroid={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            mixedContentMode="always"
            scrollEnabled={false}
            originWhitelist={['*']}
            pointerEvents="none" // Prevent interaction on cards to keep scrolling smooth
          />
        </View>
        <View style={styles.footer}>
          <View style={styles.likesSection}>
            <TouchableOpacity onPress={onToggleFavorite}>
              <Icon
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? COLORS.heartRed : COLORS.white}
              />
            </TouchableOpacity>
            <Text style={styles.likesText}>{formatLikes(mockLikes)}</Text>
          </View>
          <MaterialIcon name="verified" size={18} color={COLORS.success} />
        </View>
        <Text style={styles.name}>{item.name}</Text>
      </GlassmorphicContainer>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.2,
    padding: SPACING.s,
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  modelPlaceholder: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  webview: {
    backgroundColor: 'transparent',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.s,
  },
  likesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likesText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  name: {
    color: COLORS.white,
    fontSize: SIZES.body,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default ObjectCard;
