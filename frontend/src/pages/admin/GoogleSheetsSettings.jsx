import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { FileSpreadsheet, Check, X, RefreshCw, Link, Clock, Database } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const GoogleSheetsSettings = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [configuring, setConfiguring] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [credentials, setCredentials] = useState('');
  const [spreadsheetUrl, setSpreadsheetUrl] = useState('');
  const [recentLogs, setRecentLogs] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin/login');
      return;
    }
    fetchStatus();
    fetchRecentLogs();
  }, [navigate]);

  const fetchStatus = async () => {
    try {
      const response = await axios.get(`${API}/admin/sheets/status`);
      setStatus(response.data);
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentLogs = async () => {
    try {
      const response = await axios.get(`${API}/admin/sheets/recent-logs?limit=5`);
      setRecentLogs(response.data.logs || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleConfigure = async (e) => {
    e.preventDefault();
    setConfiguring(true);
    setMessage(null);

    try {
      await axios.post(`${API}/admin/sheets/configure`, {
        credentials_json: credentials,
        spreadsheet_id: spreadsheetUrl
      });
      setMessage({ type: 'success', text: 'Google Sheets configured successfully!' });
      setCredentials('');
      fetchStatus();
      fetchRecentLogs();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Configuration failed' });
    } finally {
      setConfiguring(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setMessage(null);

    try {
      const response = await axios.post(`${API}/admin/sheets/sync`);
      setMessage({ 
        type: 'success', 
        text: `Synced ${response.data.synced_count} sessions to Google Sheets` 
      });
      fetchStatus();
      fetchRecentLogs();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Sync failed' });
    } finally {
      setSyncing(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      const response = await axios.post(`${API}/admin/sheets/test-connection`);
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Connection successful!' });
      } else {
        setMessage({ type: 'error', text: response.data.error || 'Connection failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Connection test failed' });
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="heading-1" style={{ marginBottom: '0.5rem' }}>Google Sheets Integration</h1>
        <p className="body-medium" style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Automatically log chat sessions to Google Sheets for easy tracking and analysis
        </p>

        {message && (
          <div style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: message.type === 'success' ? '#22c55e' : '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {message.type === 'success' ? <Check size={18} /> : <X size={18} />}
            {message.text}
          </div>
        )}

        {/* Status Card */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <FileSpreadsheet size={24} color="var(--accent-green)" />
            <h2 className="heading-3">Connection Status</h2>
          </div>

          {loading ? (
            <p className="body-small" style={{ color: 'var(--text-muted)' }}>Loading...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-section)', borderRadius: '0.5rem' }}>
                <p className="body-small" style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Status</p>
                <p className="body-medium" style={{ 
                  color: status?.connected ? '#22c55e' : status?.configured ? '#f59e0b' : '#ef4444',
                  fontWeight: 500
                }}>
                  {status?.connected ? '✓ Connected' : status?.configured ? '⚠ Configured but not connected' : '✗ Not configured'}
                </p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-section)', borderRadius: '0.5rem' }}>
                <p className="body-small" style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Synced</p>
                <p className="body-medium" style={{ fontWeight: 500 }}>{status?.total_synced || 0} sessions</p>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-section)', borderRadius: '0.5rem' }}>
                <p className="body-small" style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Last Sync</p>
                <p className="body-medium" style={{ fontWeight: 500 }}>
                  {status?.last_sync ? new Date(status.last_sync).toLocaleString() : 'Never'}
                </p>
              </div>
            </div>
          )}

          {status?.configured && (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleSync}
                disabled={syncing}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: syncing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: syncing ? 0.7 : 1,
                  fontWeight: 500
                }}
              >
                <RefreshCw size={16} className={syncing ? 'spin' : ''} />
                {syncing ? 'Syncing...' : 'Sync Now'}
              </button>
              <button
                onClick={handleTestConnection}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Test Connection
              </button>
            </div>
          )}
        </div>

        {/* Configuration Form */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
        }}>
          <h2 className="heading-3" style={{ marginBottom: '1rem' }}>
            {status?.configured ? 'Update Configuration' : 'Configure Google Sheets'}
          </h2>

          <form onSubmit={handleConfigure}>
            <div style={{ marginBottom: '1rem' }}>
              <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Service Account Credentials (JSON)
              </label>
              <textarea
                value={credentials}
                onChange={(e) => setCredentials(e.target.value)}
                placeholder='Paste your service account JSON here...'
                style={{
                  width: '100%',
                  minHeight: '150px',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border-primary)',
                  background: 'var(--bg-section)',
                  color: 'var(--text-primary)',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  resize: 'vertical'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Google Sheet URL
              </label>
              <input
                type="text"
                value={spreadsheetUrl}
                onChange={(e) => setSpreadsheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border-primary)',
                  background: 'var(--bg-section)',
                  color: 'var(--text-primary)'
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={configuring}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: configuring ? 'not-allowed' : 'pointer',
                opacity: configuring ? 0.7 : 1,
                fontWeight: 500
              }}
            >
              {configuring ? 'Configuring...' : 'Save Configuration'}
            </button>
          </form>
        </div>

        {/* Recent Logs */}
        {recentLogs.length > 0 && (
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
          }}>
            <h2 className="heading-3" style={{ marginBottom: '1rem' }}>Recent Synced Sessions</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--border-primary)', color: 'var(--text-muted)' }}>Timestamp</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--border-primary)', color: 'var(--text-muted)' }}>User</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--border-primary)', color: 'var(--text-muted)' }}>Topics</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '1px solid var(--border-primary)', color: 'var(--text-muted)' }}>Messages</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.map((log, index) => (
                    <tr key={index}>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-primary)' }}>{log.Timestamp}</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-primary)' }}>{log['User Name'] || 'Anonymous'}</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-primary)' }}>{log['Topics Discussed']}</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-primary)' }}>{log['Message Count']}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default GoogleSheetsSettings;
