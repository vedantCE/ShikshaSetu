import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../features/auth/context/AuthContext';
import { AuthProvider } from '../features/auth/context/AuthContext';

// Existing screens
import { HomeScreen } from '../features/dashboard/screens/HomeScreen';
import VideoSplashScreen from '../features/splash/screens/VideoSplashScreen';
import { TeacherAuthScreen } from '../features/auth/screens/TeacherAuthScreen';
import { ParentAuthScreen } from '../features/auth/screens/ParentAuthScreen';
import { ForgotPasswordScreen } from '../features/auth/screens/ForgotPasswordScreen';

// New dashboard screens
import ParentDashboardScreenScreen from '../features/dashboard/screens/ParentDashboardScreen';
import TeacherModuleNavigator from './TeacherModuleNavigator';

// Add student/child screens
import TeacherAddStudentScreen from '../features/students/screens/TeacherAddStudentScreen';
import ParentAddChildScreen from '../features/students/screens/ParentAddChildScreen';

// Activity screens
import { ActivityHubScreen } from '../features/activities/screens/ActivityHubScreen';
// removed unused QuizScreen import
import { LetterGridScreen } from '../features/tracing/screens/LetterGridScreen';
import { TracingScreen } from '../features/tracing/screens/TracingScreen';
import { NumberGridScreen } from '../features/tracing/screens/NumberGridScreen';
import { ShapeGridScreen } from '../features/tracing/screens/ShapeGridScreen';
import { MoreFeaturesScreen } from '../features/activities/screens/MoreFeaturesScreen';
import AnalyticsScreen from '../features/dashboard/screens/AnalyticsScreen';
import DifficultySelectScreen from '../features/tugofwar/screens/DifficultySelectScreen';
import TugOfWarScreen from '../features/tugofwar/screens/TugOfWarScreen';
import TugOfWarResultScreen from '../features/tugofwar/screens/TugOfWarResultScreen';
// Assessment Quiz screens
import { HomeScreen as AssessmentQuizHomeScreen } from '../features/quiz/screens/HomeScreen';
import { QuizScreen as AssessmentQuizScreen } from '../features/quiz/screens/QuizScreen';
import { ResultScreen as AssessmentResultScreen } from '../features/quiz/screens/ResultScreen';
import type { ResultCategory, QuizScores } from '../features/quiz/types/quiz_types';

export type RootStackParamList = {
  Splash: undefined;
  Landing: undefined;
  ForgotPassword: undefined;
  ParentAuth: undefined;
  TeacherAuth: undefined;
  ParentDashboardScreen: undefined;
  TeacherDashboard: undefined;
  ParentAddChild: undefined;
  TeacherAddStudent: undefined;
  ActivityHub: undefined;
  MoreFeatures: undefined;
  Analytics: { studentId: string };
  AssessmentQuizHome: { studentId?: string } | undefined;
  AssessmentQuiz: { studentId?: string } | undefined;
  AssessmentResult: { category: ResultCategory; scores: QuizScores; studentId?: string };
  LetterGrid: undefined;
  NumberGrid: undefined;
  ShapeGrid: undefined;
  Tracing: { letter: string } | { category: string; item: string };
  TugOfWarDifficulty: undefined;
  TugOfWarGame: { difficulty: string };
  TugOfWarResult: {
    winner: string;
    team1Score: number;
    team2Score: number;
    duration: number;
    difficulty: string;
  };
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
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F8FA' }}>
        <ActivityIndicator size="large" color="#1B337F" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={user?.email ? (user.role === 'parent' ? 'ParentDashboardScreen' : 'TeacherDashboard') : 'Splash'}
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
                name="ParentDashboardScreen"
                component={ParentDashboardScreenScreen}
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
                component={TeacherModuleNavigator}
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
            name="MoreFeatures"
            component={MoreFeaturesScreen}
            options={{ title: 'More Features' }}
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
          <Stack.Screen
            name="Analytics"
            component={AnalyticsScreen}
            options={{ title: 'Student Analytics', headerShown: false }}
          />
          <Stack.Screen
            name="TugOfWarDifficulty"
            component={DifficultySelectScreen}
            options={{ title: 'Tug of War', headerShown: false }}
          />
          <Stack.Screen
            name="TugOfWarGame"
            component={TugOfWarScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TugOfWarResult"
            component={TugOfWarResultScreen}
            options={{ headerShown: false }}
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

          {/* Forgot Password */}
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
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