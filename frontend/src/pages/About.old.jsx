import React from 'react';
import { Target, Users, Lightbulb, Award } from 'lucide-react';

const About = () => {
  const pillars = [
    {
      icon: Target,
      title: 'Strategic Depth',
      description: 'Experienced consultants who understand business transformation and can identify high-impact AI opportunities.',
      color: 'var(--accent-purple-200)'
    },
    {
      icon: Award,
      title: 'Technical Precision',
      description: 'Built by engineers who craft production-grade systems that scale with your business needs.',
      color: 'var(--accent-blue-200)'
    },
    {
      icon: Lightbulb,
      title: 'Continuous Innovation',
      description: 'Constantly evolving our own AI tools and frameworks, staying at the cutting edge of technology.',
      color: 'var(--accent-orange-200)'
    }
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
            Where Intelligence Meets Impact
          </h1>
          <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
            We're a team of strategists, engineers, and innovators dedicated to helping organizations harness the transformative power of artificial intelligence.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-page)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="heading-1" style={{ marginBottom: '1rem' }}>
              Our Mission
            </h2>
            <p className="body-large">
              To democratize access to enterprise-grade AI solutions and empower organizations of all sizes to compete in an AI-driven world.
            </p>
          </div>

          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: '0.75rem',
              padding: '2rem',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwwfHx8fDE3NjIxNDU5OTh8MA&ixlib=rb-4.1.0&q=85"
              alt="Team collaboration"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem'
              }}
            />
            <p className="body-medium" style={{ marginBottom: '1rem' }}>
              Founded by AI researchers and business strategists, Zentiam was born from a simple observation: many organizations struggle to translate AI potential into real business value.
            </p>
            <p className="body-medium">
              We bridge this gap by combining deep technical expertise with strategic business acumen, delivering solutions that are both innovative and practical.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-section)' }}>
        <div className="container">
          <h2 className="heading-1" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            A New Standard for AI Consulting
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={index}
                  style={{
                    background: pillar.color,
                    borderRadius: '0.75rem',
                    padding: '2rem',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  className="hover-lift"
                >
                  <div
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.75)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}
                  >
                    <Icon size={24} color="var(--text-primary)" />
                  </div>
                  <h3 className="heading-3" style={{ marginBottom: '0.75rem' }}>
                    {pillar.title}
                  </h3>
                  <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-page)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="heading-1" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            Our Values
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
              }}
            >
              <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>
                Client-Centric Innovation
              </h3>
              <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                Every solution we build is tailored to your specific needs, challenges, and goals. No cookie-cutter approaches.
              </p>
            </div>

            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
              }}
            >
              <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>
                Transparency & Trust
              </h3>
              <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                We believe in clear communication, realistic timelines, and honest assessments of what AI can and cannot do.
              </p>
            </div>

            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
              }}
            >
              <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>
                Excellence in Execution
              </h3>
              <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
                From strategy to deployment, we maintain the highest standards of quality and professionalism.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Image Section */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-section)' }}>
        <div className="container" style={{ maxWidth: '900px', textAlign: 'center' }}>
          <h2 className="heading-1" style={{ marginBottom: '2rem' }}>
            Meet Our Experts
          </h2>
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHx0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwwfHx8fDE3NjIxNDU5OTh8MA&ixlib=rb-4.1.0&q=85"
            alt="Our team"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
            }}
          />
          <p className="body-large" style={{ marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
            A diverse team of AI researchers, data scientists, business strategists, and software engineers united by a passion for innovation.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
