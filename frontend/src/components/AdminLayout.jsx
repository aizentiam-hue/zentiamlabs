import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Mail, MessageSquare, Settings, Upload, LogOut, Search, FileText, FileSpreadsheet, Brain } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/consultations', label: 'Consultations', icon: Users },
    { path: '/admin/subscribers', label: 'Subscribers', icon: Mail },
    { path: '/admin/chats', label: 'Chat Sessions', icon: MessageSquare },
    { path: '/admin/learning', label: 'Learning', icon: Brain },
    { path: '/admin/documents', label: 'Documents', icon: Upload },
    { path: '/admin/project-docs', label: 'Project Docs', icon: FileText },
    { path: '/admin/google-sheets', label: 'Google Sheets', icon: FileSpreadsheet },
    { path: '/admin/seo', label: 'SEO Management', icon: Search },
    { path: '/admin/email-templates', label: 'Email Templates', icon: Mail },
    { path: '/admin/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          background: 'var(--bg-card)',
          borderRight: '1px solid var(--border-light)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>Zentiam</h2>
          <p className="caption" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>Admin Portal</p>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    color: isActive ? 'white' : 'var(--text-primary)',
                    background: isActive ? 'var(--text-primary)' : 'transparent',
                    transition: 'all 0.2s ease',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 500 : 400
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.target.style.background = 'var(--bg-section)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.target.style.background = 'transparent';
                  }}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            cursor: 'pointer',
            fontSize: '0.875rem',
            transition: 'all 0.2s ease',
            width: '100%',
            justifyContent: 'center',
            fontWeight: 500
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#fee2e2';
            e.target.style.borderColor = '#f87171';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#fef2f2';
            e.target.style.borderColor = '#fecaca';
            e.target.style.color = 'var(--text-primary)';
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
