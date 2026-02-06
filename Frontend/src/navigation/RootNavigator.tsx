// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { AuthProvider } from '../features/auth/context/AuthContext';
// import { HomeScreen } from '../features/dashboard/screens/HomeScreen';
// import { TeacherLoginScreen } from '../features/auth/screens/TeacherLoginScreen';
// import { DashboardScreen } from '../features/dashboard/screens/DashboardScreen';
// import { AddStudentScreen } from '../features/students/screens/AddStudentScreen';
// import { QuizScreen } from '../features/activities/screens/QuizScreen';
// import { ActivityHubScreen } from '../features/activities/screens/ActivityHubScreen';
// import { LetterGridScreen } from '../features/tracing/screens/LetterGridScreen';
// import { TracingScreen } from '../features/tracing/screens/TracingScreen';
// import VideoSplashScreen from '../features/splash/screens/VideoSplashScreen';

// export type RootStackParamList = {
//   Splash: undefined;
//   Landing: undefined;
//   TeacherLogin: undefined;
//   Dashboard: undefined;
//   AddStudent: undefined;
//   Quiz: { newStudentId?: string };
//   ActivityHub: undefined;
//   LetterGrid: undefined;
//   Tracing: { letter: string };
// };

// const Stack = createNativeStackNavigator<RootStackParamList>();
// const SplashScreen = ({ navigation }: any) => {
//   return (
//     <VideoSplashScreen
//       onVideoEnd={() => {
//         navigation.replace('Landing');
//       }}
//     />
//   );
// };

// export const RootNavigator = () => {
//   return (
//     <AuthProvider>
//       <NavigationContainer>
//         <Stack.Navigator
//           initialRouteName="Splash"
//           screenOptions={{
//             headerStyle: { backgroundColor: '#4A90E2' },
//             headerTintColor: '#FFF',
//           }}
//         >
//           <Stack.Screen
//             name="Splash"
//             component={SplashScreen}
//             options={{ headerShown: false }}
//           />

//           <Stack.Screen
//             name="Landing"
//             component={HomeScreen}
//             options={{ headerShown: false }}
//           />
//           <Stack.Screen
//             name="TeacherLogin"
//             component={TeacherLoginScreen}
//             options={{
//               title: 'Teacher Login',
//               headerStyle: { backgroundColor: '#1B337F' },
//               headerTintColor: '#fff', // White text/arrow
//               headerTitleStyle: { fontWeight: 'bold' },
//             }}
//           />
//           <Stack.Screen
//             name="Dashboard"
//             component={DashboardScreen}
//             options={{ title: 'Dashboard' }}
//           />
//           <Stack.Screen
//             name="AddStudent"
//             component={AddStudentScreen}
//             options={{ title: 'Add Child/Student' }}
//           />
//           <Stack.Screen
//             name="Quiz"
//             component={QuizScreen}
//             options={{ title: 'Assessment Quiz' }}
//           />
//           <Stack.Screen
//             name="ActivityHub"
//             component={ActivityHubScreen}
//             options={{ title: 'Activities' }}
//           />
//           <Stack.Screen
//             name="LetterGrid"
//             component={LetterGridScreen}
//             options={{ title: 'Select Letter' }}
//           />
//           <Stack.Screen
//             name="Tracing"
//             component={TracingScreen}
//             options={{ title: 'Trace Letter' }}
//           />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </AuthProvider>
//   );
// };
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../features/auth/context/AuthContext';
import { AuthProvider } from '../features/auth/context/AuthContext';

// Existing screens
import { HomeScreen } from '../features/dashboard/screens/HomeScreen';
import VideoSplashScreen from '../features/splash/screens/VideoSplashScreen';
import { TeacherAuthScreen } from '../features/auth/screens/TeacherAuthScreen';
import { ParentAuthScreen } from '../features/auth/screens/ParentAuthScreen';

// New dashboard screens
import TeacherDashboardScreen from '../features/dashboard/screens/TeacherDashboardScreen';
import ParentDashboardScreen from '../features/dashboard/screens/ParentDashboardScreen';

