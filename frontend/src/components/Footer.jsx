import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Linkedin, Twitter, Youtube } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer
      style={{
        background: 'rgba(42, 30, 58, 0.95)',
        borderTop: '1px solid rgba(147, 51, 234, 0.3)',
        marginTop: '0',
        position: 'relative',
        zIndex: 10
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
            <div style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
              <Logo width={50} height={50} showText={true} textColor="gradient" />
            </div>
            <p style={{ marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Where Intelligence Meets Impact.
            </p>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Premium AI consulting and innovation for forward-thinking organizations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                marginBottom: '1rem',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/about" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.target.style.color = '#a78bfa'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                About Us
              </Link>
              <Link to="/services" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.target.style.color = '#a78bfa'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                Services
              </Link>
              <Link to="/products" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.target.style.color = '#a78bfa'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                Products
              </Link>
              <Link to="/contact" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.target.style.color = '#a78bfa'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>
                Contact
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4
              style={{
                marginBottom: '1rem',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Services
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                AI Strategy Consulting
              </span>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                Custom AI Solutions
              </span>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                Automation & Integration
              </span>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                Training & Enablement
              </span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                marginBottom: '1rem',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Get in Touch
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a
                href="mailto:contact@zentiam.com"
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#a78bfa'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
              >
                <Mail size={16} />
                contact@zentiam.com
              </a>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'rgba(255, 255, 255, 0.7)', transition: 'color 0.2s ease' }}
                  aria-label="LinkedIn"
                  onMouseEnter={(e) => e.target.style.color = '#a78bfa'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'rgba(255, 255, 255, 0.7)', transition: 'color 0.2s ease' }}
                  aria-label="Twitter"
                  onMouseEnter={(e) => e.target.style.color = '#a78bfa'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'rgba(255, 255, 255, 0.7)', transition: 'color 0.2s ease' }}
                  aria-label="YouTube"
                  onMouseEnter={(e) => e.target.style.color = '#a78bfa'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
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
            borderTop: '1px solid rgba(147, 51, 234, 0.2)',
            textAlign: 'center'
          }}
        >
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem' }}>
            © 2025 Zentiam. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
