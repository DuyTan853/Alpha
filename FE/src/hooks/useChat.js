import { useState } from 'react';
import axios from 'axios';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async (messageText) => {
    const userMsg = { role: 'user', content: messageText };
    
    setMessages(prev => [...prev, userMsg]);
    setError('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role === 'bot' ? 'assistant' : msg.role,
        content: msg.content
      }));

      const res = await axios.post('http://localhost:8000/chat', {
        message: messageText,
        messages: conversationHistory
      });

      const botMsg = { role: 'bot', content: res.data.response };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (error) => {
    if (error.response?.status === 503) {
      return 'AI service is currently unavailable. Please check if Ollama is running.';
    } else if (error.response?.status === 504) {
      return 'Request timed out. The AI might be processing a complex request.';
    } else if (error.code === 'ECONNREFUSED') {
      return 'Cannot connect to the chat server. Please check if the backend is running.';
    }
    return 'Sorry, something went wrong. Please try again.';
  };

  const clearChat = () => {
    setMessages([]);
    setError('');
  };

  const dismissError = () => {
    setError('');
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    dismissError
  };
}