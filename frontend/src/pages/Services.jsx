import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Cpu, Zap, GraduationCap, CheckCircle, ArrowRight, Rocket, Target, Clock, DollarSign } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import ROICalculator from '../components/ROICalculator';
import '../styles/futuristic.css';

const Services = () => {
  const [showROICalc, setShowROICalc] = useState(false);

  const services = [
    {
      icon: Brain,
      title: 'AI Strategy Consulting',
      description: 'Transform your business vision into an actionable AI roadmap with measurable outcomes.',
      details: [
        'AI readiness assessment and opportunity identification',
        'Custom AI strategy and implementation roadmap',
        'Technology stack recommendations',
        'ROI projections and success metrics',
        'Risk assessment and mitigation planning'
      ],
      deliverables: '4-8 weeks',
      roi: '3.7x average ROI',
      color: '#9333ea',
      gradient: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(147, 51, 234, 0.05) 100%)'
    },
    {
      icon: Cpu,
      title: 'Custom AI Solutions',
      description: 'Production-ready AI systems built for your unique workflows and business processes.',
      details: [
        'Custom AI model development and training',
        'System integration with existing infrastructure',
        'API development and documentation',
        'Performance optimization and scaling',
        'Ongoing monitoring and maintenance'
      ],
      deliverables: '3-6 months',
      roi: 'Up to 10x ROI',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.05) 100%)'
    },
    {
      icon: Zap,
      title: 'Automation & Integration',
      description: 'Intelligent automation that transforms manual processes into streamlined workflows.',
      details: [
        'Process analysis and automation opportunities',
        'Workflow automation implementation',
        'System integration and data pipelines',
        'RPA and intelligent document processing',
        'Performance tracking and optimization'
      ],
      deliverables: '6-12 weeks',
      roi: '40% productivity gain',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.05) 100%)'
    },
    {
      icon: GraduationCap,
      title: 'Training & Enablement',
      description: 'Hands-on training that empowers your team to leverage AI confidently and effectively.',
      details: [
        'Customized training programs for your team',
        'Hands-on workshops and boot camps',
        'Best practices and use case development',
        'Change management support',
        'Ongoing knowledge transfer'
      ],
      deliverables: '2-4 weeks',
      roi: 'Team AI-ready',
      color: '#22c55e',
      gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.05) 100%)'
    }
  ];

  const approach = [
    {
      step: '01',
      title: 'Discovery & Assessment',
      description: 'Deep dive into your business processes, challenges, and objectives to identify AI opportunities.',
      icon: Target,
      color: '#9333ea'
    },
    {
      step: '02',
      title: 'Strategy Development',
      description: 'Create a detailed AI roadmap with prioritized initiatives, timelines, and success metrics.',
      icon: Brain,
      color: '#3b82f6'
    },
    {
      step: '03',
      title: 'Solution Design',
      description: 'Architect the technical solution with technology stack, data requirements, and integration plans.',
      icon: Cpu,
      color: '#22c55e'
    },
    {
      step: '04',
      title: 'Agile Implementation',
      description: 'Build and deploy in rapid sprints with continuous testing and stakeholder feedback.',
      icon: Rocket,
      color: '#f59e0b'
    },
    {
      step: '05',
      title: 'Optimization & Scale',
      description: 'Monitor performance, optimize models, and scale successful implementations across the organization.',
      icon: Zap,
      color: '#9333ea'
    }
  ];

  const benefits = [
    { icon: Clock, label: 'Rapid Deployment', value: 'Days, not months' },
    { icon: DollarSign, label: 'Proven ROI', value: '3.7x average return' },
    { icon: Target, label: 'Success Rate', value: '98% client satisfaction' },
    { icon: Rocket, label: 'Scalable Solutions', value: 'Enterprise-grade' }
  ];

  return (
    <div style={{ background: '#1a1a2e', color: 'white', position: 'relative', minHeight: '100vh' }}>
      <ParticleBackground />

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          minHeight: '70vh',
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
            background: 'radial-gradient(circle at 50% 20%, rgba(147, 51, 234, 0.15), transparent 70%)',
            zIndex: 1
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '900px' }}>
          <div
            className="fade-in-up"
            style={{
              display: 'inline-block',
              padding: '0.5rem 1.5rem',
              background: 'rgba(147, 51, 234, 0.1)',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              borderRadius: '50px',
              marginBottom: '2rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Our Services
          </div>

          <h1
            className="fade-in-up delay-100"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #9333ea 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Intelligence. Automation.
            <br />
            Strategy.
          </h1>

          <p
            className="fade-in-up delay-200"
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.4rem)',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '800px',
              margin: '0 auto 2rem'
            }}
          >
            From consulting to implementation, we deliver AI solutions that transform your business operations and drive measurable results.
          </p>

          <button
            onClick={() => setShowROICalc(true)}
            className="btn-neon btn-neon-purple fade-in-up delay-300"
            style={{
              padding: '1.25rem 2.5rem',
              fontSize: '1rem'
            }}
          >
            Calculate Your ROI
          </button>
        </div>
      </section>

      {/* Benefits Bar */}
      <section style={{ position: 'relative', zIndex: 2, padding: '0 1.5rem 4rem' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
              borderRadius: '24px',
              padding: '2rem',
              border: '1px solid rgba(147, 51, 234, 0.2)'
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2rem'
              }}
            >
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} style={{ textAlign: 'center' }}>
                    <Icon size={32} style={{ color: '#9333ea', marginBottom: '0.75rem' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem', color: 'white' }}>
                      {benefit.value}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                      {benefit.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '5rem 1.5rem', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2
              className="gradient-text"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 700,
                marginBottom: '1rem'
              }}
            >
              Comprehensive AI Services
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              End-to-end solutions that deliver real business value
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem'
            }}
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="glass-card scan-effect"
                  style={{
                    padding: '2.5rem',
                    background: service.gradient,
                    borderColor: `${service.color}40`,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
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
                    <Icon size={40} style={{ color: service.color }} />
                  </div>

                  <h3 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '1rem' }}>
                    {service.title}
                  </h3>

                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {service.description}
                  </p>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.7)' }}>
                      What's Included:
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {service.details.map((detail, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                          <CheckCircle size={18} style={{ color: service.color, flexShrink: 0, marginTop: '0.125rem' }} />
                          <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: '1.5rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.25rem' }}>Timeline</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: service.color }}>{service.deliverables}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.25rem' }}>Expected ROI</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: service.color }}>{service.roi}</div>
                    </div>
                  </div>

                  <Link
                    to="/contact"
                    style={{
                      marginTop: '1.5rem',
                      padding: '1rem',
                      background: service.color,
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontWeight: 600,
                      textAlign: 'center',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      transition: 'all 0.3s ease'
                    }}
                    className="hover-scale"
                  >
                    Get Started <ArrowRight size={18} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section style={{ padding: '5rem 1.5rem', background: 'rgba(147, 51, 234, 0.03)', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2
              className="gradient-text"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 700,
                marginBottom: '1rem'
              }}
            >
              Our Proven Approach
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              A systematic methodology that delivers results
            </p>
          </div>

          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {approach.map((phase, index) => {
              const Icon = phase.icon;
              return (
                <div
                  key={index}
                  className="glass-card"
                  style={{
                    padding: '2rem',
                    marginBottom: '1.5rem',
                    borderColor: `${phase.color}40`,
                    display: 'flex',
                    gap: '2rem',
                    alignItems: 'start'
                  }}
                >
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '16px',
                      background: `${phase.color}20`,
                      border: `2px solid ${phase.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      position: 'relative'
                    }}
                  >
                    <Icon size={32} style={{ color: phase.color }} />
                    <div
                      style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: phase.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}
                    >
                      {phase.step}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                      {phase.title}
                    </h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
                      {phase.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              marginBottom: '1.5rem'
            }}
          >
            Ready to Transform Your Business?
          </h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '3rem', color: 'rgba(255, 255, 255, 0.8)' }}>
            Let's discuss how our AI solutions can drive growth and efficiency in your organization
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/contact"
              style={{
                display: 'inline-block',
                padding: '1.25rem 3rem',
                background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                border: 'none',
                borderRadius: '50px',
                color: 'white',
                fontWeight: 700,
                fontSize: '1.125rem',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                boxShadow: '0 10px 40px rgba(147, 51, 234, 0.4)',
                transition: 'all 0.3s ease'
              }}
              className="hover-scale"
            >
              Schedule Consultation
            </Link>
            <button
              onClick={() => setShowROICalc(true)}
              style={{
                padding: '1.25rem 3rem',
                background: 'transparent',
                border: '2px solid #9333ea',
                borderRadius: '50px',
                color: 'white',
                fontWeight: 700,
                fontSize: '1.125rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              className="hover-scale"
            >
              Calculate ROI
            </button>
          </div>
        </div>
      </section>

      {/* ROI Calculator Modal */}
      {showROICalc && <ROICalculator onClose={() => setShowROICalc(false)} />}
    </div>
  );
};

export default Services;
