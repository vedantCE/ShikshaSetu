/**
 * Quiz Screen - Full-screen optimized layout
 * One question at a time with smooth transitions
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RouteProp } from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';

import type { RootStackParamList } from '../../../navigation/RootNavigator';
import type { QuizAnswer } from '../types/quiz_types';
import { QUIZ_QUESTIONS, QUIZ_OPTIONS } from '../data/quizQuestion';
import { calculateScores, evaluateResult, calculatePercentages } from '../utils/scoringLogic';
import { ProgressBar } from '../components/ProgressBar';
import { QuestionCard } from '../components/QuestionCard';
import { OptionButton } from '../components/OptionButton';
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
} from '../constants/theme';

// Map question IDs to their corresponding images
const QUESTION_IMAGES: { [key: number]: any } = {
  1: "https://res.cloudinary.com/dfx3pzarw/image/upload/v1770644607/Question1_wljnr0.png",
  2: "https://res.cloudinary.com/dfx3pzarw/image/upload/v1770644618/Question2_frdvnz.png",
  3: "https://res.cloudinary.com/dfx3pzarw/image/upload/v1770644595/Question3_tlb5wt.png",
  4: "https://res.cloudinary.com/dfx3pzarw/image/upload/v1770644606/Question4_msgdsf.png",
  5: "https://res.cloudinary.com/dfx3pzarw/image/upload/v1770644559/Question5_yj0r4c.png",
  6: "https://res.cloudinary.com/dfx3pzarw/image/upload/v1770644628/Question6_vcg9gp.png",
  7: "https://res.cloudinary.com/dfx3pzarw/image/upload/v1770644568/Question7_dmzgiy.png",
  8: "https://res.cloudinary.com/dfx3pzarw/image/upload/v1770644595/Question3_tlb5wt.png",
  9: "https://res.cloudinary.com/dfx3pzarw/image/upload/v1770644632/Question9_oscbkl.png",
  10: "https://res.cloudinary.com/dfx3pzarw/image/upload/v1770644632/Question10_blxvis.png",

};

type QuizScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AssessmentQuiz'
>;

type QuizScreenRouteProp = RouteProp<RootStackParamList, 'AssessmentQuiz'>;

interface QuizScreenProps {
  navigation: QuizScreenNavigationProp;
  route: QuizScreenRouteProp;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ navigation, route }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === QUIZ_QUESTIONS.length - 1;

  const handleOptionSelect = useCallback((score: number) => {
    setSelectedOption(score);
  }, []);

  const handleNext = useCallback(() => {
    if (selectedOption === null) return;

    // Save answer
    const newAnswers = [
      ...answers,
      {
        questionId: currentQuestion.id,
        selectedScore: selectedOption,
      },
    ];
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // Calculate results
      const rawScores = calculateScores(newAnswers);
      const category = evaluateResult(rawScores);
      const scores = calculatePercentages(rawScores);

      navigation.navigate('AssessmentResult', {
        category,
        scores,
        studentId: route.params?.studentId,
      });
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
    }
  }, [selectedOption, answers, currentQuestion, isLastQuestion, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <View style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ShikshSetu</Text>
        <View style={{ width: 40 }} />
      </View>

      <ProgressBar
        current={currentQuestionIndex + 1}
        total={QUIZ_QUESTIONS.length}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <QuestionCard questionText={currentQuestion.text} />

        <View style={styles.imageContainer}>
          <Image
            source={{uri:QUESTION_IMAGES[currentQuestion.id]}}
            style={styles.questionImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.optionsContainer}>
          {QUIZ_OPTIONS.map((option) => (
            <OptionButton
              key={option.label}
              label={option.label}
              selected={selectedOption === option.score}
              onPress={() => handleOptionSelect(option.score)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedOption === null && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={selectedOption === null}
          activeOpacity={0.8}
        >
          <View style={styles.nextButtonContent}>
            <Text style={styles.nextButtonText}>
              {isLastQuestion ? 'View Results' : 'Next'}
            </Text>
            <View style={styles.nextArrow} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.heading,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    width: 12,
    height: 12,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.textPrimary,
    transform: [{ rotate: '45deg' }],
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  imageContainer: {
    paddingHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
  },
  questionImage: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.xl,
  },
  optionsContainer: {
    paddingHorizontal: SPACING.lg,
  },
  navigationContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md + 4,
    borderRadius: BORDER_RADIUS.xl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonDisabled: {
    backgroundColor: COLORS.textLight,
    opacity: 0.5,
  },
  nextButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: TYPOGRAPHY.heading,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.surface,
    marginRight: SPACING.sm,
  },
  nextArrow: {
    width: 10,
    height: 10,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: COLORS.surface,
    transform: [{ rotate: '45deg' }],
  },
});
