// Configuration parameters for the application

// API base URL - use environment variable if available, otherwise fallback to localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Token storage keys
export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

// Request timeout in milliseconds
export const API_TIMEOUT = 30000;

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;

// Badge types (for reference)
export const BADGE_TYPES = {
  ACHIEVEMENT: 'achievement',
  SKILL: 'skill',
  PARTICIPATION: 'participation'
};

// Points thresholds for levels
export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  1000,   // Level 5
  2000,   // Level 6
  3500,   // Level 7
  5000,   // Level 8
  7500,   // Level 9
  10000   // Level 10
];

// Calculate user level based on points
export const calculateLevel = (points) => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
};

// Calculate points needed for next level
export const pointsForNextLevel = (currentPoints) => {
  const currentLevel = calculateLevel(currentPoints);
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    return null; // Max level reached
  }
  return LEVEL_THRESHOLDS[currentLevel] - currentPoints;
};