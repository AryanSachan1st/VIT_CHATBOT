import { useAuthContext } from '../context/AuthContext';
import api from '../utils/api';

const useAuth = () => {
  const context = useAuthContext();
  
  const loginWithEmail = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      context.login(token, user);
      return { success: true, token, user };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const signupWithEmail = async (name, email, password) => {
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      const { token, user } = response.data;
      context.login(token, user);
      return { success: true, token, user };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Signup failed' };
    }
  };

  const loginWithGoogle = async (accessToken) => {
    try {
      const response = await api.post('/auth/google', { accessToken });
      const { token, user } = response.data;
      context.login(token, user);
      return { success: true, token, user };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Google login failed' };
    }
  };

  return {
    ...context,
    login: loginWithEmail,
    signup: signupWithEmail,
    loginWithGoogle
  };
};

export default useAuth;
