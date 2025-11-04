import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle, Clock } from 'lucide-react';
import { mockProducts } from '../mock';

const Products = () => {
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
            <Sparkles size={14} />
            <span>Zentiam Labs</span>
          </div>
          <h1 className="heading-hero" style={{ marginBottom: '1.5rem' }}>
            Intelligent Systems for the Real World
          </h1>
          <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
            Our in-house innovation lab develops AI-powered automation platforms designed to streamline processes, enhance decision-making, and unlock new revenue streams.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-page)' }}>
        <div className="container">
          <div className="product-grid" style={{ gap: '2rem' }}>
            {mockProducts.map((product, index) => (
              <div
                key={product.id}
                className="product-card"
                style={{
                  background: index === 0 ? 'var(--accent-purple-200)' : index === 1 ? 'var(--accent-blue-200)' : 'var(--accent-orange-200)'
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '2rem',
                    padding: '0.25rem 0.75rem',
                    marginBottom: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em'
                  }}
                >
                  {product.status === 'Available' ? (
                    <>
                      <CheckCircle size={12} />
                      <span>Available</span>
                    </>
                  ) : (
                    <>
                      <Clock size={12} />
                      <span>Coming Soon</span>
                    </>
                  )}
                </div>

                <h3 className="heading-2" style={{ marginBottom: '1rem' }}>
                  {product.title}
                </h3>
                <p className="body-medium" style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                  {product.description}
                </p>

                <div style={{ marginTop: 'auto' }}>
                  <h4 className="body-small" style={{ fontWeight: 500, marginBottom: '0.75rem' }}>
                    Key Features:
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {product.features.map((feature, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={16} color="var(--text-primary)" style={{ flexShrink: 0 }} />
                        <span className="body-small">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {product.status === 'Available' && (
                  <button
                    className="btn-primary button-text"
                    style={{ marginTop: '1.5rem', width: '100%' }}
                    onClick={() => alert('Product demo request - will be connected to backend')}
                  >
                    Request Demo
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation Images Section */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-section)' }}>
        <div className="container">
          <h2 className="heading-1" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            Built on Cutting-Edge Technology
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}
          >
            <div>
              <img
                src="https://images.unsplash.com/photo-1694903089438-bf28d4697d9a"
                alt="AI automation"
                style={{
                  width: '100%',
                  height: '250px',
                  objectFit: 'cover',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
                }}
              />
              <h3 className="heading-3" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                AI-Powered Automation
              </h3>
              <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
                Leverage advanced machine learning models to automate complex workflows.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1716436329836-208bea5a55e6"
                alt="Intelligent systems"
                style={{
                  width: '100%',
                  height: '250px',
                  objectFit: 'cover',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
                }}
              />
              <h3 className="heading-3" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                Intelligent Processing
              </h3>
              <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
                Built with state-of-the-art AI chips and neural architectures.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1609619385076-36a873425636"
                alt="Futuristic technology"
                style={{
                  width: '100%',
                  height: '250px',
                  objectFit: 'cover',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
                }}
              />
              <h3 className="heading-3" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                Future-Ready Solutions
              </h3>
              <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
                Scalable platforms designed for tomorrow's challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-page)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="heading-1" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            Real-World Applications
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {[
              { title: 'Customer Service', desc: 'Automate support with intelligent chatbots and ticketing systems' },
              { title: 'Operations', desc: 'Streamline workflows and reduce manual processing time' },
              { title: 'Analytics', desc: 'Gain actionable insights from your data with predictive models' },
              { title: 'Sales', desc: 'Identify opportunities and optimize conversion rates with AI' }
            ].map((useCase, index) => (
              <div
                key={index}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
                }}
                className="hover-lift"
              >
                <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>
                  {useCase.title}
                </h3>
                <p className="body-small" style={{ color: 'var(--text-secondary)' }}>
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
          padding: '5rem 1.5rem',
          background: 'var(--alternate-gradient-hero-warm)',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 className="heading-1" style={{ marginBottom: '1rem' }}>
            Interested in Our Products?
          </h2>
          <p className="body-large" style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
            Schedule a demo to see how Zentiam Labs products can transform your operations.
          </p>
          <Link to="/contact" className="btn-primary button-text">
            Schedule a Product Demo
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Products;
