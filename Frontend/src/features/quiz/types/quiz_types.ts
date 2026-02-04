/**
 * TypeScript type definitions for NeuroLearn Quiz App
 */

export interface QuizQuestion {
    id: number;
    text: string;
    domain: string[];
    weight: {
        ADHD: number;
        AUTISM: number;
        ID: number;
    };
}

export interface QuizOption {
    label: string;
    score: number;
}

export interface QuizScores {
    ADHD: number;
    AUTISM: number;
    ID: number;
}

export type ResultCategory =
    | 'ADHD Traits'
    | 'Autism Traits'
    | 'Intellectual Disability Traits'
    | 'Combined Traits'
    | 'Low Risk / Typical Development';

export interface QuizAnswer {
    questionId: number;
    selectedScore: number;
}

export type RootStackParamList = {
    Home: undefined;
    Quiz: undefined;
    Result: { category: ResultCategory; scores: QuizScores };
};
