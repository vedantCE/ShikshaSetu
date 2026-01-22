import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { LetterGridScreen } from '../screens/LetterGridScreen';
import { TracingScreen } from '../screens/TracingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';

export type RootStackParamList = {
  Home: undefined;
  LetterGrid: undefined;
  Login: undefined;
  Register: undefined;
  Tracing: { letter: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#4A90E2' },
          headerTintColor: '#FFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LetterGrid"
          component={LetterGridScreen}
          options={{ title: 'Select Letter' }}
        />
        <Stack.Screen
          name="Tracing"
          component={TracingScreen}
          options={{ title: 'Trace Letter' }}
        />
        <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
 />
 <Stack.Screen
  name="Register"
  component={RegistrationScreen}
  options={{ headerShown: false }}
/>


       
      </Stack.Navigator>
    </NavigationContainer>
  );
};
