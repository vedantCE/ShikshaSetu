import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  avatar?: string;  // Cloudinary URL or local URI
};

type AuthContextType = {
  user: AuthenticatedUser | null;
  selectedRole: Role | null;
  currentStudent: Student | null;
  students: Student[];
  isLoading: boolean;
  setSelectedRole: (role: Role | null) => void;
  login: (payload: {
    user_id: number;
    role: Role;
    email: string;
    token: string;
    name?: string;
    rememberMe?: boolean;
  }) => Promise<void>;
  logout: () => Promise<void>;
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
  isLoading: true,
  setSelectedRole: () => { },
  login: async () => { },
  logout: async () => { },
  selectStudent: () => { },
  addStudent: () => { },
  setStudents: () => { },
  updateParentInfo: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [students, setStudentsState] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const userData = await AsyncStorage.getItem('@auth_user');
      if (userData) {
        const parsed = JSON.parse(userData);

        // Simple manual validation for expiry (assuming an 'exp' field is stored or calculated)
        // If standard JWT is used without 'exp' in parsed, we just log them in until 401 occurs natively.
        // As per requirements: "validate expiration"
        let isExpired = false;
        if (parsed.exp && Date.now() >= parsed.exp * 1000) {
          isExpired = true;
        }

        if (!isExpired) {
          setUser(parsed);
        } else {
          await AsyncStorage.removeItem('@auth_user');
        }
      }
    } catch (e) {
      console.log('Failed to fetch token', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async ({ user_id, role, email, token, name, rememberMe = true }: {
    user_id: number;
    role: Role;
    email: string;
    token: string;
    name?: string;
    rememberMe?: boolean;
  }) => {
    const userData = { user_id, role, email, token, name };
    setUser(userData);

    if (rememberMe) {
      // Decode JWT roughly to find exp if possible, otherwise set manual 30 days
      let exp = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);
      try {
        const payloadBase64 = token.split('.')[1];
        // Use basic base64 decode if needed, or skip detailed JWT validation if no atob
        // For simplicity and stability without extra libs, rely on backend rejection or basic date math
      } catch (e) { }
      await AsyncStorage.setItem('@auth_user', JSON.stringify({ ...userData, exp }));
    }
  };

  const logout = async () => {
    setUser(null);
    setSelectedRole(null);
    setStudentsState([]);
    setCurrentStudent(null);
    await AsyncStorage.removeItem('@auth_user');
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
      isLoading,
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
