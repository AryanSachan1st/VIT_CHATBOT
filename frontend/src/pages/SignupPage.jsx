import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Signup from '../components/Signup';
import Login from '../components/Login';
import GoogleOAuth from '../components/GoogleOAuth';

const SignupPage = () => {
  const { isLoading } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            VIT-Chennai Chatbot
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Create your account
          </p>
        </div>
        
        {showLogin ? (
          <div id="login-form">
            <Login onLogin={() => {
              // Navigate to chat interface
              navigate('/');
            }} isLoading={isLoading} />
          </div>
        ) : (
          <div id="signup-form">
            <Signup onSignup={() => {
              // Navigate to chat interface
              navigate('/');
            }} isLoading={isLoading} />
          </div>
        )}
        
        <div className="text-center">
          <button
            onClick={() => setShowLogin(!showLogin)}
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            {showLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
        
        <GoogleOAuth />
      </div>
    </div>
  );
};

export default SignupPage;
