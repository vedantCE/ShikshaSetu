import { API_BASE_URL } from '../../auth/services/studentApi';

export type TracingType = 'alphabet' | 'number';

export type UpdateTracingPayload = {
  student_id: number;
  type: TracingType;
  item: string;
  stars: number;
};

export type UpdateTracingResponse = {
  message: string;
  student_id: number;
  type: TracingType;
  item: string;
  requested_stars: number;
  stored_stars: number;
  alphabet_progress?: number;
  number_progress?: number;
  updated: boolean;
};

export type StudentTracingProgressResponse = {
  student_id: number;
  student_name: string;
  alphabet_progress: number;
  number_progress: number;
  alphabet_stars?: Record<string, number>;
  number_stars?: Record<string, number>;
  last_tracing_update: string | null;
};

export async function updateTracing(
  token: string,
  payload: UpdateTracingPayload
): Promise<UpdateTracingResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/update-tracing`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(`Cannot reach server at ${API_BASE_URL}. Check backend, host IP, and port.`);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as UpdateTracingResponse;
}

export async function fetchStudentTracingProgress(
  token: string,
  studentId: string,
  includeStars = false
): Promise<StudentTracingProgressResponse> {
  let response: Response;

  try {
    response = await fetch(
      `${API_BASE_URL}/students/${studentId}/tracing-progress${includeStars ? '?includeStars=true' : ''}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch {
    throw new Error(`Cannot reach server at ${API_BASE_URL}. Check backend, host IP, and port.`);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as StudentTracingProgressResponse;
}
