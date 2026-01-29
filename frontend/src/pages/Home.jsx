import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Cpu, Zap, GraduationCap, ArrowRight, CheckCircle, Sparkles, Target, Award, Rocket, Users, TrendingUp } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import AIAssessment from '../components/AIAssessment';
import ROICalculator from '../components/ROICalculator';
import LiveMetrics from '../components/LiveMetrics';
import SuccessStories from '../components/SuccessStories';
import FreeAuditCTA from '../components/FreeAuditCTA';
import SEO from '../components/SEO';
import '../styles/futuristic.css';

const iconMap = {
  Brain: Brain,
  Cpu: Cpu,
  Zap: Zap,
  GraduationCap: GraduationCap
};

const Home = () => {
  const [showAssessment, setShowAssessment] = useState(false);
  const [showROICalc, setShowROICalc] = useState(false);

  const services = [
    {
      icon: 'Brain',
      title: 'AI Strategy Consulting',
      description: 'From idea to implementation in days, not months. We identify high-impact opportunities and build your AI roadmap.',
      color: '#9333ea'
    },
    {
      icon: 'Cpu',
      title: 'Custom AI Solutions',
      description: 'Proprietary AI systems built for your unique workflows. Production-ready in weeks with guaranteed ROI.',
      color: '#3b82f6'
    },
    {
      icon: 'Zap',
      title: 'Automation & Integration',
      description: 'Transform manual processes into intelligent automation. Achieve 40%+ productivity gains immediately.',
      color: '#f59e0b'
    },
    {
      icon: 'GraduationCap',
      title: 'Training & Enablement',
      description: 'Hands-on collaboration that transfers knowledge. Your team becomes AI-ready, not dependent.',
      color: '#22c55e'
    }
  ];

  const differentiators = [
    {
      icon: Rocket,
      title: 'Speed',
      stat: '10x Faster',
      description: 'AI solutions in days, not months. Rapid prototyping to production deployment.',
      color: '#9333ea'
    },
    {
      icon: Target,
      title: 'Results',
      stat: '3.7x ROI',
      description: 'Proven returns with real metrics. Industry-leading success rates.',
      color: '#3b82f6'
    },
    {
      icon: Award,
      title: 'Innovation',
      description: 'Proprietary AI frameworks and cutting-edge technology stack.',
      color: '#22c55e'
    },
    {
      icon: Users,
      title: 'Partnership',
      description: 'Hands-on collaboration, not typical consulting. We build together.',
      color: '#f59e0b'
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Zentiam",
    "alternateName": "Zentiam AI Consulting",
    "url": "https://zentiam-ai-chat.emergent.host",
    "logo": "https://zentiam-ai-chat.emergent.host/zentiam-logo-512.png",
    "description": "Zentiam is an AI consulting company helping organizations transform operations with custom AI solutions, automation, and strategic consulting. We deliver proven 3.7x ROI across industries.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bangalore",
      "addressRegion": "Karnataka",
      "addressCountry": "India"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "ai.zentiam@gmail.com",
      "contactType": "Customer Service",
      "availableLanguage": ["English"]
    },
    "sameAs": [],
    "knowsAbout": [
      "Artificial Intelligence",
      "Machine Learning",
      "AI Consulting",
      "AI Automation",
      "Business Process Automation",
      "AI Strategy",
      "Enterprise AI Solutions"
    ],
    "areaServed": [
      {
        "@type": "Country",
        "name": "India"
      },
      {
        "@type": "Country", 
        "name": "United States"
      },
      {
        "@type": "Country",
        "name": "United Kingdom"
      }
    ],
    "priceRange": "$$"
  };

  return (
    <div style={{ background: '#1a1a2e', color: 'white', position: 'relative' }}>
      <SEO 
        title="AI Consulting & Automation for Modern Businesses | Zentiam"
        description="Transform your business with AI solutions that deliver 3.7x ROI and 40% productivity gains. Expert AI consulting, custom solutions, and seamless automation implementation."
        keywords="AI consulting company, AI automation services, AI implementation partner, AI strategy consulting, custom AI solutions, enterprise AI, business automation"
        structuredData={structuredData}
      />
      <ParticleBackground />

      {/* Hero Section - Split Layout (Version 1) */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '6rem 1rem 4rem',
          overflow: 'hidden'
        }}
      >
        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 20%, rgba(147, 51, 234, 0.15), transparent 70%)',
            zIndex: 1
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          <div className="hero-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr',
            gap: '3rem',
            alignItems: 'center'
          }}>
            {/* LEFT COLUMN - Content */}
            <div style={{ textAlign: 'left', padding: '0 0.5rem' }}>
              {/* Announcement Badge */}
              <div
                className="fade-in-up"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(147, 51, 234, 0.2)',
                  border: '2px solid rgba(147, 51, 234, 0.6)',
                  borderRadius: '50px',
                  padding: '0.625rem 1rem',
                  marginBottom: '1.5rem',
                  backdropFilter: 'blur(10px)',
                  flexWrap: 'wrap',
                  maxWidth: '100%'
                }}
              >
                <Sparkles size={18} style={{ color: '#c084fc', flexShrink: 0 }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'white' }}>
                  AI Solutions in Days, Not Months
                </span>
              </div>

              <h1
                className="fade-in-up delay-100"
                style={{
                  fontSize: 'clamp(2rem, 8vw, 4.5rem)',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  marginBottom: '1.25rem',
                  background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #9333ea 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  wordBreak: 'break-word'
                }}
              >
                AI Solutions That
                <br />
                Transform Business
              </h1>

              <p
                className="fade-in-up delay-200"
                style={{
                  fontSize: 'clamp(1rem, 3vw, 1.35rem)',
                  marginBottom: '2rem',
                  color: 'rgba(255, 255, 255, 0.95)',
                  lineHeight: 1.6,
                  maxWidth: '600px'
                }}
              >
                We help organizations across industries automate workflows and implement practical AI strategy. Our solutions deliver{' '}
                <span style={{ color: '#22c55e', fontWeight: 700 }}>3.7x ROI</span>,{' '}
                <span style={{ color: '#3b82f6', fontWeight: 700 }}>40% productivity gains</span>, and measurable results in weeks.
              </p>

              <div
                className="fade-in-up delay-300"
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  flexDirection: 'column',
                  marginBottom: '2rem',
                  maxWidth: '100%'
                }}
              >
                <button
                  onClick={() => setShowAssessment(true)}
                  className="btn-neon btn-neon-purple"
                  style={{
                    padding: '1rem 1.5rem',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 8px 24px rgba(147, 51, 234, 0.5)',
                    width: '100%',
                    maxWidth: '320px'
                  }}
                >
                  <Brain size={20} />
                  Take AI Assessment
                </button>
                <button
                  onClick={() => setShowROICalc(true)}
                  className="btn-neon btn-neon-blue"
                  style={{
                    padding: '1rem 1.5rem',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.5)',
                    width: '100%',
                    maxWidth: '320px'
                  }}
                >
                  <Zap size={20} />
                  Calculate Your ROI
                </button>
              </div>

              {/* Trust Indicators */}
              <div
                className="fade-in-up delay-400"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '1rem'
                }}
              >
                {[
                  { label: '78% Enterprise Adoption', value: 'Industry Leading' },
                  { label: '150+ Projects Delivered', value: 'Proven Track Record' },
                  { label: '$184B+ AI Market', value: 'Growing 28% YoY' }
                ].map((stat, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#c084fc', marginBottom: '0.25rem' }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.95)', fontWeight: 600 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN - Visual Elements (Hidden on mobile) */}
            <div className="fade-in-up delay-500 hero-visuals" style={{ position: 'relative', minHeight: '400px', display: 'none' }}>
              {/* Floating Stat Card 1 */}
              <div
                className="glass-card hover-scale"
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '10%',
                  width: '280px',
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)',
                  borderColor: 'rgba(147, 51, 234, 0.4)',
                  animation: 'float 6s ease-in-out infinite'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '12px', 
                    background: 'rgba(147, 51, 234, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <TrendingUp size={24} style={{ color: '#9333ea' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#c084fc', textShadow: '0 0 20px rgba(192, 132, 252, 0.5)' }}>3.7x</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.95)', fontWeight: 600 }}>Average ROI</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  Proven returns across 150+ projects
                </div>
              </div>

              {/* Floating Stat Card 2 */}
              <div
                className="glass-card hover-scale"
                style={{
                  position: 'absolute',
                  top: '180px',
                  right: '30%',
                  width: '260px',
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
                  borderColor: 'rgba(34, 197, 94, 0.4)',
                  animation: 'float 7s ease-in-out infinite 1s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '12px', 
                    background: 'rgba(34, 197, 94, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Zap size={24} style={{ color: '#22c55e' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#4ade80', textShadow: '0 0 20px rgba(74, 222, 128, 0.5)' }}>40%</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.95)', fontWeight: 600 }}>Productivity Gain</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  Immediate efficiency improvements
                </div>
              </div>

              {/* Floating Stat Card 3 */}
              <div
                className="glass-card hover-scale"
                style={{
                  position: 'absolute',
                  top: '350px',
                  right: '5%',
                  width: '240px',
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)',
                  borderColor: 'rgba(59, 130, 246, 0.4)',
                  animation: 'float 8s ease-in-out infinite 2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '12px', 
                    background: 'rgba(59, 130, 246, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Rocket size={24} style={{ color: '#3b82f6' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#60a5fa', textShadow: '0 0 20px rgba(96, 165, 250, 0.5)' }}>10x</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.95)', fontWeight: 600 }}>Faster Deploy</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  Solutions in days, not months
                </div>
              </div>

              {/* Background decorative elements */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
                zIndex: -1
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* Live Metrics Dashboard */}
      <section style={{ padding: '4rem 1.5rem', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <LiveMetrics />
        </div>
      </section>

      {/* What Makes Us Different */}
      <section style={{ padding: '5rem 1.5rem', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2
              className="gradient-text"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 800,
                marginBottom: '1rem',
                
              }}
            >
              Why Zentiam is Different
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '700px', margin: '0 auto' }}>
              We don't just consult. We build, deploy, and deliver results.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}
          >
            {differentiators.map((diff, index) => {
              const Icon = diff.icon;
              return (
                <div
                  key={index}
                  className="glass-card"
                  style={{
                    padding: '2rem',
                    borderColor: `${diff.color}40`
                  }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '16px',
                      background: `${diff.color}20`,
                      border: `2px solid ${diff.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem'
                    }}
                  >
                    <Icon size={32} style={{ color: diff.color }} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'white' }}>
                    {diff.title}
                  </h3>
                  {diff.stat && (
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: diff.color, marginBottom: '0.75rem', textShadow: `0 0 20px ${diff.color}80` }}>
                      {diff.stat}
                    </div>
                  )}
                  <p style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6 }}>
                    {diff.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services - Redesigned */}
      <section style={{ padding: '5rem 1.5rem', background: 'rgba(147, 51, 234, 0.03)', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2
              className="gradient-text"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 800,
                marginBottom: '1rem',
                
              }}
            >
              Our AI Solutions
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.9)' }}>
              End-to-end AI services that deliver real business value
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}
          >
            {services.map((service, index) => {
              const Icon = iconMap[service.icon];
              return (
                <div
                  key={index}
                  className="glass-card scan-effect"
                  style={{
                    padding: '2.5rem',
                    background: `linear-gradient(135deg, ${service.color}10 0%, transparent 100%)`,
                    borderColor: `${service.color}40`
                  }}
                >
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '20px',
                      background: `${service.color}20`,
                      border: `2px solid ${service.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                      boxShadow: `0 0 30px ${service.color}40`
                    }}
                  >
                    <Icon size={36} style={{ color: service.color }} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>
                    {service.title}
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.95)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {service.description}
                  </p>
                  <Link
                    to="/services"
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '0.75rem 1.5rem',
                      background: `linear-gradient(135deg, ${service.color} 0%, ${service.color}dd 100%)`,
                      borderRadius: '8px',
                      border: `2px solid ${service.color}`,
                      transition: 'all 0.3s ease',
                      boxShadow: `0 4px 12px ${service.color}40`
                    }}
                    className="hover-scale"
                  >
                    Learn More <ArrowRight size={18} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section style={{ padding: '5rem 1.5rem', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <SuccessStories />
        </div>
      </section>

      {/* Free AI Audit CTA */}
      <section style={{ padding: '5rem 1.5rem', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <FreeAuditCTA />
        </div>
      </section>

      {/* Final CTA */}
      <section
        style={{
          padding: '6rem 1.5rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2
            className="gradient-text"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 800,
              marginBottom: '1.5rem',
              
            }}
          >
            Ready to Transform Your Business?
          </h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '3rem', color: 'rgba(255, 255, 255, 0.95)' }}>
            Join 150+ companies achieving measurable AI transformation
          </p>
          <Link
            to="/contact"
            style={{
              display: 'inline-block',
              padding: '1.5rem 3.5rem',
              background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
              border: '2px solid #c084fc',
              borderRadius: '50px',
              color: 'white',
              fontWeight: 900,
              fontSize: '1.2rem',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              boxShadow: '0 12px 48px rgba(147, 51, 234, 0.6), 0 0 40px rgba(192, 132, 252, 0.3)',
              transition: 'all 0.3s ease'
            }}
            className="hover-scale"
          >
            Start Your AI Journey
          </Link>
        </div>
      </section>

      {/* Modals */}
      {showAssessment && <AIAssessment onClose={() => setShowAssessment(false)} />}
      {showROICalc && <ROICalculator onClose={() => setShowROICalc(false)} />}
    </div>
  );
};

export default Home;
