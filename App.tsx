import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation/RootNavigator';
import { initializeProgress } from './src/storage/progressStore';

function App() {
  useEffect(() => {
    initializeProgress().catch(error => {
      console.error('Failed to initialize progress:', error);
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </GestureHandlerRootView>
  );
}

export default App;
