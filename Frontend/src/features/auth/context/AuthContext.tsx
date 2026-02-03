import React, { createContext, useContext, useState } from 'react';
import { ImageSourcePropType } from 'react-native';

type Role = 'parent' | 'teacher';
type AuthenticatedUser = {
  role: Role;
  email: string;
  name?: string;
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
  login: (email: string, name?: string) => void;
  logout: () => void;
  selectStudent: (id: string) => void;
  addStudent: (student: Student) => void;
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
  updateParentInfo: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

  const login = (email: string, name?: string) => {
    if (!selectedRole) {
      throw new Error('Cannot login without selecting a role first');
    }
    setUser({ role: selectedRole, email, name });
  };

  const logout = () => {
    setUser(null);
    setSelectedRole(null);
    setStudents([]);
    setCurrentStudent(null);
  };

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
      updateParentInfo 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);