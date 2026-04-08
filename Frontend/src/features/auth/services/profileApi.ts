import { authedRequest } from '../../../api/apiClient';

export type ProfileSchemaField = {
  key: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'boolean' | 'image';
  editable: boolean;
  required: boolean;
};

export type ProfileSchemaResponse = {
  fields: ProfileSchemaField[];
};

export type ProfileResponse = {
  user: Record<string, any>;
};

export type UpdateProfileResponse = {
  user: Record<string, any>;
  updatedKeys: string[];
};

export function fetchProfileSchema(token: string) {
  return authedRequest<ProfileSchemaResponse>(token, '/auth/profile-schema', 'GET');
}

export function fetchProfile(token: string) {
  return authedRequest<ProfileResponse>(token, '/auth/profile', 'GET');
}

export function patchParentProfile(token: string, updatedFields: Record<string, any>) {
  return authedRequest<UpdateProfileResponse>(token, '/auth/parent/update-profile', 'PATCH', {
    updatedFields,
  });
}
