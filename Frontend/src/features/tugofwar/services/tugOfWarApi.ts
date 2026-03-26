import { authedRequest } from '../../../api/apiClient';

//Types 
export type StartGameResponse = {
    gameId: number;
    difficulty: string;
    team1Question: { question: string };
    team2Question: { question: string };
};

export type SubmitAnswerResponse = {
    correct: boolean;
    team1Score: number;
    team2Score: number;
    ropePosition: number;
    newQuestion: { question: string };
    winner: string | null;
};

export type EndGameResponse = {
    id: number;
    team1_score: number;
    team2_score: number;
    winner: string;
    duration: number;
    total_questions: number;
    correct_team1: number;
    correct_team2: number;
};

//Functions
export function startGame(token: string, difficulty: string) {
    return authedRequest<StartGameResponse>(
        token, '/tugofwar/start', 'POST', { difficulty }
    );
}

export function submitAnswer(
    token: string, gameId: number, team: string, answer: number
) {
    return authedRequest<SubmitAnswerResponse>(
        token, '/tugofwar/submit', 'POST', { gameId, team, answer }
    );
}

export function endGame(
    token: string, gameId: number, team1Score: number,
    team2Score: number, winner: string, duration: number
) {
    return authedRequest<EndGameResponse>(
        token, '/tugofwar/end', 'POST',
        { gameId, team1Score, team2Score, winner, duration }
    );
}