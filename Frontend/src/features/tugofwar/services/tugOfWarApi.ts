import { NativeModules, Platform } from 'react-native';

declare const process: {
    env: {
        EXPO_PUBLIC_API_URL?: string;
    };
};

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

const DEV_HOST = (() => {
    const scriptURL = NativeModules?.SourceCode?.scriptURL as string | undefined;
    if (scriptURL) {
        const match = scriptURL.match(/^https?:\/\/([^:/]+)(?::\d+)?\//);
        if (match?.[1]) {
            return match[1];
        }
    }
    return null;
})();

const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_URL ||
    (DEV_HOST
        ? `http://${DEV_HOST}:5001`
        : Platform.OS === 'android'
            ? 'http://10.0.2.2:5001'
            : 'http://localhost:5001');

async function authedRequest<T>(
    token: string,
    path: string,
    method: 'GET' | 'POST',
    payload?: unknown
): Promise<T> {
    let response: Response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: payload ? JSON.stringify(payload) : undefined,
        });
    } catch {
        throw new Error(`Cannot reach server at ${API_BASE_URL}. Check backend.`);
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data?.error || `Request failed with status ${response.status}`);
    }
    return data as T;
}

export function startGame(token: string, difficulty: string) {
    return authedRequest<StartGameResponse>(token, '/tugofwar/start', 'POST', { difficulty });
}

export function submitAnswer(token: string, gameId: number, team: string, answer: number) {
    return authedRequest<SubmitAnswerResponse>(token, '/tugofwar/submit', 'POST', {
        gameId,
        team,
        answer,
    });
}

export function endGame(
    token: string,
    gameId: number,
    team1Score: number,
    team2Score: number,
    winner: string,
    duration: number
) {
    return authedRequest<EndGameResponse>(token, '/tugofwar/end', 'POST', {
        gameId,
        team1Score,
        team2Score,
        winner,
        duration,
    });
}
