import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchChildren } from '../services/studentApi';

declare const atob: ((data: string) => string) | undefined;

type Role = 'parent' | 'teacher';
type AuthenticatedUser = {
  user_id: number;
  role: Role;
  email: string;
  name?: string;
  token: string;
};

const getJwtExp = (token: string): number | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - normalized.length % 4) % 4), '=');
    const decoded = typeof atob === 'function' ? atob(padded) : null;
    if (!decoded) return null;

    const parsed = JSON.parse(decoded);
    return typeof parsed.exp === 'number' ? parsed.exp : null;
  } catch {
    return null;
  }
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
  isStudentLoading: boolean;
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
  isStudentLoading: false,
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
  const [isStudentLoading, setIsStudentLoading] = useState(false);

  const mapChildrenToStudents = (children: any[]): Student[] =>
    children.map((c) => ({
      id: String(c.student_id),
      name: c.student_name,
      age: c.age,
      disorder: c.disorder_type,
      avatar: c.image_url ?? undefined,
    }));

  const applyStudents = (incoming: Student[], reason: string) => {
    setStudentsState(incoming);
    setCurrentStudent((prev) => {
      const preserved = prev ? incoming.find((student) => student.id === prev.id) : null;
      const nextCurrent = preserved ?? incoming[0] ?? null;
      console.log('[AuthContext] applyStudents:', {
        reason,
        incomingCount: incoming.length,
        previousCurrent: prev?.id ?? null,
        nextCurrent: nextCurrent?.id ?? null,
      });
      return nextCurrent;
    });
  };

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const userData = await AsyncStorage.getItem('@auth_user');
      if (userData) {
        const parsed = JSON.parse(userData);

        const tokenExp = getJwtExp(parsed.token) ?? (typeof parsed.exp === 'number' ? parsed.exp : null);
        const isExpired = Boolean(tokenExp && Date.now() >= tokenExp * 1000);

        if (!isExpired) {
          // Hard reset first to avoid stale student leakage across accounts.
          applyStudents([], 'checkToken:prehydrate-clear');

          setUser({
            user_id: parsed.user_id,
            role: parsed.role,
            email: parsed.email,
            token: parsed.token,
            name: parsed.name,
          });

          // ─── ISSUE 1 FIX: Rehydrate children from backend on every app startup ──
          // Without this, students[] was always [] after a restart because addStudent()
          // only updates in-memory state — children were never fetched back from the DB.
          if (parsed.role === 'parent' && parsed.token) {
            setIsStudentLoading(true);
            try {
              const childrenFromServer = await fetchChildren(parsed.token);
              const mapped = mapChildrenToStudents(childrenFromServer);
              applyStudents(mapped, 'checkToken:parent-hydrate');
            } catch (fetchErr) {
              // Network failure must not block auth — user is still logged in,
              // they just won't see children until connectivity is restored.
              console.warn('AuthContext: Could not fetch children on startup:', fetchErr);
            } finally {
              setIsStudentLoading(false);
            }
          } else {
            setIsStudentLoading(false);
          }
          // ─────────────────────────────────────────────────────────────────────────
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
    console.log('[AuthContext] login:start', { user_id, role, email });

    let hydratedCount = 0;

    // Clear stale session student state before applying new account data.
    applyStudents([], 'login:pre-reset');

    const userData = { user_id, role, email, token, name };
    setUser(userData);

    if (role === 'parent') {
      setIsStudentLoading(true);
      try {
        const childrenFromServer = await fetchChildren(token);
        const mapped = mapChildrenToStudents(childrenFromServer);
        hydratedCount = mapped.length;
        applyStudents(mapped, 'login:parent-hydrate');
      } catch (error) {
        console.warn('AuthContext: Failed to hydrate children after login:', error);
        applyStudents([], 'login:parent-hydrate-failed');
      } finally {
        setIsStudentLoading(false);
      }
    } else {
      setIsStudentLoading(false);
    }

    if (rememberMe) {
      const exp = getJwtExp(token);
      await AsyncStorage.setItem('@auth_user', JSON.stringify({ ...userData, exp }));
    }

    console.log('[AuthContext] login:complete', {
      user_id,
      role,
      studentCount: role === 'parent' ? hydratedCount : 0,
    });
  };

  const logout = async () => {
    setUser(null);
    setSelectedRole(null);
    applyStudents([], 'logout');
    setIsStudentLoading(false);
    await AsyncStorage.removeItem('@auth_user');
  };

  const selectStudent = (id: string) => {
    const stu = students.find(s => s.id === id);
    if (!stu) {
      console.warn('[AuthContext] selectStudent: id not found yet, keeping current student', {
        requestedId: id,
        currentStudentId: currentStudent?.id ?? null,
        studentCount: students.length,
      });
      return;
    }

    console.log('[AuthContext] selectStudent', {
      requestedId: id,
      resolvedId: stu.id,
      resolvedName: stu.name,
    });
    setCurrentStudent(stu);
  };

  const addStudent = (student: Student) => {
    setStudentsState(prev => {
      const next = [...prev, student];
      return next;
    });
    setCurrentStudent(student);
    console.log('[AuthContext] addStudent', { id: student.id, name: student.name });
  };

  const replaceStudents = (incomingStudents: Student[] | ((prev: Student[]) => Student[])) => {
    setStudentsState((prev) => {
      const next = typeof incomingStudents === 'function' ? incomingStudents(prev) : incomingStudents;
      setCurrentStudent((existingCurrent) => {
        const preserved = existingCurrent
          ? next.find((student) => student.id === existingCurrent.id)
          : null;
        return preserved ?? next[0] ?? null;
      });
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
      isStudentLoading,
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
