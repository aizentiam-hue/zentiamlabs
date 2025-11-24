import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Cpu, Zap, GraduationCap, CheckCircle, ArrowRight } from 'lucide-react';
import { mockServices } from '../mock';

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

const Services = () => {
  const benefits = [
    'Customized AI roadmap for your organization',
    'Access to cutting-edge AI technologies',
    'Scalable solutions that grow with your business',
    'Ongoing support and optimization',
    'Training and knowledge transfer',
    'Measurable ROI and performance metrics'
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          padding: '10rem 1.5rem 4rem',
          background: 'var(--gradient-hero-warm)',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 className="heading-hero" style={{ marginBottom: '1.5rem' }}>
            Intelligence. Automation. Strategy.
          </h1>
          <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
            From consulting to implementation, we deliver AI solutions that transform your business operations and drive measurable results.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-page)' }}>
        <div className="container">
          <div className="service-grid" style={{ gap: '2rem' }}>
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
                      width: '3.5rem',
                      height: '3.5rem',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.75)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem'
                    }}
                  >
                    <Icon size={28} color="var(--text-primary)" />
                  </div>
                  <h3 className="heading-2" style={{ marginBottom: '1rem' }}>
                    {service.title}
                  </h3>
                  <p className="body-medium" style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                    {service.description}
                  </p>
                  <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
                    {service.details}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Approach Section with Image */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-section)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3rem',
              alignItems: 'center'
            }}
          >
            <div>
              <h2 className="heading-1" style={{ marginBottom: '1.5rem' }}>
                Our Approach
              </h2>
              <p className="body-medium" style={{ marginBottom: '1rem' }}>
                We follow a proven methodology that combines strategic thinking with technical excellence:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                {['Discovery & Assessment', 'Strategy Development', 'Solution Design', 'Implementation', 'Optimization & Support'].map((step, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        background: 'var(--accent-blue-400)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 500,
                        fontSize: '0.875rem'
                      }}
                    >
                      {index + 1}
                    </div>
                    <span className="body-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1529119368496-2dfda6ec2804?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwyfHxidXNpbmVzcyUyMHN0cmF0ZWd5fGVufDB8fHx8MTc2MjI0MzIzMnww&ixlib=rb-4.1.0&q=85"
                alt="Strategic consulting"
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

      {/* Benefits Section */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-page)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="heading-1" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            Why Partner with Zentiam
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem'
            }}
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
                }}
              >
                <CheckCircle size={20} color="var(--accent-green-200)" style={{ flexShrink: 0 }} />
                <span className="body-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Image Section */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-section)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="heading-1" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Serving Diverse Industries
          </h2>
          <img
            src="https://images.unsplash.com/photo-1523875194681-bedd468c58bf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwzfHxidXNpbmVzcyUyMHN0cmF0ZWd5fGVufDB8fHx8MTc2MjI0MzIzMnww&ixlib=rb-4.1.0&q=85"
            alt="Strategic planning"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
            }}
          />
          <p className="body-large" style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
            We work with organizations across technology, finance, healthcare, retail, manufacturing, and more.
          </p>
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
            Ready to Transform Your Business?
          </h2>
          <p className="body-large" style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
            Let's discuss how our AI solutions can drive growth and efficiency in your organization.
          </p>
          <Link to="/contact" className="btn-primary button-text">
            Schedule a Consultation <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
