import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { Download, Mail } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Subscribers = () => {
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin/login');
      return;
    }
    fetchSubscribers();
  }, [navigate]);

  const fetchSubscribers = async () => {
    try {
      const response = await axios.get(`${API}/contact/newsletter/subscribers`);
      setSubscribers(response.data.subscribers);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Email', 'Subscribed Date', 'Status'];
    const rows = subscribers.map(s => [
      s.email,
      new Date(s.subscribed_at).toLocaleDateString(),
      s.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <AdminLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 className="heading-1" style={{ marginBottom: '0.5rem' }}>Newsletter Subscribers</h1>
            <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
              {subscribers.length} active subscribers
            </p>
          </div>
          <button onClick={exportToCSV} className="btn-primary button-text" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
        ) : subscribers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No subscribers found</div>
        ) : (
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
            }}
          >
            <div style={{ display: 'grid', gap: '1rem' }}>
              {subscribers.map((subscriber, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'var(--bg-section)',
                    borderRadius: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'var(--accent-blue-200)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="body-medium" style={{ fontWeight: 500 }}>{subscriber.email}</p>
                      <p className="caption" style={{ color: 'var(--text-muted)' }}>
                        Subscribed: {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      background: 'var(--accent-green-200)'
                    }}
                  >
                    {subscriber.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Subscribers;
