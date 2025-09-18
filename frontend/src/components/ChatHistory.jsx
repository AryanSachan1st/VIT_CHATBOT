import ChatMessage from './ChatMessage';

const ChatHistory = ({ messages, isLoading, error }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Error message display */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        
        {isLoading && (
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 max-w-2xl">
            <div className="font-medium text-gray-900 dark:text-white">Bot</div>
            <div className="mt-1 text-gray-800 dark:text-gray-200">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
