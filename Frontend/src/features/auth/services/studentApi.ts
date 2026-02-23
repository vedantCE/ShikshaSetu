import { NativeModules, Platform } from 'react-native';

declare const process: {
  env: {
    EXPO_PUBLIC_API_URL?: string;
  };
};

export type StudentResponse = {
  student_id: number;
  student_name: string;
  age?: number;
  disorder_type?: string;
  is_active?: boolean;
  image_url?: string | null;
};

type CreateStudentPayload = {
  student_name: string;
  age: number;
  password: string;
  imageUri?: string | null;
  disorder_type?: string;
};

type QuizPayload = {
  ADHD: number;
  AUTISM: number;
  ID: number;
};

type AnalyticsBreakdown = {
  activity_type: string;
  attempts: number;
  total_score: number;
  total_stars: number;
};

export type AnalyticsResponse = {
  totalActivities: number;
  totalStars: number;
  breakdown: AnalyticsBreakdown[];
  lastActivityDate: string | null;
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

export const API_BASE_URL =
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
    throw new Error(`Cannot reach server at ${API_BASE_URL}. Check backend, host IP, and port.`);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

/**
 * Create a child/student. If imageUri is provided, uses FormData (multipart)
 * to upload the image to Cloudinary via the backend.
 */
export async function createChild(
  token: string,
  payload: CreateStudentPayload
): Promise<StudentResponse> {
  const { student_name, age, password, imageUri, disorder_type } = payload;

  if (imageUri) {
    // Use FormData for multipart upload
    const formData = new FormData();
    formData.append('student_name', student_name);
    formData.append('age', String(age));
    formData.append('password', password);
    if (disorder_type) formData.append('disorder_type', disorder_type);
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'student_avatar.jpg',
    } as any);

    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT set Content-Type for FormData — fetch sets it with boundary automatically
      },
      body: formData,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error || 'Failed to create student');
    }
    return data as StudentResponse;
  }

  // No image — use regular JSON
  return authedRequest<StudentResponse>(token, '/students', 'POST', {
    student_name,
    age,
    password,
    disorder_type,
  });
}

export function fetchChildren(token: string) {
  return authedRequest<StudentResponse[]>(token, '/students', 'GET');
}

export function submitChildQuizResult(token: string, studentId: string, payload: QuizPayload) {
  return authedRequest<StudentResponse>(token, `/students/${studentId}/quiz-result`, 'POST', payload);
}

export function fetchStudentAnalytics(token: string, studentId: string) {
  return authedRequest<AnalyticsResponse>(token, `/students/${studentId}/analytics`, 'GET');
}
