/**
* NeuroLearn Quiz Questions
* 10 evidence-based screening questions for ADHD, Autism, and ID
*/

import { QuizQuestion, QuizOption } from '../types/quiz_types';

/**
 * Standard options for all questions
 * Never (0) - Sometimes (1) - Often (2) - Almost Always (3)
 */
export const QUIZ_OPTIONS: QuizOption[] = [
    { label: 'Never', score: 0 },
    { label: 'Sometimes', score: 1 },
    { label: 'Often', score: 2 },
    { label: 'Almost Always', score: 3 },
];

/**
 * 10 core screening questions
 * Questions 1-3: ADHD indicators (max score: 12)
 * Questions 4-6: Autism indicators (social)
 * Questions 7-8: Behavioral/sensory overlap
 * Questions 9-10: ID indicators (max score: 6)
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
    // ADHD - Attention & Hyperactivity
    {
        id: 1,
        text: 'Has difficulty staying focused on tasks or play activities',
        domain: ['ADHD'],
        weight: {
            ADHD: 1,
            AUTISM: 0,
            ID: 0,
        },
    },
    {
        id: 2,
        text: 'Often fidgets, squirms, or cannot stay seated',
        domain: ['ADHD'],
        weight: {
            ADHD: 1,
            AUTISM: 0,
            ID: 0,
        },
    },
    {
        id: 3,
        text: 'Acts impulsively (interrupts, answers before question ends)',
        domain: ['ADHD'],
        weight: {
            ADHD: 1,
            AUTISM: 0,
            ID: 0,
        },
    },

    // Autism - Social Communication
    {
        id: 4,
        text: 'Avoids or has limited eye contact',
        domain: ['AUTISM'],
        weight: {
            ADHD: 0,
            AUTISM: 1,
            ID: 0,
        },
    },
    {
        id: 5,
        text: 'Struggles to understand or respond to emotions of others',
        domain: ['AUTISM'],
        weight: {
            ADHD: 0,
            AUTISM: 1,
            ID: 0,
        },
    },
    {
        id: 6,
        text: 'Prefers to play alone rather than with other children',
        domain: ['AUTISM'],
        weight: {
            ADHD: 0,
            AUTISM: 1,
            ID: 0,
        },
    },

    // Behavior & Sensory (Overlap)
    {
        id: 7,
        text: 'Repeats the same actions or routines and gets upset if changed',
        domain: ['AUTISM', 'ADHD'],
        weight: {
            ADHD: 1,
            AUTISM: 1,
            ID: 0,
        },
    },
    {
        id: 8,
        text: 'Is unusually sensitive to sounds, textures, lights, or touch',
        domain: ['AUTISM', 'ADHD'],
        weight: {
            ADHD: 1,
            AUTISM: 1,
            ID: 0,
        },
    },

    // Intellectual Disability - Learning & Cognitive
    {
        id: 9,
        text: 'Has significant difficulty learning basic concepts (letters, numbers, daily skills)',
        domain: ['ID'],
        weight: {
            ADHD: 0,
            AUTISM: 0,
            ID: 1,
        },
    },
    {
        id: 10,
        text: 'Needs repeated help to understand simple instructions or tasks',
        domain: ['ID'],
        weight: {
            ADHD: 0,
            AUTISM: 0,
            ID: 1,
        },
    },
];

/**
 * Maximum possible scores per domain
 * ADHD: Q1-3 (3*3=9) + Q7-8 (2*3=6) = 15
 * AUTISM: Q4-6 (3*3=9) + Q7-8 (2*3=6) = 15
 * ID: Q9-10 (2*3=6) = 6
 */
export const MAX_SCORES = {
    ADHD: 15,
    AUTISM: 15,
    ID: 6,
};