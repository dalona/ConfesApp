export const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Navigation Routes (moved to /utils/navigation.js)
export const ROLES = {
  FAITHFUL: 'faithful',
  PRIEST: 'priest',
  COORDINATOR: 'coordinator',
  BISHOP: 'bishop',
  ADMIN: 'admin',
};

export const CONFESSION_STATUS = {
  BOOKED: 'booked',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

export const BAND_STATUS = {
  AVAILABLE: 'available',
  FULL: 'full',
  CANCELLED: 'cancelled',
};