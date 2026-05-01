import { NativeModules, Platform } from 'react-native';
import { parseResponse } from './parseResponse';

declare const process: { env: { EXPO_PUBLIC_API_URL?: string } };

//Base URL (resolved once, used everywhere) 
const DEV_HOST = (() => {
    const scriptURL = NativeModules?.SourceCode?.scriptURL as string | undefined;
    if (scriptURL) {
        const match = scriptURL.match(/^https?:\/\/([^:/]+)(?::\d+)?\//);
        if (match?.[1]) return match[1];
    }
    return null;
})();

export const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_URL ||
    (DEV_HOST
        ? `http://${DEV_HOST}:5001`
        : Platform.OS === 'android'
            ? 'http://10.250.208.66:5001'
            : 'http://localhost:5001');

// Public request (no token) —>used by login/register 
export async function publicRequest<T>(
    path: string,
    payload: unknown
): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return parseResponse<T>(response);
}

// Authenticated request —> used by everything else 
export async function authedRequest<T>(
    token: string,
    path: string,
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
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
    return parseResponse<T>(response);
}