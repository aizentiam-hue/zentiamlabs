import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Paperclip } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize chatbot when component mounts
    initializeChatbot();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChatbot = async () => {
    try {
      // Initialize knowledge base
      await axios.post(`${API}/chatbot/init`);
      
      // Create session
      const response = await axios.post(`${API}/chatbot/session`);
      setSessionId(response.data.session_id);
      
      // Add welcome message
      setMessages([
        {
          sender: 'bot',
          text: "Hi! I'm Zentiam's AI assistant. I can help you learn about our AI consulting services, automation solutions, and products. How can I assist you today?",
          timestamp: new Date()
        }
      ]);
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing chatbot:', error);
      setMessages([
        {
          sender: 'bot',
          text: "Hello! I'm having trouble connecting right now. Please try again or contact us at contact@zentiam.com",
          timestamp: new Date()
        }
      ]);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !sessionId || isLoading) return;

    const userMessage = {
      sender: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/chatbot/chat`, {
        session_id: sessionId,
        message: inputMessage
      });

      const botMessage = {
        sender: 'bot',
        text: response.data.response,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        sender: 'bot',
        text: "I apologize, but I'm having trouble responding right now. Please try again.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--text-primary)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            zIndex: 1000
          }}
          className="chat-widget-button"
          aria-label="Open chat"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '380px',
            height: '600px',
            maxHeight: '80vh',
            background: 'var(--bg-card)',
            borderRadius: '1rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1000,
            animation: 'slideUp 0.3s ease'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'var(--text-primary)',
              color: 'white',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--accent-purple-200)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.95)'
                }}
              >
                <MessageCircle size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 500, fontSize: '1rem' }}>Zentiam AI</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Online</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
              aria-label="Close chat"
            >
              <X size={24} />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              background: 'var(--bg-page)'
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    background: msg.sender === 'user' ? 'var(--text-primary)' : 'var(--bg-card)',
                    color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                    padding: '0.75rem 1rem',
                    borderRadius: msg.sender === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                    maxWidth: '75%',
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {msg.text}
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'rgba(255, 255, 255, 0.75)',
                    marginTop: '0.25rem',
                    padding: '0 0.25rem'
                  }}
                >
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Loader2 size={16} className="spin" style={{ color: 'rgba(255, 255, 255, 0.75)' }} />
                <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.75)' }}>Typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '1rem',
              borderTop: '1px solid var(--border-light)',
              background: 'var(--bg-card)'
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={!isInitialized || isLoading}
                rows="1"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '1.5rem',
                  border: '1px solid var(--border-input)',
                  background: 'var(--bg-page)',
                  fontSize: '0.875rem',
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  maxHeight: '100px',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--border-input-focus)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-input)')}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || !isInitialized || isLoading}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: inputMessage.trim() && isInitialized && !isLoading ? 'var(--text-primary)' : 'var(--border-primary)',
                  color: 'white',
                  border: 'none',
                  cursor: inputMessage.trim() && isInitialized && !isLoading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s ease, background 0.2s ease',
                  flexShrink: 0
                }}
                className="send-button"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .chat-widget-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }
        
        .send-button:not(:disabled):hover {
          transform: scale(1.05);
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 480px) {
          .chat-widget-button {
            bottom: 1rem !important;
            right: 1rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;
