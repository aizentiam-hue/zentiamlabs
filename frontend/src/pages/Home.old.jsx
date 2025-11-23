import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Cpu, Zap, GraduationCap, ArrowRight, CheckCircle, Sparkles, Target, Award } from 'lucide-react';
import { mockServices, mockStats, mockTestimonials } from '../mock';
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

const colorMap = {
  purple: 'var(--accent-purple-200)',
  blue: 'var(--accent-blue-200)',
  orange: 'var(--accent-orange-200)',
  green: 'var(--accent-green-200)'
};

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '8rem 1.5rem 3rem',
          background: 'var(--gradient-hero-warm)',
          overflow: 'hidden'
        }}
      >
        {/* Background Image */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1644088379091-d574269d422f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxuZXVyYWwlMjBuZXR3b3JrfGVufDB8fHx8MTc2MjI0MzE5OHww&ixlib=rb-4.1.0&q=85)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
            zIndex: 0
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '900px' }}>
          {/* Announcement Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '2rem',
              padding: '0.5rem 1rem',
              marginBottom: '1.5rem',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)'
            }}
            className="mono-text"
          >
            <CheckCircle size={14} />
            <span>Trusted by Leading Enterprises</span>
          </div>

          <h1 className="heading-hero" style={{ marginBottom: '1.5rem' }}>
            Transform Your Business with Intelligent Automation
          </h1>

          <p className="body-large" style={{ marginBottom: '2rem', maxWidth: '700px', margin: '0 auto 2rem' }}>
            Zentiam helps forward-thinking companies design, build, and scale custom AI solutions that drive efficiency,
            innovation, and growth.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Link to="/contact" className="btn-primary button-text">
              Book a Strategy Consultation
            </Link>
            <Link to="/products" className="btn-secondary button-text">
              Explore Our AI Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-page)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              textAlign: 'center'
            }}
          >
            {mockStats.map((stat, index) => (
              <div key={index}>
                <div className="heading-hero" style={{ color: 'var(--accent-blue-400)', marginBottom: '0.5rem' }}>
                  {stat.value}
                </div>
                <div className="body-small" style={{ color: 'var(--text-secondary)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-section)' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 className="heading-1" style={{ marginBottom: '1.5rem' }}>
              Your Partner in AI Transformation
            </h2>
            <p className="body-large" style={{ marginBottom: '1rem' }}>
              At Zentiam, we bridge the gap between strategy and execution. Our team of AI strategists, data engineers,
              and automation experts work with you to design intelligent systems that fit your unique goals.
            </p>
            <p className="body-large">
              Whether you're a startup building with AI or an enterprise modernizing workflows, we help you move from
              ideas to measurable outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-page)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="heading-1" style={{ marginBottom: '1rem' }}>
              Intelligence. Automation. Strategy.
            </h2>
            <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
              From consulting to implementation, we deliver AI that performs.
            </p>
          </div>

          <div className="service-grid">
            {mockServices.map((service) => {
              const Icon = iconMap[service.icon];
              return (
                <div
                  key={service.id}
                  className="service-card"
                  style={{ background: colorMap[service.color] }}
                >
                  <div
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}
                  >
                    <Icon size={24} color="var(--text-primary)" />
                  </div>
                  <h3 className="heading-3" style={{ marginBottom: '0.75rem' }}>
                    {service.title}
                  </h3>
                  <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/services" className="btn-primary button-text">
              View All Services <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-section)' }}>
        <div className="container">
          <h2 className="heading-1" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            Trusted by Industry Leaders
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {mockTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                style={
                  {
                    background: 'var(--bg-card)',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
                  }
                }
              >
                <p className="body-medium" style={{ marginBottom: '1rem', fontStyle: 'italic' }}>
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="body-small" style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                    {testimonial.name}
                  </div>
                  <div className="caption" style={{ color: 'var(--text-muted)' }}>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: '5rem 1.5rem',
          background: 'var(--alternate-gradient-hero-warm)',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 className="heading-1" style={{ marginBottom: '1rem' }}>
            Let's Design Your AI Future
          </h2>
          <p className="body-large" style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
            Schedule a discovery session with our AI strategy team to identify opportunities tailored to your business.
          </p>
          <Link to="/contact" className="btn-primary button-text">
            Book a Consultation
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
