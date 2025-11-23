import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { Users, MessageSquare, Mail, TrendingUp } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin/login');
      return;
    }

    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/admin/dashboard`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Total Consultations',
      value: stats?.total_consultations || 0,
      new: stats?.new_consultations || 0,
      icon: Users,
      color: 'var(--accent-purple-200)'
    },
    {
      title: 'Newsletter Subscribers',
      value: stats?.total_subscribers || 0,
      new: stats?.recent_activity?.subscribers || 0,
      icon: Mail,
      color: 'var(--accent-blue-200)'
    },
    {
      title: 'Chat Sessions',
      value: stats?.total_chat_sessions || 0,
      new: stats?.recent_activity?.chats || 0,
      icon: MessageSquare,
      color: 'var(--accent-orange-200)'
    },
    {
      title: 'Weekly Activity',
      value: (stats?.recent_activity?.consultations || 0) + (stats?.recent_activity?.chats || 0),
      new: stats?.recent_activity?.consultations || 0,
      icon: TrendingUp,
      color: 'var(--accent-green-200)'
    }
  ];

  return (
    <AdminLayout>
      <div>
        <h1 className="heading-1" style={{ marginBottom: '0.5rem' }}>
          Dashboard
        </h1>
        <p className="body-medium" style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Welcome to Zentiam Admin Portal
        </p>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}
        >
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                style={{
                  background: stat.color,
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  transition: 'transform 0.2s ease'
                }}
                className="hover-lift"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <Icon size={24} color="var(--text-primary)" />
                  {stat.new > 0 && (
                    <span
                      style={{
                        background: 'var(--text-primary)',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}
                    >
                      +{stat.new} new
                    </span>
                  )}
                </div>
                <div className="heading-hero" style={{ marginBottom: '0.25rem' }}>
                  {stat.value}
                </div>
                <div className="body-small" style={{ color: 'var(--text-secondary)' }}>
                  {stat.title}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div
          style={{
            background: 'var(--bg-card)',
            borderRadius: '0.75rem',
            padding: '2rem',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
          }}
        >
          <h2 className="heading-2" style={{ marginBottom: '1.5rem' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <button
              onClick={() => navigate('/admin/consultations')}
              className="btn-primary button-text"
              style={{ padding: '1rem' }}
            >
              View Consultations
            </button>
            <button
              onClick={() => navigate('/admin/subscribers')}
              className="btn-primary button-text"
              style={{ padding: '1rem' }}
            >
              View Subscribers
            </button>
            <button
              onClick={() => navigate('/admin/chats')}
              className="btn-primary button-text"
              style={{ padding: '1rem' }}
            >
              View Chat Sessions
            </button>
            <button
              onClick={() => navigate('/admin/settings')}
              className="btn-secondary button-text"
              style={{ padding: '1rem' }}
            >
              Settings
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
