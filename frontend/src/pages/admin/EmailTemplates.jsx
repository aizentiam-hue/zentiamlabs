import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { Mail, Save, Eye, Send, AlertCircle, CheckCircle, Code, Trash2, Plus } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const EmailTemplates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    templateId: '',
    name: '',
    subject: '',
    htmlContent: '',
    variables: [],
    isActive: true
  });
  const [activeTab, setActiveTab] = useState('list');
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/email-templates`);
      if (response.data.success) {
        setTemplates(response.data.templates);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      setMessage('Error loading templates');
    }
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setFormData(template);
    setEditMode(true);
    setActiveTab('edit');
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post(`${API_URL}/api/email-templates`, formData);
      if (response.data.success) {
        setMessage('Template saved successfully!');
        await loadTemplates();
        setTimeout(() => {
          setMessage('');
          setActiveTab('list');
          setEditMode(false);
        }, 2000);
      }
    } catch (error) {
      setMessage('Error saving template');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }
    
    try {
      await axios.delete(`${API_URL}/api/email-templates/${templateId}`);
      setMessage('Template deleted successfully');
      await loadTemplates();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error deleting template');
      console.error('Error:', error);
    }
  };

  const handlePreview = async (templateId) => {
    try {
      const response = await axios.get(`${API_URL}/api/email-templates/preview/${templateId}`);
      if (response.data.success) {
        setPreview(response.data.preview);
        setActiveTab('preview');
      }
    } catch (error) {
      console.error('Error loading preview:', error);
    }
  };

  const handleSendTest = async () => {
    if (!testEmail) {
      alert('Please enter a test email address');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/email-templates/test`, {
        templateId: selectedTemplate.templateId,
        recipientEmail: testEmail
      });
      
      if (response.data.success) {
        setMessage(`Test email sent to ${testEmail}`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error sending test email: ' + (error.response?.data?.detail || 'Unknown error'));
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleNewTemplate = () => {
    setFormData({
      templateId: `custom_${Date.now()}`,
      name: 'New Template',
      subject: '',
      htmlContent: '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">\n  <h2>Your Email Content Here</h2>\n  <p>Add your content...</p>\n</div>',
      variables: [],
      isActive: true
    });
    setEditMode(true);
    setActiveTab('edit');
  };

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={32} />
              Email Templates
            </h1>
            <p style={{ color: '#666' }}>Manage email templates for notifications and communications</p>
          </div>
          <button
            onClick={handleNewTemplate}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 'bold'
            }}
          >
            <Plus size={20} />
            New Template
          </button>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '2px solid #e5e5e5', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setActiveTab('list')}
              style={{
                padding: '1rem 1.5rem',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'list' ? '2px solid #9333ea' : 'none',
                color: activeTab === 'list' ? '#9333ea' : '#666',
                fontWeight: activeTab === 'list' ? 'bold' : 'normal',
                cursor: 'pointer'
              }}
            >
              Templates
            </button>
            {editMode && (
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
                <Code size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Edit
              </button>
            )}
            {preview && (
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
            )}
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

        {/* Templates List */}
        {activeTab === 'list' && (
          <div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {templates.map((template) => (
                <div
                  key={template.templateId}
                  style={{
                    border: '2px solid #e5e5e5',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    background: 'white',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#9333ea'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e5e5'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{template.name}</h3>
                        <span
                          style={{
                            padding: '0.25rem 0.75rem',
                            background: template.isActive ? '#dcfce7' : '#fee2e2',
                            color: template.isActive ? '#16a34a' : '#dc2626',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {template.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                      <p style={{ color: '#666', marginBottom: '0.5rem' }}>Subject: {template.subject}</p>
                      <p style={{ color: '#999', fontSize: '0.875rem' }}>ID: {template.templateId}</p>
                      {template.variables && template.variables.length > 0 && (
                        <div style={{ marginTop: '0.75rem' }}>
                          <span style={{ fontSize: '0.875rem', color: '#666' }}>Variables: </span>
                          {template.variables.map((v, i) => (
                            <span
                              key={i}
                              style={{
                                display: 'inline-block',
                                padding: '0.25rem 0.5rem',
                                background: '#f5f5f5',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                marginRight: '0.5rem',
                                fontFamily: 'monospace'
                              }}
                            >
                              {`{{${v}}}`}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handlePreview(template.templateId)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#f5f5f5',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <Eye size={16} />
                        Preview
                      </button>
                      <button
                        onClick={() => handleSelectTemplate(template)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#9333ea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        Edit
                      </button>
                      {!['consultation_confirmation', 'newsletter_welcome'].includes(template.templateId) && (
                        <button
                          onClick={() => handleDelete(template.templateId)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Template */}
        {activeTab === 'edit' && editMode && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Template Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e5e5',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Email Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e5e5',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>HTML Content</label>
              <div style={{ background: '#f5f5f5', padding: '0.5rem', borderRadius: '8px 8px 0 0', fontSize: '0.875rem', color: '#666' }}>
                Use variables like: {{name}}, {{email}}, {{service}}, {{company}}
              </div>
              <textarea
                value={formData.htmlContent}
                onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                rows={20}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid #e5e5e5',
                  borderRadius: '0 0 8px 8px',
                  fontSize: '0.875rem',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <span style={{ fontWeight: '600' }}>Active (template will be used for emails)</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
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
                {loading ? 'Saving...' : 'Save Template'}
              </button>

              <button
                onClick={() => handlePreview(formData.templateId)}
                style={{
                  padding: '1rem 2rem',
                  background: '#f5f5f5',
                  border: '2px solid #e5e5e5',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Eye size={20} />
                Preview
              </button>
            </div>

            {/* Test Email Section */}
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f5f5f5', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Send Test Email</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                  type="email"
                  placeholder="Enter test email address"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '2px solid #e5e5e5',
                    borderRadius: '8px'
                  }}
                />
                <button
                  onClick={handleSendTest}
                  disabled={loading || !testEmail}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: loading || !testEmail ? '#ccc' : '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading || !testEmail ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 'bold'
                  }}
                >
                  <Send size={18} />
                  Send Test
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview */}
        {activeTab === 'preview' && preview && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Subject:</h3>
              <p style={{ fontSize: '1.125rem', color: '#666' }}>{preview.subject}</p>
            </div>
            <div style={{ border: '2px solid #e5e5e5', borderRadius: '12px', padding: '2rem', background: 'white' }}>
              <div dangerouslySetInnerHTML={{ __html: preview.htmlContent }} />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default EmailTemplates;