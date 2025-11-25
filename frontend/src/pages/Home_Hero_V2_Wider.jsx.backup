import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Cpu, Zap, GraduationCap, ArrowRight, CheckCircle, Sparkles, Target, Award, Rocket, Users } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import AIAssessment from '../components/AIAssessment';
import ROICalculator from '../components/ROICalculator';
import LiveMetrics from '../components/LiveMetrics';
import SuccessStories from '../components/SuccessStories';
import FreeAuditCTA from '../components/FreeAuditCTA';
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

  return (
    <div style={{ background: '#1a1a2e', color: 'white', position: 'relative' }}>
      <ParticleBackground />

      {/* Hero Section - Wider Centered (Version 2) */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '10rem 3rem 4rem',
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
            background: 'radial-gradient(circle at 50% 20%, rgba(147, 51, 234, 0.15), transparent 70%)',
            zIndex: 1
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '1400px' }}>
          {/* Announcement Badge */}
          <div
            className="fade-in-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'rgba(147, 51, 234, 0.1)',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              borderRadius: '50px',
              padding: '0.75rem 1.5rem',
              marginBottom: '2rem',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Sparkles size={18} style={{ color: '#9333ea' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              AI Solutions in Days, Not Months
            </span>
          </div>

          <h1
            className="fade-in-up delay-100"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #9333ea 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Where Intelligence
            <br />
            Meets Impact
          </h1>

          <p
            className="fade-in-up delay-200"
            style={{
              fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
              marginBottom: '3rem',
              maxWidth: '950px',
              margin: '0 auto 3rem',
              color: 'rgba(255, 255, 255, 0.95)',
              lineHeight: 1.6
            }}
          >
            Transform your business with AI solutions that deliver{' '}
            <span style={{ color: '#22c55e', fontWeight: 700 }}>3.7x ROI</span>,{' '}
            <span style={{ color: '#3b82f6', fontWeight: 700 }}>40% productivity gains</span>, and measurable results in weeks.
          </p>

          <div
            className="fade-in-up delay-300"
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '3rem'
            }}
          >
            <button
              onClick={() => setShowAssessment(true)}
              className="btn-neon btn-neon-purple"
              style={{
                padding: '1.25rem 2.5rem',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Brain size={20} />
              Take AI Assessment
            </button>
            <button
              onClick={() => setShowROICalc(true)}
              className="btn-neon btn-neon-blue"
              style={{
                padding: '1.25rem 2.5rem',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
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
              display: 'flex',
              gap: '4rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              maxWidth: '1200px',
              margin: '0 auto'
            }}
          >
            {[
              { label: '78% Enterprise Adoption', value: 'Industry Leading' },
              { label: '150+ Projects Delivered', value: 'Proven Track Record' },
              { label: '$184B+ AI Market', value: 'Growing 28% YoY' }
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#9333ea', marginBottom: '0.25rem' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.75rem' }}>{stat.label}</div>
              </div>
            ))}
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
                textShadow: '0 0 30px rgba(192, 132, 252, 0.5)',
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
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    {diff.title}
                  </h3>
                  {diff.stat && (
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: diff.color, marginBottom: '0.75rem' }}>
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
                textShadow: '0 0 30px rgba(192, 132, 252, 0.5)',
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
                      color: service.color,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: 800,
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    Learn More <ArrowRight size={16} />
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
              textShadow: '0 0 30px rgba(192, 132, 252, 0.5)',
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
              padding: '1.25rem 3rem',
              background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
              border: 'none',
              borderRadius: '50px',
              color: 'white',
              fontWeight: 800,
              fontSize: '1.125rem',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: '0 10px 40px rgba(147, 51, 234, 0.4)',
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
