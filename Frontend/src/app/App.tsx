// import 'react-native-gesture-handler';
// import React, { useEffect } from 'react';
// import { StatusBar } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { RootNavigator } from '../navigation/RootNavigator';
// import { initializeProgress } from '../features/tracing/storage/progressStore';

// function App() {
//   useEffect(() => {
//     initializeProgress().catch(error => {
//       console.error('Failed to initialize progress:', error);
//     });
//   }, []);

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <StatusBar barStyle="dark-content" />
//       <RootNavigator />
//     </GestureHandlerRootView>
//   );
// }

// export default App;


import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { RootNavigator } from '../navigation/RootNavigator';
import LoaderScreen from '../components/LoaderScreen';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Set up immersive sticky mode
        try {
          StatusBar.setHidden(true);
          StatusBar.setBarStyle('dark-content');
          if (SystemNavigationBar && typeof SystemNavigationBar.stickyImmersive === 'function') {
            await SystemNavigationBar.stickyImmersive();
          }
        } catch (error) {
          console.error('App: Failed to set immersive mode:', error);
        }

        // Add a small delay to ensure everything is settled
        setIsInitialized(true);
      } catch (error) {
        console.error('App: Critical initialization error:', error);
        setIsInitialized(true); // Still try to render even on error
      }
    };

    initApp();

    return () => {
      try {
        StatusBar.setHidden(false);
        if (SystemNavigationBar && typeof SystemNavigationBar.lowProfile === 'function') {
          SystemNavigationBar.lowProfile();
        }
      } catch (e) {
        // Ignore cleanup errors
      }
    };
  }, []);

  if (!isInitialized) {
    return <LoaderScreen text="Preparing your fun learning experience..." />;
  }

  // Final safety check for RootNavigator
  if (!RootNavigator) {
    console.error('App: RootNavigator is undefined. Check for circular dependencies or export errors.');
    return (
      <View style={styles.fallbackContainer}>
        <LoaderScreen text="Loading app modules..." fullscreen={false} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <RootNavigator />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  fallbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3FBFF',
    paddingHorizontal: 16,
  },
});

export default App;