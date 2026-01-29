import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import '../styles/futuristic.css';
import SEO from '../components/SEO';

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
    <div style={{ background: '#1a1a2e', color: 'white', position: 'relative', minHeight: '100vh' }}>
      <SEO 
        title="Book AI Consultation | Contact Zentiam | AI Consulting"
        description="Book your AI consultation with Zentiam's expert team. Based in Bengaluru, serving clients globally. Get a free AI strategy session and personalized roadmap for your organization."
        keywords="book AI consultation, AI consulting contact, free AI consultation, AI strategy session, contact AI consultants, AI project inquiry, AI consultants Bangalore"
        canonical="/contact"
      />
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
              fontWeight: 800,
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
            Book Your AI
            <br />
            Consultation
          </h1>

          <p
            className="fade-in-up delay-200"
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.4rem)',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.95)',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            Ready to transform your business with AI? Book a free consultation with our expert team. Based in Bengaluru, we serve clients globally with personalized AI strategy roadmaps.
          </p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section style={{ padding: '5rem 1.5rem', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '3rem',
              alignItems: 'start'
            }}
          >
            {/* Contact Form */}
            <div className="contact-form-container">
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
                  <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
                    Book a Consultation
                  </h2>
                </div>

                {submitted ? (
                  <div
                    style={{
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      padding: '2rem',
                      borderRadius: '16px',
                      textAlign: 'center'
                    }}
                  >
                    <p style={{ fontSize: '1.125rem', fontWeight: 800, color: '#22c55e' }}>
                      Thank you! We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1.5rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
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
                            padding: '0.875rem 1rem',
                            borderRadius: '12px',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            fontSize: '1rem',
                            color: 'white',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#3b82f6';
                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
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
                            padding: '0.875rem 1rem',
                            borderRadius: '12px',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            fontSize: '1rem',
                            color: 'white',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#3b82f6';
                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1.5rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '0.875rem 1rem',
                            borderRadius: '12px',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            fontSize: '1rem',
                            color: 'white',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#3b82f6';
                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '0.875rem 1rem',
                            borderRadius: '12px',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            fontSize: '1rem',
                            color: 'white',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#3b82f6';
                            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                        Service Interested In *
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.875rem 1rem',
                          borderRadius: '12px',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          fontSize: '1rem',
                          color: 'white',
                          outline: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#3b82f6';
                          e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <option value="consultation" style={{ background: '#1a1a2e', color: 'white' }}>AI Strategy Consultation</option>
                        <option value="custom-solution" style={{ background: '#1a1a2e', color: 'white' }}>Custom AI Solution</option>
                        <option value="automation" style={{ background: '#1a1a2e', color: 'white' }}>Automation & Integration</option>
                        <option value="training" style={{ background: '#1a1a2e', color: 'white' }}>Training & Enablement</option>
                        <option value="products" style={{ background: '#1a1a2e', color: 'white' }}>Zentiam Labs Products</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
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
                          padding: '0.875rem 1rem',
                          borderRadius: '12px',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          fontSize: '1rem',
                          color: 'white',
                          outline: 'none',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#3b82f6';
                          e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="btn-neon btn-neon-blue"
                      style={{ 
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Send size={20} />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <div
                className="glass-card"
                style={{
                  padding: '2.5rem',
                  marginBottom: '2rem',
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                  borderColor: 'rgba(147, 51, 234, 0.3)'
                }}
              >
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>
                  Contact Information
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Mail size={18} style={{ color: '#3b82f6' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                        Email
                      </div>
                      <a 
                        href="mailto:ai.zentiam@gmail.com" 
                        style={{ 
                          color: 'rgba(255, 255, 255, 0.95)', 
                          textDecoration: 'none',
                          fontSize: '0.875rem'
                        }}
                      >
                        ai.zentiam@gmail.com
                      </a>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'rgba(34, 197, 94, 0.2)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Phone size={18} style={{ color: '#22c55e' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                        Phone
                      </div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '0.875rem' }}>
                        +91 80889-83706
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'rgba(147, 51, 234, 0.2)',
                        border: '1px solid rgba(147, 51, 234, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <MapPin size={18} style={{ color: '#9333ea' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                        Office
                      </div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '0.875rem' }}>
                        Bangalore, India
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Image */}
              <div
                className="glass-card"
                style={{
                  padding: '0',
                  overflow: 'hidden'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmd8ZW58MHx8fHwxNzYyMjQzMjg4fDA&ixlib=rb-4.1.0&q=85"
                  alt="Professional consultation"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section style={{ padding: '6rem 1.5rem', background: 'rgba(147, 51, 234, 0.03)', position: 'relative', zIndex: 2 }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <h2
            className="gradient-text"
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: 800,
              marginBottom: '1rem'
            }}
          >
            Stay Updated
          </h2>
          <p style={{ fontSize: '1.125rem', marginBottom: '3rem', color: 'rgba(255, 255, 255, 0.95)', lineHeight: 1.6 }}>
            Subscribe to our newsletter for the latest insights on AI trends, best practices, and Zentiam updates.
          </p>

          {newsletterSubmitted ? (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '2rem',
                borderRadius: '16px',
                display: 'inline-block'
              }}
            >
              <p style={{ fontSize: '1.125rem', fontWeight: 800, color: '#22c55e' }}>
                Thanks for subscribing!
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleNewsletterSubmit}
              style={{
                display: 'flex',
                gap: '1rem',
                maxWidth: '600px',
                margin: '0 auto',
                flexWrap: 'wrap',
                justifyContent: 'center'
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
                  minWidth: '200px',
                  maxWidth: '100%',
                  padding: '1rem 1.5rem',
                  borderRadius: '50px',
                  border: '1px solid rgba(147, 51, 234, 0.3)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  fontSize: '1rem',
                  color: 'white',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#9333ea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(147, 51, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(147, 51, 234, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button 
                type="submit" 
                className="btn-neon btn-neon-purple"
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1rem'
                }}
              >
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
