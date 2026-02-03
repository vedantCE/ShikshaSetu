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
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';  // Keep this for controlling status bar
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SystemNavigationBar from 'react-native-system-navigation-bar';  // NEW: Import the library
import { RootNavigator } from '../navigation/RootNavigator';
import { initializeProgress } from '../features/tracing/storage/progressStore';

function App() {
  useEffect(() => {
    // Existing: Initialize your progress
    initializeProgress().catch(error => {
      console.error('Failed to initialize progress:', error);
    });

    // NEW: Set up immersive sticky mode
    const setupImmersive = async () => {
      try {
        // Hide status bar completely
        StatusBar.setHidden(true);
        
        // Optional: Set style for when bars appear temporarily (dark icons on light background)
        StatusBar.setBarStyle('dark-content');
        
        // Enable sticky immersive mode (bars hidden, show on swipe, auto-hide)
        await SystemNavigationBar.stickyImmersive();
      } catch (error) {
        console.error('Failed to set immersive mode:', error);
      }
    };

    setupImmersive();

    // Optional cleanup: Restore normal bars when app closes (rarely needed, but good practice)
    return () => {
      StatusBar.setHidden(false);
      SystemNavigationBar.lowProfile();  // Restores normal navigation bar behavior
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* REMOVED: <StatusBar barStyle="dark-content" /> 
          We now control it imperatively with setHidden(true) for full hide */}
      <RootNavigator />
    </GestureHandlerRootView>
  );
}

export default App;