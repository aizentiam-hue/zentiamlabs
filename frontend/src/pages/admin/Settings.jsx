import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { Mail, Key, Save, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Settings = () => {
  const navigate = useNavigate();
  const [emailConfig, setEmailConfig] = useState({
    provider: 'resend',
    apiKey: '',
    fromEmail: 'noreply@zentiam.com',
    fromName: 'Zentiam'
  });
  const [saved, setSaved] = useState(false);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin/login');
      return;
    }
    loadSettings();
  }, [navigate]);

  const loadSettings = async () => {
    try {
      const response = await axios.get(`${API}/admin/settings`);
      if (response.data.email_config) {
        setEmailConfig(response.data.email_config);
      }
      if (response.data.google_sheet_url) {
        setGoogleSheetUrl(response.data.google_sheet_url);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveEmail = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/admin/settings/email`, emailConfig);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving email settings:', error);
      alert('Failed to save settings');
    }
  };

  const handleSaveSheet = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/admin/settings/google-sheet`, { url: googleSheetUrl });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving sheet URL:', error);
      alert('Failed to save settings');
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="heading-1" style={{ marginBottom: '0.5rem' }}>Settings</h1>
        <p className="body-medium" style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Configure email notifications and integrations
        </p>

        {saved && (
          <div
            style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              borderRadius: '0.5rem',
              background: 'var(--accent-green-200)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <CheckCircle size={20} />
            <p className="body-small">Settings saved successfully!</p>
          </div>
        )}

        {/* Email Configuration */}
        <div
          style={{
            background: 'var(--bg-card)',
            borderRadius: '0.75rem',
            padding: '2rem',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Mail size={24} />
            <h2 className="heading-2">Email Configuration</h2>
          </div>

          <form onSubmit={handleSaveEmail}>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Email Provider
                </label>
                <select
                  value={emailConfig.provider}
                  onChange={(e) => setEmailConfig({ ...emailConfig, provider: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-input)',
                    background: 'var(--bg-page)',
                    fontSize: '1rem'
                  }}
                >
                  <option value="resend">Resend</option>
                  <option value="smtp">SMTP (Gmail/Outlook)</option>
                </select>
              </div>

              <div>
                <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  API Key / Password
                </label>
                <input
                  type="password"
                  value={emailConfig.apiKey}
                  onChange={(e) => setEmailConfig({ ...emailConfig, apiKey: e.target.value })}
                  placeholder="Enter your Resend API key or SMTP password"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-input)',
                    background: 'var(--bg-page)',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    From Email
                  </label>
                  <input
                    type="email"
                    value={emailConfig.fromEmail}
                    onChange={(e) => setEmailConfig({ ...emailConfig, fromEmail: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border-input)',
                      background: 'var(--bg-page)',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    From Name
                  </label>
                  <input
                    type="text"
                    value={emailConfig.fromName}
                    onChange={(e) => setEmailConfig({ ...emailConfig, fromName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border-input)',
                      background: 'var(--bg-page)',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary button-text" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <Save size={16} />
                Save Email Settings
              </button>
            </div>
          </form>

          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'var(--accent-blue-200)',
              borderRadius: '0.5rem'
            }}
          >
            <p className="body-small">
              <strong>Note:</strong> Automated emails will be sent for consultation confirmations, newsletter welcomes, and chatbot follow-ups.
            </p>
          </div>
        </div>

        {/* Google Sheets Integration */}
        <div
          style={{
            background: 'var(--bg-card)',
            borderRadius: '0.75rem',
            padding: '2rem',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Key size={24} />
            <h2 className="heading-2">Google Sheets Integration</h2>
          </div>

          <form onSubmit={handleSaveSheet}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Google Sheet URL
              </label>
              <input
                type="url"
                value={googleSheetUrl}
                onChange={(e) => setGoogleSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border-input)',
                  background: 'var(--bg-page)',
                  fontSize: '1rem'
                }}
              />
            </div>

            <button type="submit" className="btn-primary button-text" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <Save size={16} />
              Save Sheet URL
            </button>
          </form>

          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'var(--accent-purple-200)',
              borderRadius: '0.5rem'
            }}
          >
            <p className="body-small">
              <strong>Coming Soon:</strong> Full OAuth integration for automatic Google Sheets sync. 
              For now, use the Export CSV buttons on each page.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
