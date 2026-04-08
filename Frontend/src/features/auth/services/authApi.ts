import { authedRequest, publicRequest } from '../../../api/apiClient';

//Types
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

type ChangePasswordPayload = {
    userId: number;
    newPassword: string;
};

type ChangePasswordResponse = {
    message: string;
};

//Functions
export function registerUser(payload: RegisterPayload) {
    return publicRequest<AuthResponse>('/auth/register', payload);
}

export function loginUser(payload: LoginPayload) {
    return publicRequest<AuthResponse>('/auth/login', payload);
}

export function changePassword(token: string, payload: ChangePasswordPayload) {
    return authedRequest<ChangePasswordResponse>(token, '/auth/change-password', 'POST', payload);
}