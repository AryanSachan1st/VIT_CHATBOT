import { useState } from 'react';

const useChat = (token, user) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle chat query
  const query = async (input, sessionId = 'default') => {
    // Input validation
    if (!input.trim()) {
      setError('Please enter a question');
      return { success: false, error: 'Please enter a question' };
    }
    
    if (!token || !user) {
      setError('You must be logged in to ask questions');
      return { success: false, error: 'You must be logged in to ask questions' };
    }
    
    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3000/api/chat/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: input,
          userId: user.id,
          sessionId: sessionId
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Add bot response to chat
        const botMessage = { 
          role: 'assistant', 
          content: data.answer,
          sources: data.sources
        };
        setMessages(prev => [...prev, botMessage]);
        return { success: true, data };
      } else if (response.status === 429) {
        // Handle rate limiting
        const errorMessage = { 
          role: 'assistant', 
          content: 'Too many requests. Please wait a moment before asking another question.',
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
        return { success: false, error: 'Too many requests. Please wait a moment before asking another question.' };
      } else {
        // Add error message to chat
        const errorMessage = { 
          role: 'assistant', 
          content: `Error: ${data.message}`,
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
        return { success: false, error: data.message };
      }
    } catch (error) {
      // Add error message to chat
      const errorMessage = { 
        role: 'assistant', 
        content: 'An error occurred while processing your query. Please check your connection and try again.',
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Query error:', error);
      return { success: false, error: 'An error occurred while processing your query. Please check your connection and try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history
  const clearHistory = () => {
    setMessages([]);
    setError('');
  };

  return {
    messages,
    isLoading,
    error,
    query,
    clearHistory
  };
};

export default useChat;
