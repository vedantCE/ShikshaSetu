import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import Video from 'react-native-video';

interface VideoSplashScreenProps {
  onVideoEnd: () => void;
}

const VideoSplashScreen: React.FC<VideoSplashScreenProps> = ({ onVideoEnd }) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <Video
        source={require('../public/LauchScreen/launchScreen.mp4')} // Use require for local files
        style={styles.video}
        muted={true}
        repeat={false} // Set to false to play only once
        resizeMode="cover"
        onEnd={onVideoEnd} // Callback function to run when video ends
      />
    </View>
  );
};
// const VideoSplashScreen: React.FC<VideoSplashScreenProps> = ({ onVideoEnd }) => {
//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor="black" barStyle="light-content" />
//       <Video
//         source={require('../public/LauchScreen/launchScreen.mp4')}
//         style={styles.video}
//         muted
//         repeat={false}
//         resizeMode="cover"
//         onEnd={onVideoEnd}
//       />
//     </View>
//   );
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default VideoSplashScreen;
