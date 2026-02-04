/**
 * Scoring Logic for NeuroLearn Assessment Quiz
 */

import type { ResultCategory, QuizScores, QuizAnswer } from '../types/quiz_types';
import { QUIZ_QUESTIONS, MAX_SCORES } from '../data/quizQuestion';


/**
 * Calculate raw scores from quiz answers
 */
export const calculateScores = (answers: QuizAnswer[]): QuizScores => {
  const scores: QuizScores = {
    ADHD: 0,
    AUTISM: 0,
    ID: 0,
  };

  answers.forEach((answer) => {
    const question = QUIZ_QUESTIONS.find((q) => q.id === answer.questionId);
    if (question) {
      scores.ADHD += answer.selectedScore * question.weight.ADHD;
      scores.AUTISM += answer.selectedScore * question.weight.AUTISM;
      scores.ID += answer.selectedScore * question.weight.ID;
    }
  });

  return scores;
};

/**
 * Convert raw scores to percentages
 */
export const calculatePercentages = (rawScores: QuizScores): QuizScores => {
  return {
    ADHD: Math.round((rawScores.ADHD / MAX_SCORES.ADHD) * 100),
    AUTISM: Math.round((rawScores.AUTISM / MAX_SCORES.AUTISM) * 100),
    ID: Math.round((rawScores.ID / MAX_SCORES.ID) * 100),
  };
};

/**
 * Evaluate the result category based on scores
 */
export const evaluateResult = (rawScores: QuizScores): ResultCategory => {
  const percentages = calculatePercentages(rawScores);

  // Count how many domains are above threshold (50%)
  const highScores: Array<keyof QuizScores> = [];

  if (percentages.ADHD >= 50) highScores.push('ADHD');
  if (percentages.AUTISM >= 50) highScores.push('AUTISM');
  if (percentages.ID >= 50) highScores.push('ID');

  // Combined traits: 2+ domains above threshold
  if (highScores.length >= 2) {
    return 'Combined Traits';
  }

  // Single domain traits
  if (highScores.length === 1) {
    const domain = highScores[0];
    if (domain === 'ADHD') return 'ADHD Traits';
    if (domain === 'AUTISM') return 'Autism Traits';
    if (domain === 'ID') return 'Intellectual Disability Traits';
  }

  // All scores below threshold
  return 'Low Risk / Typical Development';
};

/**
 * Get the score level based on percentage
 */
export const getScoreLevel = (percentage: number): string => {

  if (percentage >= 75) return 'High Risk';
  if (percentage >= 50) return 'Moderate Risk';
  if (percentage >= 25) return 'Low-Moderate Risk';
  return 'Low Risk';
};

/**
 * Get detailed explanation for each result category
 */
export const getResultExplanation = (category: ResultCategory): string => {
  const explanations: Record<ResultCategory, string> = {
    'ADHD Traits':
      'The assessment indicates patterns commonly associated with ADHD (Attention-Deficit/Hyperactivity Disorder). This may include challenges with attention, impulsivity, or hyperactivity. These results are for educational purposes only and should be discussed with a qualified healthcare professional for proper diagnosis and support.',

    'Autism Traits':
      'The assessment shows patterns that are often associated with Autism Spectrum. This may involve differences in social communication, sensory processing, or repetitive behaviors. Remember that neurodiversity is a strength, and a professional evaluation can provide personalized guidance and support.',

    'Intellectual Disability Traits':
      'The assessment suggests patterns that may be associated with developmental differences in cognitive functioning. This could involve variations in learning, problem-solving, or adaptive skills. Professional assessment is important to understand individual strengths and create appropriate support strategies.',

    'Combined Traits':
      'The assessment indicates patterns that span multiple developmental areas. This is not uncommon, as many individuals show characteristics across different profiles. A comprehensive professional evaluation can help identify specific needs and create a holistic support plan.',

    'Low Risk / Typical Development':
      'The assessment suggests developmental patterns within typical ranges. This is a positive indicator, though remember that every child develops at their own pace. If you have any concerns about specific areas of development, consulting with a professional can provide additional peace of mind.',
  };

  return explanations[category];
};