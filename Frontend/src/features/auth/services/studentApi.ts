import { NativeModules, Platform } from 'react-native';

declare const process: {
  env: {
    EXPO_PUBLIC_API_URL?: string;
  };
};

type StudentResponse = {
  student_id: number;
  student_name: string;
  age?: number;
  disorder_type?: string;
  is_active?: boolean;
};

type CreateStudentPayload = {
  student_name: string;
  age: number;
  password: string;
};

type QuizPayload = {
  ADHD: number;
  AUTISM: number;
  ID: number;
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
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export function createChild(token: string, payload: CreateStudentPayload) {
  return authedRequest<StudentResponse>(token, '/students', 'POST', payload);
}

export function fetchChildren(token: string) {
  return authedRequest<StudentResponse[]>(token, '/students', 'GET');
}

export function submitChildQuizResult(token: string, studentId: string, payload: QuizPayload) {
  return authedRequest<StudentResponse>(token, `/students/${studentId}/quiz-result`, 'POST', payload);
}
