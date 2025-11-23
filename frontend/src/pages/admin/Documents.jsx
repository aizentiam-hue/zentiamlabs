import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Documents = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['.pdf', '.pptx', '.txt'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExt)) {
      setMessage({ type: 'error', text: 'Only PDF, PPTX, and TXT files are supported' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API}/chatbot/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage({ type: 'success', text: `${file.name} uploaded successfully! Chatbot knowledge base updated.` });
      e.target.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage({ type: 'error', text: 'Failed to upload file. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="heading-1" style={{ marginBottom: '0.5rem' }}>Document Management</h1>
        <p className="body-medium" style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Upload documents to enhance chatbot knowledge base
        </p>

        {/* Upload Card */}
        <div
          style={{
            background: 'var(--bg-card)',
            borderRadius: '0.75rem',
            padding: '2rem',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
            maxWidth: '600px'
          }}
        >
          <div
            style={{
              border: '2px dashed var(--border-primary)',
              borderRadius: '0.75rem',
              padding: '3rem 2rem',
              textAlign: 'center',
              background: 'var(--bg-section)',
              position: 'relative'
            }}
          >
            <input
              type="file"
              accept=".pdf,.pptx,.txt"
              onChange={handleFileUpload}
              disabled={uploading}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: uploading ? 'not-allowed' : 'pointer'
              }}
            />
            <Upload size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>
              {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </h3>
            <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
              PDF, PPTX, or TXT files (max 10MB)
            </p>
          </div>

          {message && (
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1rem',
                borderRadius: '0.5rem',
                background: message.type === 'success' ? 'var(--accent-green-200)' : '#fee',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              {message.type === 'success' ? (
                <CheckCircle size={20} color="#080" />
              ) : (
                <AlertCircle size={20} color="#c00" />
              )}
              <p className="body-small" style={{ flex: 1 }}>{message.text}</p>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem' }}>
          <div
            style={{
              background: 'var(--accent-blue-200)',
              borderRadius: '0.75rem',
              padding: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
              <FileText size={24} />
              <div>
                <h4 className="heading-3" style={{ marginBottom: '0.5rem' }}>Supported File Types</h4>
                <ul className="body-small" style={{ marginLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                  <li>PDF documents (.pdf)</li>
                  <li>PowerPoint presentations (.pptx)</li>
                  <li>Text files (.txt)</li>
                </ul>
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'var(--accent-purple-200)',
              borderRadius: '0.75rem',
              padding: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
              <CheckCircle size={24} />
              <div>
                <h4 className="heading-3" style={{ marginBottom: '0.5rem' }}>How It Works</h4>
                <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
                  Uploaded documents are automatically processed and added to the chatbot's knowledge base. 
                  The AI assistant will use this information to answer visitor questions more accurately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Documents;
