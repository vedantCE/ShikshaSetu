import type { TextStyle } from 'react-native';

export const palette = {
  background: '#F6F8FB',
  primary: '#3B82F6',
  text: '#0F172A',
  muted: '#64748B',
  card: '#FFFFFF',
  border: '#E2E8F0',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
};

export const metrics = {
  radius: 18,
  spacing: 16,
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
};

export const typography = {
  title: { fontSize: 22, fontWeight: '700' as TextStyle['fontWeight'], color: palette.text },
  subtitle: { fontSize: 14, fontWeight: '600' as TextStyle['fontWeight'], color: palette.muted },
  body: { fontSize: 16, color: palette.text },
};