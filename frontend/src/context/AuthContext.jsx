import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing token in localStorage on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    // Check for token in URL (from Google OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    
    if (urlToken) {
      // Clear the token from URL
      window.history.replaceState({}, document.title, "/");
      
      // Verify and store the token
      verifyToken(urlToken);
    }
  }, []);

  // Verify token and get user info
  const verifyToken = async (tokenToVerify) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenToVerify}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setToken(tokenToVerify);
        setUser(userData.user);
        localStorage.setItem('token', tokenToVerify);
        localStorage.setItem('user', JSON.stringify(userData.user));
        return { success: true, user: userData.user };
      } else {
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        return { success: false, error: 'Invalid token' };
      }
    } catch (error) {
      console.error('Token verification error:', error);
      return { success: false, error: 'Token verification failed' };
    }
  };

  // Handle login
  const handleLogin = async (email, password) => {
    setIsLoading(true);
    
    // Client-side validation
    if (!email || !password) {
      setIsLoading(false);
      return { success: false, error: 'Please fill in all fields' };
    }
    
    if (!email.endsWith('@vit.ac.in') && !email.endsWith('@vitstudent.ac.in')) {
      setIsLoading(false);
      return { success: false, error: 'Please use a valid VIT-Chennai college email address (@vit.ac.in or @vitstudent.ac.in)' };
    }
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, token: data.token, user: data.user };
      } else if (response.status === 429) {
        return { success: false, error: 'Too many login attempts. Please try again later.' };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login. Please check your connection and try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup
  const handleSignup = async (name, email, password) => {
    setIsLoading(true);
    
    // Client-side validation
    if (!name || !email || !password) {
      setIsLoading(false);
      return { success: false, error: 'Please fill in all fields' };
    }
    
    if (!email.endsWith('@vit.ac.in') && !email.endsWith('@vitstudent.ac.in')) {
      setIsLoading(false);
      return { success: false, error: 'Please use a valid VIT-Chennai college email address (@vit.ac.in or @vitstudent.ac.in)' };
    }
    
    if (password.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Password must be at least 6 characters long' };
    }
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          name
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, token: data.token, user: data.user };
      } else if (response.status === 429) {
        return { success: false, error: 'Too many signup attempts. Please try again later.' };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An error occurred during signup. Please check your connection and try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isLoading,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    verifyToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
