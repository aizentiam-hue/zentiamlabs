import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { FileText, ChevronRight, Clock, Target, CheckCircle, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ProjectDocs = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docContent, setDocContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin/login');
      return;
    }
    fetchDocuments();
  }, [navigate]);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API}/admin/project-docs`);
      setDocuments(response.data.documents || []);
      if (response.data.documents?.length > 0) {
        selectDocument(response.data.documents[0]);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      // Fallback to show the plan document
      setDocuments([
        {
          id: 'chatbot-plan',
          title: 'Chatbot Enhancement Plan',
          description: 'Comprehensive plan for conversational quality, Google Sheets integration, and self-learning mechanism',
          filename: 'CHATBOT_ENHANCEMENT_PLAN.md',
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const selectDocument = async (doc) => {
    setSelectedDoc(doc);
    try {
      const response = await axios.get(`${API}/admin/project-docs/${doc.filename}`);
      setDocContent(response.data.content || '');
    } catch (error) {
      console.error('Error fetching document content:', error);
      setDocContent('Failed to load document content');
    }
  };

  const renderMarkdown = (content) => {
    // Simple markdown rendering
    let html = content
      // Headers
      .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.1rem; font-weight: 600; margin: 1.5rem 0 0.75rem; color: var(--text-primary);">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.25rem; font-weight: 600; margin: 2rem 0 1rem; color: var(--text-primary); border-bottom: 1px solid var(--border-primary); padding-bottom: 0.5rem;">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 style="font-size: 1.5rem; font-weight: 700; margin: 0 0 1.5rem; color: var(--text-primary);">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre style="background: var(--bg-section); padding: 1rem; border-radius: 0.5rem; overflow-x: auto; font-size: 0.875rem; margin: 1rem 0;"><code>$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/gim, '<code style="background: var(--bg-section); padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875rem;">$1</code>')
      // Checkboxes
      .replace(/- \[x\] (.*$)/gim, '<div style="display: flex; align-items: center; gap: 0.5rem; margin: 0.25rem 0;"><span style="color: var(--accent-green);">✓</span> <span style="text-decoration: line-through; color: var(--text-muted);">$1</span></div>')
      .replace(/- \[ \] (.*$)/gim, '<div style="display: flex; align-items: center; gap: 0.5rem; margin: 0.25rem 0;"><span style="color: var(--text-muted);">○</span> $1</div>')
      // Lists
      .replace(/^\- (.*$)/gim, '<li style="margin: 0.25rem 0; margin-left: 1.5rem;">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li style="margin: 0.25rem 0; margin-left: 1.5rem;">$1</li>')
      // Tables (basic)
      .replace(/\|(.+)\|/gim, (match) => {
        const cells = match.split('|').filter(c => c.trim());
        if (cells.every(c => c.trim().match(/^[-:]+$/))) {
          return ''; // Skip separator row
        }
        const cellHtml = cells.map(c => `<td style="padding: 0.5rem; border: 1px solid var(--border-primary);">${c.trim()}</td>`).join('');
        return `<tr>${cellHtml}</tr>`;
      })
      // Horizontal rule
      .replace(/^---$/gim, '<hr style="border: none; border-top: 1px solid var(--border-primary); margin: 2rem 0;" />')
      // Paragraphs
      .replace(/\n\n/gim, '</p><p style="margin: 1rem 0; line-height: 1.6;">')
      // Line breaks
      .replace(/\n/gim, '<br />');
    
    return `<div style="color: var(--text-secondary);"><p style="margin: 1rem 0; line-height: 1.6;">${html}</p></div>`;
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="heading-1" style={{ marginBottom: '0.5rem' }}>Project Documentation</h1>
        <p className="body-medium" style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Technical plans and implementation guides for the Zentiam platform
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>
          {/* Document List */}
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: '0.75rem',
              padding: '1rem',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
              height: 'fit-content'
            }}
          >
            <h3 className="heading-3" style={{ marginBottom: '1rem', padding: '0 0.5rem' }}>Documents</h3>
            {loading ? (
              <p className="body-small" style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>Loading...</p>
            ) : (
              <div>
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => selectDocument(doc)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      background: selectedDoc?.id === doc.id ? 'var(--accent-blue-200)' : 'transparent',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'background 0.2s'
                    }}
                  >
                    <FileText size={18} color="var(--accent-blue)" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="body-small" style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{doc.title}</p>
                      <p className="body-small" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {doc.description}
                      </p>
                    </div>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Document Content */}
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: '0.75rem',
              padding: '2rem',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
              maxHeight: 'calc(100vh - 200px)',
              overflowY: 'auto'
            }}
          >
            {selectedDoc ? (
              <div>
                <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-primary)' }}>
                  <h2 className="heading-2" style={{ marginBottom: '0.5rem' }}>{selectedDoc.title}</h2>
                  <p className="body-small" style={{ color: 'var(--text-muted)' }}>{selectedDoc.description}</p>
                </div>
                <div 
                  className="markdown-content"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(docContent) }}
                />
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>Select a document to view</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProjectDocs;
