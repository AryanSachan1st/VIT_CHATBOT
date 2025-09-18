import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Login from '../components/Login';
import Signup from '../components/Signup';
import GoogleOAuth from '../components/GoogleOAuth';

const LoginPage = () => {
  const { isLoading } = useAuth();
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            VIT-Chennai Chatbot
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Sign in to your account
          </p>
        </div>
        
        {showSignup ? (
          <div id="signup-form">
            <Signup onSignup={() => {
              // Navigate to chat interface
              navigate('/');
            }} isLoading={isLoading} />
          </div>
        ) : (
          <div id="login-form">
            <Login onLogin={() => {
              // Navigate to chat interface
              navigate('/');
            }} isLoading={isLoading} />
          </div>
        )}
        
        <div className="text-center">
          <button
            onClick={() => setShowSignup(!showSignup)}
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            {showSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
        
        <GoogleOAuth />
      </div>
    </div>
  );
};

export default LoginPage;
