import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

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
        background: isScrolled 
          ? 'rgba(26, 26, 46, 0.95)' 
          : 'rgba(26, 26, 46, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: isScrolled ? '1px solid rgba(147, 51, 234, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.3)' : 'none'
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
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            <Logo width={40} height={40} showText={true} textColor="gradient" />
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
                  color: location.pathname === link.path ? '#a78bfa' : 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: location.pathname === link.path ? 600 : 400,
                  transition: 'color 0.2s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => (e.target.style.color = '#a78bfa')}
                onMouseLeave={(e) =>
                  (e.target.style.color =
                    location.pathname === link.path ? '#a78bfa' : 'rgba(255, 255, 255, 0.8)')
                }
              >
                {link.label}
              </Link>
            ))}
            <Link 
              to="/contact" 
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                border: 'none',
                borderRadius: '50px',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                boxShadow: '0 4px 15px rgba(147, 51, 234, 0.4)',
                transition: 'all 0.3s ease',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(147, 51, 234, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(147, 51, 234, 0.4)';
              }}
            >
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
              color: 'white',
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
            background: 'rgba(26, 26, 46, 0.98)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(147, 51, 234, 0.3)',
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
                  color: location.pathname === link.path ? '#a78bfa' : 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: location.pathname === link.path ? 600 : 400,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: '0.75rem'
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                marginTop: '1rem',
                padding: '0.875rem 1.5rem',
                background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                border: 'none',
                borderRadius: '50px',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                textAlign: 'center',
                display: 'block',
                boxShadow: '0 4px 15px rgba(147, 51, 234, 0.4)'
              }}
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
