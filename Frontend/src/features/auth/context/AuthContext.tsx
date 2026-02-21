import React, { createContext, useContext, useState } from 'react';
import { ImageSourcePropType } from 'react-native';

type Role = 'parent' | 'teacher';
type AuthenticatedUser = {
  user_id: number;
  role: Role;
  email: string;
  name?: string;
  token: string;
};

type Student = {
  id: string;
  name: string;
  age?: number;
  disorder?: string;
  avatar?: ImageSourcePropType;  // ← Add this! "?" makes it optional 
};
//Why ImageSourcePropType?
// This is the official React Native type for <Image source={...} />.
// require('../path.png') returns a number (local asset ID).
// Remote images use { uri: 'https://...' }.

type AuthContextType = {
  user: AuthenticatedUser | null;
  selectedRole: Role | null;
  currentStudent: Student | null;
  students: Student[];
  setSelectedRole: (role: Role | null) => void;
  login: (payload: {
    user_id: number;
    role: Role;
    email: string;
    token: string;
    name?: string;
  }) => void;
  logout: () => void;
  selectStudent: (id: string) => void;
  addStudent: (student: Student) => void;
  setStudents: (students: Student[] | ((prev: Student[]) => Student[])) => void;
  updateParentInfo: (name: string, email: string) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  selectedRole: null,
  currentStudent: null,
  students: [],
  setSelectedRole: () => {},
  login: () => {},
  logout: () => {},
  selectStudent: () => {},
  addStudent: () => {},
  setStudents: () => {},
  updateParentInfo: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [students, setStudentsState] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

  const login = ({ user_id, role, email, token, name }: {
    user_id: number;
    role: Role;
    email: string;
    token: string;
    name?: string;
  }) => {
    setUser({ user_id, role, email, token, name });
  };

  const logout = () => {
    setUser(null);
    setSelectedRole(null);
    setStudentsState([]);
    setCurrentStudent(null);
  };

  const selectStudent = (id: string) => {
    const stu = students.find(s => s.id === id);
    setCurrentStudent(stu || null);
  };

  const addStudent = (student: Student) => {
    setStudentsState(prev => [...prev, student]);
    // Keep selection in sync when a brand new child/student is created.
    setCurrentStudent(student);
  };

  const replaceStudents = (incomingStudents: Student[] | ((prev: Student[]) => Student[])) => {
    setStudentsState((prev) => {
      const next =
        typeof incomingStudents === 'function'
          ? incomingStudents(prev)
          : incomingStudents;

      if (next.length === 0) {
        setCurrentStudent(null);
      } else if (currentStudent && !next.find((student) => student.id === currentStudent.id)) {
        setCurrentStudent(null);
      }

      return next;
    });
  };

  const updateParentInfo = (name: string, email: string) => {
    if (user) {
      setUser({ ...user, name, email });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      selectedRole,
      currentStudent, 
      students, 
      setSelectedRole,
      login,
      logout, 
      selectStudent, 
      addStudent, 
      setStudents: replaceStudents,
      updateParentInfo 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
