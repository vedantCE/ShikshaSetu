import { NativeModules, Platform } from 'react-native';

declare const process: {
  env: {
    EXPO_PUBLIC_API_URL?: string;
  };
};

type Role = 'parent' | 'teacher';

type RegisterPayload = {
  user_name: string;
  user_email: string;
  user_password: string;
  confirm_password: string;
  contact_number: string;
  address: string;
  user_role: Role;
};

type LoginPayload = {
  user_email: string;
  user_password: string;
};

type AuthResponse = {
  user_id: number;
  user_role: Role;
  user_name: string;
  token: string;
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

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  return postJson<AuthResponse>('/auth/register', payload);
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  return postJson<AuthResponse>('/auth/login', payload);
}