// Add student/child screens
import TeacherAddStudentScreen from '../features/students/screens/TeacherAddStudentScreen';
import ParentAddChildScreen from '../features/students/screens/ParentAddChildScreen';

// Activity screens
import { ActivityHubScreen } from '../features/activities/screens/ActivityHubScreen';
import { QuizScreen } from '../features/activities/screens/QuizScreen';
import { LetterGridScreen } from '../features/tracing/screens/LetterGridScreen';
import { TracingScreen } from '../features/tracing/screens/TracingScreen';
import { NumberGridScreen } from '../features/tracing/screens/NumberGridScreen';
import { ShapeGridScreen } from '../features/tracing/screens/ShapeGridScreen';
// Assessment Quiz screens
import { HomeScreen as AssessmentQuizHomeScreen } from '../features/quiz/screens/HomeScreen';
import { QuizScreen as AssessmentQuizScreen } from '../features/quiz/screens/QuizScreen';
import { ResultScreen as AssessmentResultScreen } from '../features/quiz/screens/ResultScreen';
import type { ResultCategory, QuizScores } from '../features/quiz/types/quiz_types';

export type RootStackParamList = {
  Splash: undefined;
  Landing: undefined;
  ParentAuth: undefined;
  TeacherAuth: undefined;
  ParentDashboard: undefined;
  TeacherDashboard: undefined;
  ParentAddChild: undefined;
  TeacherAddStudent: undefined;
  ActivityHub: undefined;
  AssessmentQuizHome: undefined;
  AssessmentQuiz: undefined;
  AssessmentResult: { category: ResultCategory; scores: QuizScores };
  LetterGrid: undefined;
  NumberGrid: undefined;
  ShapeGrid: undefined;
  Tracing: { letter: string } | { category: string; item: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const SplashScreenWrapper = ({ navigation }: any) => {
  return (
    <VideoSplashScreen
      onVideoEnd={() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Landing' }],
        });
      }}
    />
  );
};

const AppNavigator = () => {
  const { user } = useAuth(); // null = not logged in, user must have email to be authenticated

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: { backgroundColor: '#1B337F' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {user && user.email ? (
        // Fully authenticated user with email → go to role-specific dashboard
        <>
          {user.role === 'parent' ? (
            <>
              <Stack.Screen
                name="ParentDashboard"
                component={ParentDashboardScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ParentAddChild"
                component={ParentAddChildScreen}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="TeacherDashboard"
                component={TeacherDashboardScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="TeacherAddStudent"
                component={TeacherAddStudentScreen}
              />
            </>
          )}

          {/* Shared activity screens */}
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
          <Stack.Screen
            name="NumberGrid"
            component={NumberGridScreen}
            options={{ title: 'Select Number' }}
          />
          <Stack.Screen
            name="ShapeGrid"
            component={ShapeGridScreen}
            options={{ title: 'Select Shape' }}
          />
          {/* Assessment Quiz Screens */}
          <Stack.Screen
            name="AssessmentQuizHome"
            component={AssessmentQuizHomeScreen}
            options={{
              title: 'Disorder Assessment',
              headerShown: true
            }}
          />
          <Stack.Screen
            name="AssessmentQuiz"
            component={AssessmentQuizScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AssessmentResult"
            component={AssessmentResultScreen}
            options={{
              title: 'Assessment Result',
              headerShown: false
            }}
          />
        </>
      ) : (
        // Not authenticated → auth flow
        <>
          <Stack.Screen
            name="Splash"
            component={SplashScreenWrapper}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Landing"
            component={HomeScreen}
            options={{ headerShown: false }}
          />

          {/* Parent flow */}
          <Stack.Screen
            name="ParentAuth"
            component={ParentAuthScreen}
            options={{ headerShown: false }}
          />

          {/* Teacher flow */}
          <Stack.Screen
            name="TeacherAuth"
            component={TeacherAuthScreen}
            options={{ headerShown: false }}
          />

        </>
      )}
    </Stack.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};
