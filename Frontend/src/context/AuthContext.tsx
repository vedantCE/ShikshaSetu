import React, { createContext, useContext, useState } from 'react';
import { ImageSourcePropType } from 'react-native';

type Role = 'parent' | 'teacher';

type User = {
  role: Role;
  name?: string;
  email?: string;
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
  user: User | null;
  currentStudent: Student | null;
  students: Student[];
  setUser: (user: User | null) => void;
  selectStudent: (id: string) => void;
  addStudent: (student: Student) => void;
  updateParentInfo: (name: string, email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  currentStudent: null,
  students: [],
  setUser: () => {},
  selectStudent: () => {},
  addStudent: () => {},
  updateParentInfo: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

  const selectStudent = (id: string) => {
    const stu = students.find(s => s.id === id);
    setCurrentStudent(stu || null);
  };

  const addStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
  };

  const updateParentInfo = (name: string, email: string) => {
    if (user) {
      setUser({ ...user, name, email });
    }
  };

  const logout = () => {
    setUser(null);
    setStudents([]);
    setCurrentStudent(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, currentStudent, students, selectStudent, addStudent, updateParentInfo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);