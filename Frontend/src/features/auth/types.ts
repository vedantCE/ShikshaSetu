import { ImageSourcePropType } from 'react-native';

export type Role = 'parent' | 'teacher';

export type User = {
  role: Role;
  name?: string;
  email?: string;
};

export type Student = {
  id: string;
  name: string;
  age?: number;
  disorder?: string;
  avatar?: ImageSourcePropType;
};

export type AuthContextType = {
  user: User | null;
  currentStudent: Student | null;
  students: Student[];
  setUser: (user: User | null) => void;
  selectStudent: (id: string) => void;
  addStudent: (student: Student) => void;
  updateParentInfo: (name: string, email: string) => void;
  logout: () => void;
};