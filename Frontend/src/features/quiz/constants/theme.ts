/**
 * NeuroLearn Theme - Calm, accessible design tokens
 */

export const COLORS = {
    // Brand colors
    primary: '#1B337F', // Dark blue shade from the image
    primaryLight: '#5DADE2', // Keep sky blue as a light variant
    secondary: '#EBF5FB', // Very light blue for selected background
    gradientStart: '#1B337F', // Primary blue
    gradientEnd: '#122254', // Darker blue for gradient effect
    
    // UI colors
    background: '#F8F9FA',
    surface: '#FFFFFF',
    border: '#E8EAED',
    
    // Text colors
    textPrimary: '#000000',
    textSecondary: '#5F6368',
    textLight: '#9AA0A6',
    
    // Feedback colors
    success: '#34A853',
    warning: '#FBBC05',
    error: '#EA4335',
};

export const TYPOGRAPHY = {
    // Font sizes
    hero: 25,
    title: 20,
    heading: 22,
    bodyLarge: 16,
    body: 14,
    caption: 14,
    small: 14,

    // Font weights
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '800' as const, // Extra bold for headings
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const BORDER_RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};

export const SHADOWS = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
};

export const TOUCH_TARGET = {
    minHeight: 48,
    minWidth: 48,
};