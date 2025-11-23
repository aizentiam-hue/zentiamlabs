import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import '../styles/futuristic.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: 'consultation',
    message: ''
  });

  const [newsletter, setNewsletter] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
      const response = await fetch(`${API}/contact/consultation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            name: '',
            email: '',
            company: '',
            phone: '',
            service: 'consultation',
            message: ''
          });
        }, 3000);
      } else {
        alert('Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
      const response = await fetch(`${API}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletter })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setNewsletterSubmitted(true);
        setTimeout(() => {
          setNewsletterSubmitted(false);
          setNewsletter('');
        }, 3000);
      } else {
        alert('Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ background: '#0a0a0f', color: 'white', position: 'relative', minHeight: '100vh' }}>
      <ParticleBackground />

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '10rem 1.5rem 5rem',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 20%, rgba(59, 130, 246, 0.15), transparent 70%)',
            zIndex: 1
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '900px' }}>
          <div
            className="fade-in-up"
            style={{
              display: 'inline-block',
              padding: '0.5rem 1.5rem',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '50px',
              marginBottom: '2rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Get In Touch
          </div>

          <h1
            className="fade-in-up delay-100"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #60a5fa 50%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Let's Build Something
            <br />
            Extraordinary
          </h1>

          <p
            className="fade-in-up delay-200"
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.4rem)',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            Ready to transform your business with AI? Get in touch with our team to discuss your project.
          </p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section style={{ padding: '5rem 1.5rem', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3rem',
              alignItems: 'start'
            }}
          >
            {/* Contact Form */}
            <div style={{ gridColumn: 'span 2' }}>
              <div
                className="glass-card"
                style={{
                  padding: '3rem',
                  borderColor: 'rgba(59, 130, 246, 0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '2px solid rgba(59, 130, 246, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <MessageSquare size={24} style={{ color: '#3b82f6' }} />
                  </div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>
                    Book a Consultation
                  </h2>
                </div>

                {submitted ? (
                  <div
                    style={{
                      background: 'var(--accent-green-200)',
                      padding: '1.5rem',
                      borderRadius: '0.5rem',
                      textAlign: 'center'
                    }}
                  >
                    <p className="body-medium" style={{ fontWeight: 500 }}>
                      Thank you! We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                          Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid var(--border-input)',
                            background: 'var(--bg-page)',
                            fontSize: '1rem',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            transition: 'border-color 0.2s ease'
                          }}
                          onFocus={(e) => (e.target.style.borderColor = 'var(--border-input-focus)')}
                          onBlur={(e) => (e.target.style.borderColor = 'var(--border-input)')}
                        />
                      </div>
                      <div>
                        <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid var(--border-input)',
                            background: 'var(--bg-page)',
                            fontSize: '1rem',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            transition: 'border-color 0.2s ease'
                          }}
                          onFocus={(e) => (e.target.style.borderColor = 'var(--border-input-focus)')}
                          onBlur={(e) => (e.target.style.borderColor = 'var(--border-input)')}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid var(--border-input)',
                            background: 'var(--bg-page)',
                            fontSize: '1rem',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            transition: 'border-color 0.2s ease'
                          }}
                          onFocus={(e) => (e.target.style.borderColor = 'var(--border-input-focus)')}
                          onBlur={(e) => (e.target.style.borderColor = 'var(--border-input)')}
                        />
                      </div>
                      <div>
                        <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid var(--border-input)',
                            background: 'var(--bg-page)',
                            fontSize: '1rem',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            transition: 'border-color 0.2s ease'
                          }}
                          onFocus={(e) => (e.target.style.borderColor = 'var(--border-input-focus)')}
                          onBlur={(e) => (e.target.style.borderColor = 'var(--border-input)')}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        Service Interested In *
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: '1px solid var(--border-input)',
                          background: 'var(--bg-page)',
                          fontSize: '1rem',
                          color: 'var(--text-primary)',
                          outline: 'none',
                          transition: 'border-color 0.2s ease'
                        }}
                        onFocus={(e) => (e.target.style.borderColor = 'var(--border-input-focus)')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--border-input)')}
                      >
                        <option value="consultation">AI Strategy Consultation</option>
                        <option value="custom-solution">Custom AI Solution</option>
                        <option value="automation">Automation & Integration</option>
                        <option value="training">Training & Enablement</option>
                        <option value="products">Zentiam Labs Products</option>
                      </select>
                    </div>

                    <div>
                      <label className="body-small" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="5"
                        placeholder="Tell us about your project and goals..."
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: '1px solid var(--border-input)',
                          background: 'var(--bg-page)',
                          fontSize: '1rem',
                          color: 'var(--text-primary)',
                          outline: 'none',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          transition: 'border-color 0.2s ease'
                        }}
                        onFocus={(e) => (e.target.style.borderColor = 'var(--border-input-focus)')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--border-input)')}
                      />
                    </div>

                    <button type="submit" className="btn-primary button-text" style={{ width: '100%' }}>
                      <Send size={16} style={{ marginRight: '0.5rem' }} />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <div
                style={{
                  background: 'var(--accent-purple-200)',
                  borderRadius: '0.75rem',
                  padding: '2rem',
                  marginBottom: '1.5rem'
                }}
              >
                <h3 className="heading-3" style={{ marginBottom: '1.5rem' }}>
                  Contact Information
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                    <Mail size={20} color="var(--text-primary)" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                    <div>
                      <div className="body-small" style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                        Email
                      </div>
                      <a href="mailto:contact@zentiam.com" className="body-small" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                        contact@zentiam.com
                      </a>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                    <Phone size={20} color="var(--text-primary)" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                    <div>
                      <div className="body-small" style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                        Phone
                      </div>
                      <span className="body-small" style={{ color: 'var(--text-secondary)' }}>
                        +1 (555) 123-4567
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                    <MapPin size={20} color="var(--text-primary)" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                    <div>
                      <div className="body-small" style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                        Office
                      </div>
                      <span className="body-small" style={{ color: 'var(--text-secondary)' }}>
                        San Francisco, CA
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Image */}
              <img
                src="https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmd8ZW58MHx8fHwxNzYyMjQzMjg4fDA&ixlib=rb-4.1.0&q=85"
                alt="Professional consultation"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-section)' }}>
        <div className="container" style={{ maxWidth: '700px', textAlign: 'center' }}>
          <h2 className="heading-2" style={{ marginBottom: '1rem' }}>
            Stay Updated
          </h2>
          <p className="body-medium" style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
            Subscribe to our newsletter for the latest insights on AI trends, best practices, and Zentiam updates.
          </p>

          {newsletterSubmitted ? (
            <div
              style={{
                background: 'var(--accent-green-200)',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                display: 'inline-block'
              }}
            >
              <p className="body-medium" style={{ fontWeight: 500 }}>
                Thanks for subscribing!
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleNewsletterSubmit}
              style={{
                display: 'flex',
                gap: '1rem',
                maxWidth: '500px',
                margin: '0 auto',
                flexWrap: 'wrap'
              }}
            >
              <input
                type="email"
                value={newsletter}
                onChange={(e) => setNewsletter(e.target.value)}
                placeholder="Enter your email"
                required
                style={{
                  flex: 1,
                  minWidth: '250px',
                  padding: '0.75rem 1rem',
                  borderRadius: '2rem',
                  border: '1px solid var(--border-input)',
                  background: 'var(--bg-card)',
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
              <button type="submit" className="btn-primary button-text">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Contact;
