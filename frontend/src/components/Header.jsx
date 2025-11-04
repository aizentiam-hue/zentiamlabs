import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/products', label: 'Products' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        height: '80px',
        background: isScrolled ? 'var(--bg-overlay)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(8px)' : 'none',
        borderBottom: isScrolled ? '1px solid var(--border-light)' : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="container" style={{ height: '100%' }}>
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%'
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              textDecoration: 'none',
              letterSpacing: '-0.02em'
            }}
          >
            Zentiam
          </Link>

          {/* Desktop Navigation */}
          <div
            style={{
              display: 'none',
              gap: '2rem',
              alignItems: 'center'
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  color: location.pathname === link.path ? 'var(--text-primary)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: location.pathname === link.path ? 500 : 400,
                  transition: 'color 0.2s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.025em'
                }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) =>
                  (e.target.style.color =
                    location.pathname === link.path ? 'var(--text-primary)' : 'var(--text-secondary)')
                }
              >
                {link.label}
              </Link>
            ))}
            <Link to="/contact" className="btn-primary button-text">
              Book Consultation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: 'block',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              padding: '0.5rem'
            }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: 0,
            right: 0,
            background: 'var(--bg-overlay)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderBottom: '1px solid var(--border-light)',
            padding: '1.5rem',
            animation: 'slideDown 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  color: location.pathname === link.path ? 'var(--text-primary)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: location.pathname === link.path ? 500 : 400,
                  textTransform: 'uppercase',
                  letterSpacing: '0.025em',
                  padding: '0.5rem'
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-primary button-text"
              style={{ marginTop: '1rem' }}
            >
              Book Consultation
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
