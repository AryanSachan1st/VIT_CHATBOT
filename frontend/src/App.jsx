import { useState } from 'react';
import useAuth from './hooks/useAuth';
import useChat from './hooks/useChat';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';
import ProtectedRoute from './components/ProtectedRoute';
import { useNavigate } from 'react-router-dom';

function App() {
  const { user, token, isLoading, logout } = useAuth();
  const { messages, isLoading: isChatLoading, error, query, clearHistory } = useChat(token, user);
  const [inputError, setInputError] = useState('');
  const navigate = useNavigate();
  
  // Handle logout
  const handleLogout = () => {
    logout();
    clearHistory();
    navigate('/login');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  VIT-Chennai Chatbot
                </h1>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700 dark:text-gray-300 mr-4">
                  Welcome, {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Container */}
        <div className="flex-1 overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Messages */}
            <ChatHistory messages={messages} isLoading={isChatLoading} error={error} />
            
            {/* Input Area */}
            <ChatInput 
              onQuery={(input) => query(input)} 
              isLoading={isChatLoading} 
              error={inputError}
              onError={setInputError}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default App;
