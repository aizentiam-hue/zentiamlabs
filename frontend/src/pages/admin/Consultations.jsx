import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { Download, Eye, Check } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Consultations = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin/login');
      return;
    }
    fetchConsultations();
  }, [navigate, filter]);

  const fetchConsultations = async () => {
    try {
      const url = filter === 'all' ? `${API}/contact/consultations` : `${API}/contact/consultations?status=${filter}`;
      const response = await axios.get(url);
      setConsultations(response.data.consultations);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/contact/consultations/${id}/status?status=${status}`);
      fetchConsultations();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Name', 'Email', 'Company', 'Phone', 'Service', 'Message', 'Status'];
    const rows = consultations.map(c => [
      new Date(c.created_at).toLocaleDateString(),
      c.name,
      c.email,
      c.company,
      c.phone,
      c.service,
      c.message,
      c.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <AdminLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 className="heading-1" style={{ marginBottom: '0.5rem' }}>Consultation Requests</h1>
            <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
              {consultations.length} total requests
            </p>
          </div>
          <button onClick={exportToCSV} className="btn-primary button-text" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
          {['all', 'new', 'contacted', 'closed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={filter === status ? 'btn-primary' : 'btn-secondary'}
              style={{ textTransform: 'capitalize', padding: '0.5rem 1rem' }}
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
        ) : consultations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No consultations found</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {consultations.map((consultation) => (
              <div
                key={consultation.created_at}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h3 className="heading-3" style={{ marginBottom: '0.25rem' }}>{consultation.name}</h3>
                    <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
                      {consultation.email} • {consultation.phone}
                    </p>
                  </div>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      background: consultation.status === 'new' ? 'var(--accent-orange-200)' : consultation.status === 'contacted' ? 'var(--accent-blue-200)' : 'var(--accent-green-200)'
                    }}
                  >
                    {consultation.status}
                  </span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <p className="body-small" style={{ marginBottom: '0.5rem' }}>
                    <strong>Company:</strong> {consultation.company || 'N/A'}
                  </p>
                  <p className="body-small" style={{ marginBottom: '0.5rem' }}>
                    <strong>Service:</strong> {consultation.service}
                  </p>
                  <p className="body-small" style={{ marginBottom: '0.5rem' }}>
                    <strong>Date:</strong> {new Date(consultation.created_at).toLocaleString()}
                  </p>
                  <p className="body-small">
                    <strong>Message:</strong> {consultation.message}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {consultation.status === 'new' && (
                    <button
                      onClick={() => updateStatus(consultation._id, 'contacted')}
                      className="btn-primary"
                      style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                    >
                      Mark as Contacted
                    </button>
                  )}
                  {consultation.status === 'contacted' && (
                    <button
                      onClick={() => updateStatus(consultation._id, 'closed')}
                      className="btn-primary"
                      style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                    >
                      Mark as Closed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Consultations;
