import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Loader2, ThumbsUp, ThumbsDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : 'http://localhost:8001/api';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);  // Add ref for input

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializeChat = async () => {
      if (!sessionId) {
        try {
          // Initialize chatbot
          await axios.post(`${API}/chatbot/init`);
          
          // Create session
          const response = await axios.post(`${API}/chatbot/session`);
          setSessionId(response.data.session_id);
          
          // Set welcome message
          const welcomeMessage = {
            sender: 'bot',
            text: "Hey there! 👋 I'm Zia, your AI assistant at Zentiam. I'm here to help you explore our AI consulting services, automation solutions, and products. What brings you here today?",
            timestamp: new Date()
          };
          setMessages([welcomeMessage]);
          setIsInitialized(true);
        } catch (error) {
          console.error('Error initializing chat:', error);
          const errorMessage = {
            sender: 'bot',
            text: "Hello! I'm having trouble connecting right now. Please try again or contact us at ai.zentiam@gmail.com",
            timestamp: new Date()
          };
          setMessages([errorMessage]);
        }
      }
      
      setIsInitialized(true);
    };

    if (isOpen) {
      initializeChat();
    }
  }, [isOpen, sessionId]);

  // Focus input when chat opens or after sending message
  useEffect(() => {
    if (isOpen && inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isOpen, isLoading, messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return;

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
      // Focus will be restored by the useEffect above
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFeedback = async (messageIndex, feedbackType) => {
    if (feedbackGiven[messageIndex]) return;
    
    try {
      await axios.post(`${API}/chatbot/feedback`, {
        session_id: sessionId,
        message_index: messageIndex,
        feedback_type: feedbackType
      });
      setFeedbackGiven(prev => ({ ...prev, [messageIndex]: feedbackType }));
    } catch (error) {
      console.error('Error submitting feedback:', error);
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
            background: '#1a1a2e',
            borderRadius: '1rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
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
              padding: '1rem',
              background: '#9333ea',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Zia</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>Zentiam AI Assistant</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center'
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
              gap: '0.75rem'
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '0.75rem 1rem',
                    borderRadius: msg.sender === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                    background: msg.sender === 'user' ? '#9333ea' : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    wordWrap: 'break-word'
                  }}
                  className={msg.sender === 'bot' ? 'chat-markdown' : ''}
                >
                  {msg.sender === 'bot' ? (
                    <ReactMarkdown
                      components={{
                        p: ({children}) => <p style={{margin: '0 0 0.5rem 0'}}>{children}</p>,
                        ul: ({children}) => <ul style={{margin: '0.5rem 0', paddingLeft: '1.25rem'}}>{children}</ul>,
                        ol: ({children}) => <ol style={{margin: '0.5rem 0', paddingLeft: '1.25rem'}}>{children}</ol>,
                        li: ({children}) => <li style={{margin: '0.25rem 0'}}>{children}</li>,
                        strong: ({children}) => <strong style={{fontWeight: '600'}}>{children}</strong>,
                        em: ({children}) => <em>{children}</em>,
                        h1: ({children}) => <h1 style={{fontSize: '1.1rem', fontWeight: '600', margin: '0.5rem 0'}}>{children}</h1>,
                        h2: ({children}) => <h2 style={{fontSize: '1rem', fontWeight: '600', margin: '0.5rem 0'}}>{children}</h2>,
                        h3: ({children}) => <h3 style={{fontSize: '0.95rem', fontWeight: '600', margin: '0.5rem 0'}}>{children}</h3>,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
                {/* Feedback buttons for bot messages */}
                {msg.sender === 'bot' && index > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => handleFeedback(index, 'positive')}
                      disabled={feedbackGiven[index]}
                      style={{
                        background: feedbackGiven[index] === 'positive' ? 'rgba(34, 197, 94, 0.2)' : 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '0.25rem',
                        padding: '0.25rem 0.5rem',
                        cursor: feedbackGiven[index] ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        opacity: feedbackGiven[index] && feedbackGiven[index] !== 'positive' ? 0.3 : 1
                      }}
                      title="Helpful"
                    >
                      <ThumbsUp size={12} color={feedbackGiven[index] === 'positive' ? '#22c55e' : 'rgba(255,255,255,0.6)'} />
                    </button>
                    <button
                      onClick={() => handleFeedback(index, 'negative')}
                      disabled={feedbackGiven[index]}
                      style={{
                        background: feedbackGiven[index] === 'negative' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '0.25rem',
                        padding: '0.25rem 0.5rem',
                        cursor: feedbackGiven[index] ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        opacity: feedbackGiven[index] && feedbackGiven[index] !== 'negative' ? 0.3 : 1
                      }}
                      title="Not helpful"
                    >
                      <ThumbsDown size={12} color={feedbackGiven[index] === 'negative' ? '#ef4444' : 'rgba(255,255,255,0.6)'} />
                    </button>
                  </div>
                )}
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
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              background: '#1a1a2e'
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
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
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  fontSize: '0.875rem',
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  color: 'white',
                  maxHeight: '100px'
                }}
                placeholder="Type your message..."
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || !isInitialized || isLoading}
                style={{
                  padding: '0.75rem',
                  borderRadius: '50%',
                  border: 'none',
                  background: inputMessage.trim() && isInitialized && !isLoading ? '#9333ea' : 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  cursor: inputMessage.trim() && isInitialized && !isLoading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s ease'
                }}
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatWidget;
