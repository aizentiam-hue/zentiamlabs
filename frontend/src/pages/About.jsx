import React from 'react';
import { Target, Users, Lightbulb, Award, Rocket, Zap, Brain, TrendingUp } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import SEO from '../components/SEO';
import '../styles/futuristic.css';

const About = () => {
  const pillars = [
    {
      icon: Target,
      title: 'Strategic Depth',
      description: 'Experienced consultants who understand business transformation and can identify high-impact AI opportunities.',
      stat: '15+ Years',
      detail: 'Combined Experience',
      color: '#9333ea'
    },
    {
      icon: Award,
      title: 'Technical Precision',
      description: 'Built by engineers who craft production-grade systems that scale with your business needs.',
      stat: '150+',
      detail: 'Projects Delivered',
      color: '#3b82f6'
    },
    {
      icon: Lightbulb,
      title: 'Continuous Innovation',
      description: 'Constantly evolving our own AI tools and frameworks, staying at the cutting edge of technology.',
      stat: 'Proprietary',
      detail: 'AI Frameworks',
      color: '#22c55e'
    }
  ];

  const values = [
    {
      icon: Users,
      title: 'Client-Centric Innovation',
      description: 'Every solution we build is tailored to your specific needs, challenges, and goals. No cookie-cutter approaches.',
      color: '#9333ea'
    },
    {
      icon: Zap,
      title: 'Speed & Excellence',
      description: 'We deliver AI solutions in days, not months, without compromising on quality. Rapid prototyping meets enterprise-grade implementation.',
      color: '#f59e0b'
    },
    {
      icon: Brain,
      title: 'Transparency & Trust',
      description: 'Clear communication, realistic timelines, and honest assessments. We build partnerships, not just projects.',
      color: '#3b82f6'
    },
    {
      icon: TrendingUp,
      title: 'Results-Driven',
      description: 'Every engagement is measured by real business outcomes. Our success is tied to your ROI and measurable impact.',
      color: '#22c55e'
    }
  ];

  const stats = [
    { value: '3.7x', label: 'Average Client ROI' },
    { value: '78%', label: 'Enterprise Adoption Rate' },
    { value: '150+', label: 'AI Projects Delivered' },
    { value: '40%', label: 'Avg Productivity Gain' }
  ];

  return (
    <div style={{ background: '#1a1a2e', color: 'white', position: 'relative', minHeight: '100vh' }}>
      <SEO 
        title="About Zentiam | AI Consulting Firm | AI Experts Team"
        description="Based in Bengaluru, India, Zentiam is an AI consulting firm serving clients worldwide. Our team of AI experts and strategists help organizations implement practical AI solutions with measurable ROI."
        keywords="AI consulting firm, AI experts team, about zentiam, AI consultants Bangalore, AI strategy consulting, machine learning consultants, AI agency"
        canonical="/about"
      />
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
            About Zentiam
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
            AI Consulting Firm
            <br />
            in Bangalore
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
            Zentiam is a leading AI consulting firm in Bangalore, India. Our team of AI experts and strategists help businesses harness the transformative power of artificial intelligence with practical, ROI-driven solutions.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ position: 'relative', zIndex: 2, padding: '3rem 1.5rem' }}>
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                gap: '2rem',
                textAlign: 'center'
              }}
            >
              {stats.map((stat, index) => (
                <div key={index}>
                  <div
                    style={{
                      fontSize: '3rem',
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #9333ea, #3b82f6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: '0.5rem'
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '5rem 1.5rem', position: 'relative', zIndex: 2 }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
              gap: '3rem',
              alignItems: 'center'
            }}
          >
            <div>
              <h2
                className="gradient-text"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                  fontWeight: 800,
                  marginBottom: '1.5rem'
                }}
              >
                Our Mission
              </h2>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.95)', marginBottom: '1.5rem' }}>
                To democratize access to enterprise-grade AI solutions and empower organizations of all sizes to compete in an AI-driven world.
              </p>
              <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.9)' }}>
                Founded by AI researchers and business strategists, Zentiam bridges the gap between AI potential and real business value. We don't just consult—we build, deploy, and deliver measurable results.
              </p>
            </div>

            <div
              className="glass-card"
              style={{
                padding: '2rem',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)'
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwwfHx8fDE3NjIxNDU5OTh8MA&ixlib=rb-4.1.0&q=85"
                alt="Team collaboration"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '16px',
                  boxShadow: '0 20px 60px rgba(59, 130, 246, 0.3)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Pillars */}
      <section style={{ padding: '5rem 1.5rem', background: 'rgba(147, 51, 234, 0.03)', position: 'relative', zIndex: 2 }}>
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
              A New Standard for AI Consulting
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.9)' }}>
              What makes Zentiam different
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '2rem'
            }}
          >
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={index}
                  className="glass-card scan-effect"
                  style={{
                    padding: '2.5rem',
                    background: `linear-gradient(135deg, ${pillar.color}10 0%, transparent 100%)`,
                    borderColor: `${pillar.color}40`,
                    textAlign: 'center'
                  }}
                >
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '20px',
                      background: `${pillar.color}20`,
                      border: `2px solid ${pillar.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem',
                      boxShadow: `0 0 30px ${pillar.color}40`
                    }}
                  >
                    <Icon size={40} style={{ color: pillar.color }} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>
                    {pillar.title}
                  </h3>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: pillar.color, marginBottom: '0.5rem' }}>
                    {pillar.stat}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '1.5rem' }}>
                    {pillar.detail}
                  </div>
                  <p style={{ color: 'rgba(255, 255, 255, 0.95)', lineHeight: 1.6 }}>
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
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
              Our Values
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.9)' }}>
              The principles that guide everything we do
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
              gap: '2rem'
            }}
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="glass-card"
                  style={{
                    padding: '2rem',
                    borderColor: `${value.color}40`
                  }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '16px',
                      background: `${value.color}20`,
                      border: `2px solid ${value.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem'
                    }}
                  >
                    <Icon size={28} style={{ color: value.color }} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                    {value.title}
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6 }}>
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{ padding: '5rem 1.5rem', background: 'rgba(59, 130, 246, 0.03)', position: 'relative', zIndex: 2 }}>
        <div className="container" style={{ maxWidth: '1000px', textAlign: 'center' }}>
          <h2
            className="gradient-text"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
                
              fontWeight: 800,
              marginBottom: '2rem'
            }}
          >
            Meet Our Experts
          </h2>
          <div
            className="glass-card"
            style={{
              padding: '2rem',
              overflow: 'hidden'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHx0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwwfHx8fDE3NjIxNDU5OTh8MA&ixlib=rb-4.1.0&q=85"
              alt="Our team"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(147, 51, 234, 0.3)'
              }}
            />
          </div>
          <p style={{ fontSize: '1.125rem', marginTop: '2rem', color: 'rgba(255, 255, 255, 0.95)', lineHeight: 1.6 }}>
            A diverse team of AI researchers, data scientists, business strategists, and software engineers united by a passion for innovation and delivering measurable business impact.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 1.5rem', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2
            className="gradient-text"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
                
              fontWeight: 800,
              marginBottom: '1.5rem'
            }}
          >
            Ready to Work Together?
          </h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '3rem', color: 'rgba(255, 255, 255, 0.95)' }}>
            Let's transform your business with intelligent AI solutions
          </p>
          <a
            href="/contact"
            style={{
              display: 'inline-block',
              padding: '1.25rem 3rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none',
              borderRadius: '50px',
              color: 'white',
              fontWeight: 800,
              fontSize: '1.125rem',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.3s ease'
            }}
            className="hover-scale"
          >
            Get Started
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
