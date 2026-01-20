import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { Brain, ThumbsUp, ThumbsDown, TrendingUp, AlertCircle, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const LearningDashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [learningQueue, setLearningQueue] = useState([]);
  const [approvedAnswers, setApprovedAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [newAnswer, setNewAnswer] = useState({ question_pattern: '', approved_answer: '', context_tags: '' });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [metricsRes, queueRes, answersRes] = await Promise.all([
        axios.get(`${API}/admin/learning-metrics`),
        axios.get(`${API}/admin/learning-queue?status=pending`),
        axios.get(`${API}/admin/approved-answers`)
      ]);
      setMetrics(metricsRes.data);
      setLearningQueue(queueRes.data.items || []);
      setApprovedAnswers(answersRes.data.answers || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveItem = async (itemId, improvedAnswer = null) => {
    try {
      await axios.post(`${API}/admin/learning-queue/${itemId}/approve`, null, {
        params: improvedAnswer ? { improved_answer: improvedAnswer } : {}
      });
      setMessage({ type: 'success', text: 'Item approved successfully' });
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to approve item' });
    }
  };

  const handleDismissItem = async (itemId) => {
    try {
      await axios.post(`${API}/admin/learning-queue/${itemId}/dismiss`);
      setMessage({ type: 'success', text: 'Item dismissed' });
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to dismiss item' });
    }
  };

  const handleCreateAnswer = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/admin/approved-answers`, {
        question_pattern: newAnswer.question_pattern,
        approved_answer: newAnswer.approved_answer,
        context_tags: newAnswer.context_tags.split(',').map(t => t.trim()).filter(t => t)
      });
      setMessage({ type: 'success', text: 'Approved answer created' });
      setNewAnswer({ question_pattern: '', approved_answer: '', context_tags: '' });
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create answer' });
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm('Are you sure you want to delete this approved answer?')) return;
    try {
      await axios.delete(`${API}/admin/approved-answers/${answerId}`);
      setMessage({ type: 'success', text: 'Answer deleted' });
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete answer' });
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '0.75rem',
      padding: '1.25rem',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <Icon size={20} color={color} />
        <span className="body-small" style={{ color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <p style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{value}</p>
      {subtext && <p className="body-small" style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{subtext}</p>}
    </div>
  );

  return (
    <AdminLayout>
      <div>
        <h1 className="heading-1" style={{ marginBottom: '0.5rem' }}>Learning Dashboard</h1>
        <p className="body-medium" style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          Track feedback, review responses, and improve Zia's knowledge
        </p>

        {message && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: message.type === 'success' ? '#22c55e' : '#ef4444'
          }}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-primary)', paddingBottom: '0.5rem' }}>
          {['overview', 'review', 'answers'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.5rem 1rem',
                background: activeTab === tab ? 'var(--accent-blue)' : 'transparent',
                color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'review' ? 'Review Queue' : tab === 'answers' ? 'Approved Answers' : tab}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="body-medium" style={{ color: 'var(--text-muted)' }}>Loading...</p>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && metrics && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <StatCard icon={MessageSquare} label="Total Feedback" value={metrics.summary.total_feedback} color="var(--accent-blue)" />
                  <StatCard icon={ThumbsUp} label="Positive" value={metrics.summary.positive_feedback} color="#22c55e" />
                  <StatCard icon={ThumbsDown} label="Negative" value={metrics.summary.negative_feedback} color="#ef4444" />
                  <StatCard icon={TrendingUp} label="Satisfaction" value={`${metrics.summary.satisfaction_rate}%`} color="#8b5cf6" subtext={`${metrics.summary.weekly_satisfaction_rate}% this week`} />
                  <StatCard icon={Clock} label="Pending Reviews" value={metrics.summary.pending_reviews} color="#f59e0b" />
                  <StatCard icon={CheckCircle} label="Approved Answers" value={metrics.summary.total_approved_answers} color="#22c55e" />
                </div>

                {/* Trend Chart Placeholder */}
                {metrics.trend_data && metrics.trend_data.length > 0 && (
                  <div style={{ background: 'var(--bg-card)', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
                    <h3 className="heading-3" style={{ marginBottom: '1rem' }}>7-Day Feedback Trend</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '120px' }}>
                      {metrics.trend_data.map((day, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '2px' }}>
                            <div style={{ height: `${Math.max(day.positive * 10, 4)}px`, background: '#22c55e', borderRadius: '2px 2px 0 0' }} title={`${day.positive} positive`} />
                            <div style={{ height: `${Math.max(day.negative * 10, 4)}px`, background: '#ef4444', borderRadius: '0 0 2px 2px' }} title={`${day.negative} negative`} />
                          </div>
                          <span className="body-small" style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.7rem' }}>
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top Unanswered Questions */}
                {metrics.top_unanswered_questions && metrics.top_unanswered_questions.length > 0 && (
                  <div style={{ background: 'var(--bg-card)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                    <h3 className="heading-3" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertCircle size={18} color="#f59e0b" /> Top Questions Needing Improvement
                    </h3>
                    <div>
                      {metrics.top_unanswered_questions.map((q, i) => (
                        <div key={i} style={{ padding: '0.75rem', borderBottom: i < metrics.top_unanswered_questions.length - 1 ? '1px solid var(--border-primary)' : 'none', display: 'flex', justifyContent: 'space-between' }}>
                          <span className="body-medium">{q.question}</span>
                          <span className="body-small" style={{ color: 'var(--text-muted)' }}>{q.count} reports</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Review Queue Tab */}
            {activeTab === 'review' && (
              <div style={{ background: 'var(--bg-card)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                <h3 className="heading-3" style={{ marginBottom: '1rem' }}>Pending Reviews ({learningQueue.length})</h3>
                {learningQueue.length === 0 ? (
                  <p className="body-medium" style={{ color: 'var(--text-muted)' }}>No items pending review</p>
                ) : (
                  <div>
                    {learningQueue.map((item) => (
                      <div key={item.id} style={{ padding: '1rem', marginBottom: '1rem', background: 'var(--bg-section)', borderRadius: '0.5rem' }}>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <p className="body-small" style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>User Question:</p>
                          <p className="body-medium">{item.user_question}</p>
                        </div>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <p className="body-small" style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Bot Response:</p>
                          <p className="body-medium" style={{ color: '#ef4444' }}>{item.bot_response?.substring(0, 200)}...</p>
                        </div>
                        {item.detailed_feedback && (
                          <div style={{ marginBottom: '0.75rem' }}>
                            <p className="body-small" style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>User Feedback:</p>
                            <p className="body-medium" style={{ fontStyle: 'italic' }}>"{item.detailed_feedback}"</p>
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleApproveItem(item.id)} style={{ padding: '0.5rem 1rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                            Approve
                          </button>
                          <button onClick={() => handleDismissItem(item.id)} style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: '0.25rem', cursor: 'pointer' }}>
                            Dismiss
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Approved Answers Tab */}
            {activeTab === 'answers' && (
              <>
                {/* Create New Answer */}
                <div style={{ background: 'var(--bg-card)', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h3 className="heading-3" style={{ marginBottom: '1rem' }}>Create Approved Answer</h3>
                  <form onSubmit={handleCreateAnswer}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem' }}>Question Pattern</label>
                      <input
                        type="text"
                        value={newAnswer.question_pattern}
                        onChange={(e) => setNewAnswer({ ...newAnswer, question_pattern: e.target.value })}
                        placeholder="e.g., What is your pricing?"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', background: 'var(--bg-section)', color: 'var(--text-primary)' }}
                        required
                      />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem' }}>Approved Answer</label>
                      <textarea
                        value={newAnswer.approved_answer}
                        onChange={(e) => setNewAnswer({ ...newAnswer, approved_answer: e.target.value })}
                        placeholder="The ideal response for this question..."
                        style={{ width: '100%', minHeight: '100px', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', background: 'var(--bg-section)', color: 'var(--text-primary)' }}
                        required
                      />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem' }}>Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={newAnswer.context_tags}
                        onChange={(e) => setNewAnswer({ ...newAnswer, context_tags: e.target.value })}
                        placeholder="e.g., pricing, sales, faq"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db', background: 'var(--bg-section)', color: 'var(--text-primary)' }}
                      />
                    </div>
                    <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
                      Save Answer
                    </button>
                  </form>
                </div>

                {/* Existing Answers */}
                <div style={{ background: 'var(--bg-card)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                  <h3 className="heading-3" style={{ marginBottom: '1rem' }}>Approved Answers ({approvedAnswers.length})</h3>
                  {approvedAnswers.length === 0 ? (
                    <p className="body-medium" style={{ color: 'var(--text-muted)' }}>No approved answers yet</p>
                  ) : (
                    <div>
                      {approvedAnswers.map((answer) => (
                        <div key={answer.id} style={{ padding: '1rem', marginBottom: '1rem', background: 'var(--bg-section)', borderRadius: '0.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <p className="body-medium" style={{ fontWeight: 500 }}>{answer.question_pattern}</p>
                            <button onClick={() => handleDeleteAnswer(answer.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>
                              Delete
                            </button>
                          </div>
                          <p className="body-small" style={{ color: '#6b7280', marginBottom: '0.5rem' }}>{answer.approved_answer?.substring(0, 150)}...</p>
                          {answer.context_tags?.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                              {answer.context_tags.map((tag, i) => (
                                <span key={i} style={{ padding: '0.125rem 0.5rem', background: 'var(--accent-blue-200)', borderRadius: '1rem', fontSize: '0.75rem' }}>{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default LearningDashboard;
