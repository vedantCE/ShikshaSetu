import { authedRequest, API_BASE_URL } from '../../../api/apiClient';
import { parseResponse } from '../../../api/parseResponse';

//Types
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

type QuizPayload = { ADHD: number; AUTISM: number; ID: number };

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

//Functions
export async function createChild(
    token: string,
    payload: CreateStudentPayload
): Promise<StudentResponse> {
    const { student_name, age, password, imageUri, disorder_type } = payload;

    if (imageUri) {
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
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        return parseResponse<StudentResponse>(response);
    }

    return authedRequest<StudentResponse>(token, '/students', 'POST', {
        student_name, age, password, disorder_type,
    });
}

export function fetchChildren(token: string) {
    return authedRequest<StudentResponse[]>(token, '/students', 'GET');
}

export function submitChildQuizResult(
    token: string, studentId: string, payload: QuizPayload
) {
    return authedRequest<StudentResponse>(
        token, `/students/${studentId}/quiz-result`, 'POST', payload
    );
}

export function fetchStudentAnalytics(token: string, studentId: string) {
    return authedRequest<AnalyticsResponse>(
        token, `/students/${studentId}/analytics`, 'GET'
    );
}