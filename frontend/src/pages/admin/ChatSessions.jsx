import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { Download, MessageSquare, User } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ChatSessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin/login');
      return;
    }
    fetchSessions();
  }, [navigate]);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${API}/chatbot/sessions`);
      setSessions(response.data.sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewSession = async (sessionId) => {
    try {
      const response = await axios.get(`${API}/chatbot/session/${sessionId}`);
      setSelectedSession(response.data);
    } catch (error) {
      console.error('Error fetching session:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Messages', 'Answered', 'Unanswered'];
    const rows = sessions.map(s => [
      new Date(s.created_at).toLocaleDateString(),
      s.user_name || 'Anonymous',
      s.user_email || 'N/A',
      s.user_phone || 'N/A',
      s.messages?.length || 0,
      s.answered_questions?.length || 0,
      s.unanswered_questions?.length || 0
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-sessions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <AdminLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 className="heading-1" style={{ marginBottom: '0.5rem' }}>Chat Sessions</h1>
            <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
              {sessions.length} total sessions
            </p>
          </div>
          <button onClick={exportToCSV} className="btn-primary button-text" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: selectedSession ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
            {/* Sessions List */}
            <div>
              {sessions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No chat sessions found</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {sessions.map((session) => (
                    <div
                      key={session.session_id}
                      onClick={() => viewSession(session.session_id)}
                      style={{
                        background: 'var(--bg-card)',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        cursor: 'pointer',
                        border: selectedSession?.session_id === session.session_id ? '2px solid var(--text-primary)' : '2px solid transparent',
                        transition: 'all 0.2s ease'
                      }}
                      className="hover-lift"
                    >
                      <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'var(--accent-purple-200)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <User size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p className="body-medium" style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                            {session.user_name || 'Anonymous User'}
                          </p>
                          <p className="body-small" style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            {session.user_email || 'No email provided'}
                          </p>
                          <p className="caption" style={{ color: 'var(--text-muted)' }}>
                            {session.messages?.length || 0} messages • {new Date(session.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Session Details */}
            {selectedSession && (
              <div
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                  maxHeight: '80vh',
                  overflowY: 'auto'
                }}
              >
                <h3 className="heading-3" style={{ marginBottom: '1rem' }}>Conversation Details</h3>
                
                {/* User Info */}
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-section)', borderRadius: '0.5rem' }}>
                  <p className="body-small" style={{ marginBottom: '0.5rem' }}>
                    <strong>Name:</strong> {selectedSession.user_name || 'N/A'}
                  </p>
                  <p className="body-small" style={{ marginBottom: '0.5rem' }}>
                    <strong>Email:</strong> {selectedSession.user_email || 'N/A'}
                  </p>
                  <p className="body-small">
                    <strong>Phone:</strong> {selectedSession.user_phone || 'N/A'}
                  </p>
                </div>

                {/* Messages */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedSession.messages?.map((msg, index) => (
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
                          background: msg.sender === 'user' ? 'var(--text-primary)' : 'var(--bg-section)',
                          color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                          padding: '0.75rem 1rem',
                          borderRadius: msg.sender === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                          maxWidth: '80%',
                          fontSize: '0.875rem'
                        }}
                      >
                        {msg.message}
                      </div>
                      <span className="caption" style={{ marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Questions Summary */}
                {(selectedSession.answered_questions?.length > 0 || selectedSession.unanswered_questions?.length > 0) && (
                  <div style={{ marginTop: '1.5rem' }}>
                    {selectedSession.answered_questions?.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        <h4 className="body-small" style={{ fontWeight: 500, marginBottom: '0.5rem', color: 'var(--accent-green-200)' }}>
                          Answered Questions ({selectedSession.answered_questions.length})
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {selectedSession.answered_questions.map((q, i) => (
                            <li key={i} style={{ marginBottom: '0.25rem' }}>• {q}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedSession.unanswered_questions?.length > 0 && (
                      <div>
                        <h4 className="body-small" style={{ fontWeight: 500, marginBottom: '0.5rem', color: 'var(--accent-orange-200)' }}>
                          Unanswered Questions ({selectedSession.unanswered_questions.length})
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {selectedSession.unanswered_questions.map((q, i) => (
                            <li key={i} style={{ marginBottom: '0.25rem' }}>• {q}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ChatSessions;
