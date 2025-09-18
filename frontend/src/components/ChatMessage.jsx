const ChatMessage = ({ message }) => {
  return (
    <div
      className={`p-4 rounded-lg ${
        message.role === 'user'
          ? 'bg-indigo-100 dark:bg-indigo-900 ml-auto max-w-md'
          : message.isError
          ? 'bg-red-100 dark:bg-red-900 max-w-2xl'
          : 'bg-gray-100 dark:bg-gray-800 max-w-2xl'
      }`}
    >
      <div className="font-medium text-gray-900 dark:text-white">
        {message.role === 'user' ? 'You' : 'Bot'}
      </div>
      <div className="mt-1 text-gray-800 dark:text-gray-200">
        {message.content}
      </div>
      {message.sources && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Sources:
          <ul className="list-disc pl-5 mt-1">
            {message.sources.map((source, i) => (
              <li key={i}>
                {source.sourceType === 'blog' ? (
                  <span>Blog: {source.title}</span>
                ) : (
                  <span>Web: <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">{source.title}</a></span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
