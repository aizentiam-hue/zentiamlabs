import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { Search, Save, Eye, AlertCircle, CheckCircle, Globe, Image as ImageIcon, Code, TrendingUp } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const pages = [
  { id: 'home', name: 'Home Page', path: '/' },
  { id: 'about', name: 'About Page', path: '/about' },
  { id: 'services', name: 'Services Page', path: '/services' },
  { id: 'products', name: 'Products Page', path: '/products' },
  { id: 'contact', name: 'Contact Page', path: '/contact' }
];

const SEOManagement = () => {
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState('home');
  const [seoData, setSeoData] = useState({
    page: 'home',
    title: '',
    description: '',
    keywords: '',
    ogImage: '',
    canonical: '',
    structuredData: null
  });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('edit');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    loadPageSEO(selectedPage);
  }, [selectedPage]);

  useEffect(() => {
    if (activeTab === 'analytics') {
      loadAnalytics();
    }
  }, [activeTab]);

  const loadPageSEO = async (pageId) => {
    try {
      const response = await axios.get(`${API_URL}/api/seo/page/${pageId}`);
      if (response.data.success && response.data.data) {
        setSeoData(response.data.data);
      } else {
        // Set defaults for new page
        setSeoData({
          page: pageId,
          title: '',
          description: '',
          keywords: '',
          ogImage: '',
          canonical: pages.find(p => p.id === pageId)?.path || '',
          structuredData: null
        });
      }
    } catch (error) {
      console.error('Error loading SEO data:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/seo/analytics`);
      if (response.data.success) {
        setAnalytics(response.data.analytics);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post(`${API_URL}/api/seo/page`, seoData);
      if (response.data.success) {
        setMessage('SEO settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error saving SEO settings');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const calculateScore = () => {
    let score = 0;
    
    // Title (25 points)
    if (seoData.title) {
      score += 15;
      if (seoData.title.length >= 30 && seoData.title.length <= 60) {
        score += 10;
      }
    }
    
    // Description (25 points)
    if (seoData.description) {
      score += 15;
      if (seoData.description.length >= 120 && seoData.description.length <= 160) {
        score += 10;
      }
    }
    
    // Keywords (15 points)
    if (seoData.keywords && seoData.keywords.split(',').length >= 3) {
      score += 15;
    }
    
    // OG Image (15 points)
    if (seoData.ogImage) {
      score += 15;
    }
    
    // Canonical (10 points)
    if (seoData.canonical) {
      score += 10;
    }
    
    // Structured Data (10 points)
    if (seoData.structuredData) {
      score += 10;
    }
    
    return Math.min(score, 100);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const score = calculateScore();

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={32} />
            SEO Management
          </h1>
          <p style={{ color: '#666' }}>Optimize your website for search engines and social media</p>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '2px solid #e5e5e5', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setActiveTab('edit')}
              style={{
                padding: '1rem 1.5rem',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'edit' ? '2px solid #9333ea' : 'none',
                color: activeTab === 'edit' ? '#9333ea' : '#666',
                fontWeight: activeTab === 'edit' ? 'bold' : 'normal',
                cursor: 'pointer'
              }}
            >
              Edit SEO
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              style={{
                padding: '1rem 1.5rem',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'preview' ? '2px solid #9333ea' : 'none',
                color: activeTab === 'preview' ? '#9333ea' : '#666',
                fontWeight: activeTab === 'preview' ? 'bold' : 'normal',
                cursor: 'pointer'
              }}
            >
              <Eye size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Preview
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              style={{
                padding: '1rem 1.5rem',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'analytics' ? '2px solid #9333ea' : 'none',
                color: activeTab === 'analytics' ? '#9333ea' : '#666',
                fontWeight: activeTab === 'analytics' ? 'bold' : 'normal',
                cursor: 'pointer'
              }}
            >
              <TrendingUp size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Analytics
            </button>
          </div>
        </div>

        {message && (
          <div style={{
            padding: '1rem',
            background: message.includes('Error') ? '#fee2e2' : '#dcfce7',
            color: message.includes('Error') ? '#dc2626' : '#16a34a',
            borderRadius: '8px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {message.includes('Error') ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            {message}
          </div>
        )}

        {activeTab === 'edit' && (
          <div>
            {/* Page Selector */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Select Page</label>
              <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e5e5',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                {pages.map(page => (
                  <option key={page.id} value={page.id}>{page.name}</option>
                ))}
              </select>
            </div>

            {/* SEO Score */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '1.5rem',
              borderRadius: '12px',
              color: 'white',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>SEO Score</h3>
                  <p style={{ opacity: 0.9 }}>Overall optimization score for this page</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    background: 'white',
                    color: getScoreColor(score),
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                  }}>
                    {score}
                  </div>
                </div>
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Meta Title *
                <span style={{ color: '#666', fontWeight: 'normal', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                  ({seoData.title.length}/60 characters)
                </span>
              </label>
              <input
                type="text"
                value={seoData.title}
                onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
                placeholder="Enter page title (30-60 characters recommended)"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${seoData.title.length > 60 ? '#ef4444' : '#e5e5e5'}`,
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
              {seoData.title.length > 60 && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  Title is too long. Keep it under 60 characters.
                </p>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Meta Description *
                <span style={{ color: '#666', fontWeight: 'normal', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                  ({seoData.description.length}/160 characters)
                </span>
              </label>
              <textarea
                value={seoData.description}
                onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
                placeholder="Enter page description (120-160 characters recommended)"
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${seoData.description.length > 160 || seoData.description.length < 120 && seoData.description.length > 0 ? '#ef4444' : '#e5e5e5'}`,
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
              {seoData.description.length > 0 && seoData.description.length < 120 && (
                <p style={{ color: '#f59e0b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  Description is too short. Aim for 120-160 characters.
                </p>
              )}
              {seoData.description.length > 160 && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  Description is too long. Keep it under 160 characters.
                </p>
              )}
            </div>

            {/* Keywords */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={seoData.keywords}
                onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
                placeholder="e.g., AI consulting, machine learning, automation"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e5e5',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            {/* OG Image */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                <ImageIcon size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Open Graph Image URL
              </label>
              <input
                type="text"
                value={seoData.ogImage}
                onChange={(e) => setSeoData({ ...seoData, ogImage: e.target.value })}
                placeholder="https://example.com/image.jpg (1200x630px recommended)"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e5e5',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
              <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                Used when sharing on social media (Facebook, LinkedIn, etc.)
              </p>
            </div>

            {/* Canonical URL */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                <Globe size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Canonical URL
              </label>
              <input
                type="text"
                value={seoData.canonical}
                onChange={(e) => setSeoData({ ...seoData, canonical: e.target.value })}
                placeholder="/about"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e5e5',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                padding: '1rem 2rem',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Save size={20} />
              {loading ? 'Saving...' : 'Save SEO Settings'}
            </button>
          </div>
        )}

        {activeTab === 'preview' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Preview</h2>
            
            {/* Google Search Preview */}
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Google Search Result</h3>
              <div style={{
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                padding: '1.5rem',
                background: 'white'
              }}>
                <div style={{ color: '#1a0dab', fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                  {seoData.title || 'Your Page Title Here'}
                </div>
                <div style={{ color: '#006621', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  https://zentiam.com{seoData.canonical || '/'}
                </div>
                <div style={{ color: '#545454', fontSize: '0.875rem', lineHeight: '1.4' }}>
                  {seoData.description || 'Your page description will appear here...'}
                </div>
              </div>
            </div>

            {/* Social Media Preview */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Social Media Share Preview</h3>
              <div style={{
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                padding: '1.5rem',
                background: 'white',
                maxWidth: '500px'
              }}>
                {seoData.ogImage && (
                  <div style={{
                    width: '100%',
                    height: '250px',
                    background: `url(${seoData.ogImage}) center/cover`,
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }} />
                )}
                <div style={{ color: '#666', fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                  ZENTIAM.COM
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {seoData.title || 'Your Page Title'}
                </div>
                <div style={{ color: '#666', fontSize: '0.875rem', lineHeight: '1.4' }}>
                  {seoData.description || 'Your description...'}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && analytics && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>SEO Analytics</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                color: 'white'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{analytics.totalPages}</div>
                <div>Total Pages</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                color: 'white'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{analytics.pagesWithSEO}</div>
                <div>Pages with SEO</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                color: 'white'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{analytics.averageScore}</div>
                <div>Average Score</div>
              </div>
            </div>

            {analytics.issues && analytics.issues.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Issues & Warnings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {analytics.issues.map((issue, index) => (
                    <div key={index} style={{
                      padding: '1rem',
                      background: issue.type === 'error' ? '#fee2e2' : '#fef3c7',
                      border: `1px solid ${issue.type === 'error' ? '#fca5a5' : '#fde047'}`,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'start',
                      gap: '0.75rem'
                    }}>
                      <AlertCircle size={20} color={issue.type === 'error' ? '#dc2626' : '#d97706'} />
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', textTransform: 'capitalize' }}>
                          {issue.page}
                        </div>
                        <div style={{ fontSize: '0.875rem' }}>{issue.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SEOManagement;