import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Linkedin, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border-light)',
        marginTop: '5rem'
      }}
    >
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}
        >
          {/* Company Info */}
          <div>
            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                marginBottom: '1rem',
                color: 'var(--text-primary)'
              }}
            >
              Zentiam
            </h3>
            <p className="body-small" style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              Where Intelligence Meets Impact.
            </p>
            <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
              Premium AI consulting and innovation for forward-thinking organizations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="button-text"
              style={{
                marginBottom: '1rem',
                color: 'var(--text-primary)'
              }}
            >
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/about" className="body-small" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                About Us
              </Link>
              <Link to="/services" className="body-small" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Services
              </Link>
              <Link to="/products" className="body-small" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Products
              </Link>
              <Link to="/contact" className="body-small" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Contact
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4
              className="button-text"
              style={{
                marginBottom: '1rem',
                color: 'var(--text-primary)'
              }}
            >
              Services
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span className="body-small" style={{ color: 'var(--text-secondary)' }}>
                AI Strategy Consulting
              </span>
              <span className="body-small" style={{ color: 'var(--text-secondary)' }}>
                Custom AI Solutions
              </span>
              <span className="body-small" style={{ color: 'var(--text-secondary)' }}>
                Automation & Integration
              </span>
              <span className="body-small" style={{ color: 'var(--text-secondary)' }}>
                Training & Enablement
              </span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="button-text"
              style={{
                marginBottom: '1rem',
                color: 'var(--text-primary)'
              }}
            >
              Get in Touch
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a
                href="mailto:contact@zentiam.com"
                className="body-small"
                style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Mail size={16} />
                contact@zentiam.com
              </a>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label="YouTube"
                >
                  <Youtube size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-light)',
            textAlign: 'center'
          }}
        >
          <p className="caption" style={{ color: 'var(--text-muted)' }}>
            © 2025 Zentiam. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
