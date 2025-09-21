export const APP_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_RESUME_TYPES: {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/msword': ['.doc'],
  },
  ACCEPTED_JD_TYPES: {
    'application/pdf': ['.pdf'],
    'text/plain': ['.txt'],
  },
  ITEMS_PER_PAGE: 10,
  DEBOUNCE_DELAY: 300,
} as const;

export const VERDICT_COLORS = {
  High: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    dot: 'bg-green-400',
  },
  Medium: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    dot: 'bg-yellow-400',
  },
  Low: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    dot: 'bg-red-400',
  },
} as const;

export const SCORE_THRESHOLDS = {
  HIGH: 75,
  MEDIUM: 50,
} as const;