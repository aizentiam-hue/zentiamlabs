import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Secure admin password - Keep this confidential
    const ADMIN_PASSWORD = 'MHeGIYH9u#gqztsB';
    
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('adminAuth', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-page)'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '2rem',
          background: 'var(--bg-card)',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 1rem',
              background: 'var(--text-primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            <Lock size={28} />
          </div>
          <h2 className="heading-2">Admin Portal</h2>
          <p className="body-small" style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Zentiam Management System
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter admin password"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-input)',
                background: 'var(--bg-page)',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>

          {error && (
            <div
              style={{
                padding: '0.75rem',
                background: '#fee',
                color: '#c00',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}
            >
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary button-text" style={{ width: '100%' }}>
            Login to Admin
          </button>
        </form>

        <p className="caption" style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Default password: zentiam2025
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
