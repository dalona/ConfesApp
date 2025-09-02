// Navigation utilities and constants

export const ROUTES = {
  // Public routes
  HOME: '/',
  SELECT_ROLE: '/select-role',
  FAITHFUL_ACTION: '/faithful/action',
  PRIEST_ACTION: '/priest/action',
  PRIEST_REGISTRATION_TYPE: '/priest/registration-type',
  LOGIN: (role) => `/login/${role}`,
  COORDINATOR_REGISTER: (token) => `/coordinator/register/${token}`,
  
  // Protected routes
  DASHBOARD: '/dashboard',
  FAITHFUL_DASHBOARD: '/dashboard/faithful',
  PRIEST_DASHBOARD: '/dashboard/priest',
  COORDINATOR_DASHBOARD: '/dashboard/coordinator',
  BISHOP_DASHBOARD: '/dashboard/bishop',
  ADMIN_DASHBOARD: '/dashboard/admin',
};

export const getLoginRoute = (role, registrationType = null, isLogin = true) => {
  const params = new URLSearchParams();
  if (registrationType) params.append('type', registrationType);
  if (!isLogin) params.append('mode', 'register');
  
  const queryString = params.toString();
  return `${ROUTES.LOGIN(role)}${queryString ? `?${queryString}` : ''}`;
};

export const getDashboardRoute = (role) => {
  switch (role) {
    case 'faithful':
      return ROUTES.FAITHFUL_DASHBOARD;
    case 'priest':
      return ROUTES.PRIEST_DASHBOARD;
    case 'coordinator':
      return ROUTES.COORDINATOR_DASHBOARD;
    case 'bishop':
      return ROUTES.BISHOP_DASHBOARD;
    case 'admin':
      return ROUTES.ADMIN_DASHBOARD;
    default:
      return ROUTES.DASHBOARD;
  }
};