import { useState } from 'react';

const GoogleOAuth = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  return (
    <div className="mt-6">
      {/* Error message display */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      
      {/* Success message display */}
      {success && (
        <div className="rounded-md bg-green-50 p-4 mb-4">
          <div className="text-sm text-green-700">{success}</div>
        </div>
      )}
      
      <a
        href="http://localhost:3000/api/auth/google"
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        onClick={() => {
          setSuccess('Redirecting to Google for authentication...');
          setError('');
        }}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.43-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#4285F4"/>
        </svg>
        Sign in with Google
      </a>
    </div>
  );
};

export default GoogleOAuth;
