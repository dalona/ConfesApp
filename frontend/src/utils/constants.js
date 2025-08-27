export const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const ROUTES = {
  LANDING: 'landing',
  ROLE_SELECT: 'role-select',
  FAITHFUL_ACTION: 'faithful-action-select',
  PRIEST_ACTION: 'priest-action-select',
  PRIEST_REGISTRATION_TYPE: 'priest-registration-type',
  LOGIN: 'login',
  COORDINATOR_REGISTER: 'coordinator-register',
  DASHBOARD: 'dashboard',
};

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