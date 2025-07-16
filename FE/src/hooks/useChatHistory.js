import { useState, useEffect } from 'react';

export function useChatHistory() {
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveChatHistory = (newHistory) => {
    setChatHistory(newHistory);
    localStorage.setItem('chatHistory', JSON.stringify(newHistory));
  };

  const addChat = (chatData) => {
    const newChat = {
      id: Date.now().toString(),
      title: chatData.title || `Chat ${chatHistory.length + 1}`,
      messages: chatData.messages || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: chatData.messages?.length || 0
    };
    
    const newHistory = [newChat, ...chatHistory];
    saveChatHistory(newHistory);
    return newChat.id;
  };

  const updateChat = (chatId, updates) => {
    const newHistory = chatHistory.map(chat => 
      chat.id === chatId ? { ...chat, ...updates, updatedAt: new Date().toISOString() } : chat
    );
    saveChatHistory(newHistory);
  };

  const deleteChat = (chatId) => {
    const newHistory = chatHistory.filter(chat => chat.id !== chatId);
    saveChatHistory(newHistory);
  };

  const getChatById = (chatId) => {
    return chatHistory.find(chat => chat.id === chatId);
  };

  const searchChats = (searchTerm) => {
    return chatHistory.filter(chat =>
      chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.messages.some(msg => 
        msg.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  return {
    chatHistory,
    addChat,
    updateChat,
    deleteChat,
    getChatById,
    searchChats
  };
}