import React, { useState, useRef, useEffect } from 'react';
import api from '../utils/auth';
import { useTheme } from '../contexts/ThemeContext';

export default function Chat() {
  const { classes } = useTheme();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI mental health assistant. I'm here to listen and provide support. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/api/chat', { message: userMessage.content });
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: res.data.reply || "I'm here to help, but I'm having trouble responding right now. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setLoading(false);
    inputRef.current?.focus();
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const quickPrompts = [
    "I'm feeling anxious today",
    "How can I manage stress?",
    "I need motivation",
    "Help me with sleep issues"
  ];

  const handleQuickPrompt = (prompt) => {
    setMessage(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 ${classes.transition} h-[calc(100vh-12rem)]`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white text-2xl mb-4">
          🤖
        </div>
        <h1 className={`text-3xl font-bold ${classes.textPrimary} mb-2`}>AI Mental Health Assistant</h1>
        <p className={`text-lg ${classes.textSecondary}`}>
          A safe space to share your thoughts and get personalized support.
        </p>
      </div>

      {/* Chat Container */}
      <div className={`${classes.card} flex flex-col h-[600px]`}>
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${classes.transition} ${
                  msg.type === 'user'
                    ? `bg-blue-500 text-white ml-12`
                    : `${classes.bgSecondary} ${classes.textPrimary} mr-12`
                }`}
              >
                {msg.type === 'ai' && (
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs mr-2">
                      AI
                    </div>
                    <span className={`text-xs ${classes.textMuted}`}>Assistant</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                <div className={`text-xs mt-2 opacity-70 ${
                  msg.type === 'user' ? 'text-blue-100' : classes.textMuted
                }`}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 mr-12 ${classes.bgSecondary}`}>
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs mr-2">
                    AI
                  </div>
                  <span className={`text-xs ${classes.textMuted}`}>Assistant</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <span className={`text-sm ${classes.textMuted} ml-2`}>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className="px-6 py-4 border-t border-[var(--border-primary)]">
            <p className={`text-sm ${classes.textSecondary} mb-3`}>Quick prompts to get started:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt)}
                  className={`px-3 py-2 text-sm rounded-lg ${classes.bgSecondary} ${classes.textSecondary} ${classes.hover} ${classes.transition} border border-[var(--border-primary)]`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={sendMessage} className="p-6 border-t border-[var(--border-primary)]">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts, feelings, or ask for support..."
                rows={1}
                disabled={loading}
                className={`w-full px-4 py-3 rounded-lg resize-none ${classes.input} ${classes.transition} max-h-32`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(e);
                  }
                }}
                style={{
                  minHeight: '48px',
                  height: 'auto',
                  lineHeight: '1.5'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!message.trim() || loading}
              className={`px-6 py-3 rounded-lg font-semibold ${classes.transition} flex items-center justify-center min-w-[100px] ${
                message.trim() && !loading
                  ? `${classes.button} hover:shadow-lg transform hover:scale-105`
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send
                </>
              )}
            </button>
          </div>
          <p className={`text-xs ${classes.textMuted} mt-2`}>
            Press Enter to send, Shift+Enter for new line
          </p>
        </form>
      </div>
      
      {/* Disclaimer */}
      <div className={`mt-4 p-4 rounded-lg ${classes.bgSecondary} border border-[var(--border-primary)]`}>
        <p className={`text-xs ${classes.textMuted} text-center`}>
          ⚠️ <strong>Important:</strong> This AI assistant provides general mental health support and information. 
          It is not a substitute for professional medical advice, diagnosis, or treatment. 
          If you're experiencing a mental health emergency, please contact a healthcare professional or crisis hotline immediately.
        </p>
      </div>
    </div>
  );
}