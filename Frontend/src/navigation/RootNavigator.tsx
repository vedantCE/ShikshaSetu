// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { HomeScreen } from '../screens/HomeScreen';
// import { LetterGridScreen } from '../screens/LetterGridScreen';
// import { TracingScreen } from '../screens/TracingScreen';
// import LoginScreen from '../screens/LoginScreen';
// import RegistrationScreen from '../screens/RegistrationScreen';
// import ActivityHubScreen from '../screens/ActivityHubScreen';

// export type RootStackParamList = {
//   Home: undefined;
//   LetterGrid: undefined;
//   Login: undefined;
//   Register: undefined;
//   Tracing: { letter: string };
//   ActivityHub: undefined;
// };

// const Stack = createNativeStackNavigator<RootStackParamList>();

// export const RootNavigator: React.FC = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName="Home"
//         screenOptions={{
//           headerStyle: { backgroundColor: '#4A90E2' },
//           headerTintColor: '#FFF',
//           headerTitleStyle: { fontWeight: 'bold' },
//         }}
//       >
//         <Stack.Screen
//           name="ActivityHub"
//           component={ActivityHubScreen}
//           options={{ title: 'Activities' }}
//         />

//         <Stack.Screen
//           name="Home"
//           component={HomeScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="LetterGrid"
//           component={LetterGridScreen}
//           options={{ title: 'Select Letter' }}
//         />
//         <Stack.Screen
//           name="Tracing"
//           component={TracingScreen}
//           options={{ title: 'Trace Letter' }}
//         />
//         <Stack.Screen
//           name="Login"
//           component={LoginScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Register"
//           component={RegistrationScreen}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from '../context/AuthContext';
import { HomeScreen } from '../screens/HomeScreen';
import { TeacherLoginScreen } from '../screens/TeacherLoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { AddStudentScreen } from '../screens/AddStudentScreen';
import { QuizScreen } from '../screens/QuizScreen';
import {ActivityHubScreen} from '../screens/ActivityHubScreen';
import { LetterGridScreen } from '../screens/LetterGridScreen';
import { TracingScreen } from '../screens/TracingScreen'; // Adjust path if needed
import VideoSplashScreen from '../components/VideoSplashScreen';

export type RootStackParamList = {
  Splash: undefined; // Add launch screen
  Landing: undefined;
  TeacherLogin: undefined;
  Dashboard: undefined;
  AddStudent: undefined;
  Quiz: { newStudentId?: string };
  ActivityHub: undefined;
  LetterGrid: undefined;
  Tracing: { letter: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const SplashScreen = ({ navigation }: any) => {
  return (
    <VideoSplashScreen
      onVideoEnd={() => {
        navigation.replace('Landing'); // go to HomeScreen
      }}
    />
  );
};

export const RootNavigator = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerStyle: { backgroundColor: '#4A90E2' },
            headerTintColor: '#FFF',
          }}
        >
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Landing"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TeacherLogin"
            component={TeacherLoginScreen}
            options={{ title: 'Teacher Login' }}
          />
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ title: 'Dashboard' }}
          />
          <Stack.Screen
            name="AddStudent"
            component={AddStudentScreen}
            options={{ title: 'Add Child/Student' }}
          />
          <Stack.Screen
            name="Quiz"
            component={QuizScreen}
            options={{ title: 'Assessment Quiz' }}
          />
          <Stack.Screen
            name="ActivityHub"
            component={ActivityHubScreen}
            options={{ title: 'Activities' }}
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
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};
