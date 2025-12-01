export const RNColors = {
  // app basic colors
  accentBlue: '#2B77AD',
  primaryBlue: '#1A365D',
  lightBlue: '#4299E1',
  green: '#10B981',
  yellow: '#F59E0B',
  purple: '#8B5CF6',

  // gradient colors (shape compatible with react-native-linear-gradient or similar)
  blueGradient: {
    colors: ['#1A365D', '#2B77AD'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  // text colors
  textPrimaryLight: '#1A202C',
  textPrimaryDark: '#F8FAFC',
  textSecondaryLight: '#718096',
  textSecondaryDark: '#94A3B8',
  textTertiaryLight: '#64748B',
  textTertiaryDark: '#64748B',

  // background colors
  backgroundLight: '#F7FAFC',
  backgroundDark: '#0F172A',
  backgroundDarkAlt: '#0A0E1A',

  // Aliases for compatibility
  backgroundColorLight: '#F7FAFC',
  backgroundColorDark: '#0A0E1A',

  // background container colors
  cardColorLight: '#FFFFFF',
  cardColorDark: '#1E293B',

  // button colors
  buttonPrimary: '#1E40AF',
  buttonPrimaryLight: '#3B82F6',

  // border colors
  borderLight: '#E2E8F0',
  borderDark: '#334155',

  // Error & Validation Colors
  error: '#FF4D4F',
  warning: '#FFC53D',
  success: '#52C41A',
  info: '#1890FF',

  // Neutral Colors
  neutralGray: '#6B7280',

  // Used for text and backgrounds in home.dart
  darkText: '#0F172A',
  lightCard: '#FFFFFF',
  darkCard: '#1E293B',
  darkBorder: '#334155',
  lightBorder: '#E2E8F0',

  // Quick Actions and ToolCard colors
  quickActionBlue: '#3B82F6',
  quickActionGreen: '#10B981',
  quickActionPurple: '#8B5CF6',
  quickActionYellow: '#F59E0B',

  // Used for activity and tool icons
  blue600: '#2563EB',
  blue700: '#1D4ED8',
  blue900: '#1E3A8A',

  // Used for search bar and trailing icons
  lightGray: '#F1F5F9',

  // Used for tertiary and secondary text
  tertiaryLight: '#64748B',
  secondaryDark: '#94A3B8',
} as const;

export type RNColorsType = typeof RNColors;