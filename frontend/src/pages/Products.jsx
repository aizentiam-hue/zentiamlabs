import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle, Clock, Rocket, Zap, Bot, TrendingUp } from 'lucide-react';
import { mockProducts } from '../mock';
import ParticleBackground from '../components/ParticleBackground';
import '../styles/futuristic.css';

const Products = () => {
  const productColors = ['#9333ea', '#3b82f6', '#22c55e'];
  
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
            background: 'radial-gradient(circle at 50% 20%, rgba(34, 197, 94, 0.15), transparent 70%)',
            zIndex: 1
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '900px' }}>
          <div
            className="fade-in-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '50px',
              padding: '0.75rem 1.5rem',
              marginBottom: '2rem',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Sparkles size={18} style={{ color: '#22c55e' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Zentiam Labs
            </span>
          </div>

          <h1
            className="fade-in-up delay-100"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #6ee7b7 50%, #22c55e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Intelligent Systems
            <br />
            for the Real World
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
            Our in-house innovation lab develops AI-powered automation platforms designed to streamline processes, enhance decision-making, and unlock new revenue streams.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section style={{ padding: '5rem 1.5rem', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2
              className="gradient-text"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                marginBottom: '1rem'
              }}
            >
              Our Product Suite
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.9)' }}>
              Enterprise-grade AI platforms built for scale
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem'
            }}
          >
            {mockProducts.map((product, index) => {
              const color = productColors[index];
              return (
                <div
                  key={product.id}
                  className="glass-card scan-effect"
                  style={{
                    padding: '2.5rem',
                    background: `linear-gradient(135deg, ${color}10 0%, transparent 100%)`,
                    borderColor: `${color}40`,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: product.status === 'Available' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      border: `1px solid ${product.status === 'Available' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                      borderRadius: '50px',
                      padding: '0.5rem 1rem',
                      marginBottom: '1.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      alignSelf: 'flex-start'
                    }}
                  >
                    {product.status === 'Available' ? (
                      <>
                        <CheckCircle size={14} style={{ color: '#22c55e' }} />
                        <span>Available Now</span>
                      </>
                    ) : (
                      <>
                        <Clock size={14} style={{ color: '#f59e0b' }} />
                        <span>Coming Soon</span>
                      </>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>
                    {product.title}
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.95)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {product.description}
                  </p>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.9)' }}>
                      Key Features:
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {product.features.map((feature, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <CheckCircle size={18} style={{ color: color, flexShrink: 0 }} />
                          <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.95)' }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {product.status === 'Available' && (
                    <Link
                      to="/contact"
                      style={{
                        marginTop: 'auto',
                        padding: '1rem',
                        background: color,
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: 800,
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
                      Request Demo <Rocket size={16} />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Highlights */}
      <section style={{ padding: '5rem 1.5rem', background: 'rgba(34, 197, 94, 0.03)', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2
              className="gradient-text"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                marginBottom: '1rem'
              }}
            >
              Built on Cutting-Edge Technology
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.9)' }}>
              State-of-the-art AI infrastructure powering real-world solutions
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}
          >
            {[
              {
                icon: Zap,
                title: 'AI-Powered Automation',
                description: 'Leverage advanced machine learning models to automate complex workflows.',
                color: '#f59e0b',
                image: 'https://images.unsplash.com/photo-1694903089438-bf28d4697d9a'
              },
              {
                icon: Bot,
                title: 'Intelligent Processing',
                description: 'Built with state-of-the-art AI chips and neural architectures.',
                color: '#3b82f6',
                image: 'https://images.unsplash.com/photo-1716436329836-208bea5a55e6'
              },
              {
                icon: TrendingUp,
                title: 'Future-Ready Solutions',
                description: 'Scalable platforms designed for tomorrow\'s challenges.',
                color: '#22c55e',
                image: 'https://images.unsplash.com/photo-1609619385076-36a873425636'
              }
            ].map((tech, index) => {
              const Icon = tech.icon;
              return (
                <div
                  key={index}
                  className="glass-card"
                  style={{
                    padding: '0',
                    overflow: 'hidden',
                    borderColor: `${tech.color}40`
                  }}
                >
                  <div style={{ position: 'relative', height: '250px', overflow: 'hidden' }}>
                    <img
                      src={tech.image}
                      alt={tech.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        background: `${tech.color}20`,
                        border: `2px solid ${tech.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <Icon size={24} style={{ color: tech.color }} />
                    </div>
                  </div>
                  <div style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                      {tech.title}
                    </h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6 }}>
                      {tech.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section style={{ padding: '5rem 1.5rem', position: 'relative', zIndex: 2 }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2
              className="gradient-text"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                marginBottom: '1rem'
              }}
            >
              Real-World Applications
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.9)' }}>
              Transform your business across all departments
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[
              { 
                title: 'Customer Service', 
                desc: 'Automate support with intelligent chatbots and ticketing systems',
                color: '#9333ea'
              },
              { 
                title: 'Operations', 
                desc: 'Streamline workflows and reduce manual processing time',
                color: '#3b82f6'
              },
              { 
                title: 'Analytics', 
                desc: 'Gain actionable insights from your data with predictive models',
                color: '#22c55e'
              },
              { 
                title: 'Sales', 
                desc: 'Identify opportunities and optimize conversion rates with AI',
                color: '#f59e0b'
              }
            ].map((useCase, index) => (
              <div
                key={index}
                className="glass-card hover-scale"
                style={{
                  padding: '2rem',
                  borderColor: `${useCase.color}40`,
                  background: `linear-gradient(135deg, ${useCase.color}08 0%, transparent 100%)`
                }}
              >
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: `${useCase.color}20`,
                    border: `2px solid ${useCase.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    fontSize: '1.5rem'
                  }}
                >
                  {index === 0 ? '💬' : index === 1 ? '⚙️' : index === 2 ? '📊' : '💰'}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                  {useCase.title}
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6 }}>
                  {useCase.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: '6rem 1.5rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2
            className="gradient-text"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              marginBottom: '1.5rem'
            }}
          >
            Ready to Transform Your Operations?
          </h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '3rem', color: 'rgba(255, 255, 255, 0.95)' }}>
            Schedule a demo to see how Zentiam Labs products can revolutionize your business
          </p>
          <Link
            to="/contact"
            style={{
              display: 'inline-block',
              padding: '1.25rem 3rem',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              border: 'none',
              borderRadius: '50px',
              color: 'white',
              fontWeight: 800,
              fontSize: '1.125rem',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: '0 10px 40px rgba(34, 197, 94, 0.4)',
              transition: 'all 0.3s ease'
            }}
            className="hover-scale"
          >
            Schedule Product Demo
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Products;
