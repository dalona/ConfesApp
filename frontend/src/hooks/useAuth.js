import { useAuthContext } from '../store/auth/AuthProvider';

export const useAuth = () => {
  return useAuthContext();
};