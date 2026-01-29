import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import SEO from '../components/SEO';
import '../styles/futuristic.css';

const Blog = () => {
  const blogPosts = [
    {
      slug: 'ai-consulting-bangalore',
      title: 'AI Consulting in Bangalore: From Idea to Implementation',
      excerpt: 'Discover how businesses in Bangalore are leveraging AI consulting services to transform operations. Learn the step-by-step process from identifying AI opportunities to successful implementation.',
      date: '2026-01-25',
      readTime: '8 min read',
      category: 'AI Strategy',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      featured: true
    },
    {
      slug: 'no-code-ai-automation',
      title: 'No-Code AI Automation with n8n for SMEs in India',
      excerpt: 'How small and medium enterprises in India can leverage no-code AI automation tools like n8n to streamline workflows without heavy development investment.',
      date: '2026-01-20',
      readTime: '6 min read',
      category: 'Automation',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      featured: false
    },
    {
      slug: 'ai-strategy-guide',
      title: 'AI Strategy Guide for Indian Businesses: 2026 Edition',
      excerpt: 'A comprehensive guide to developing an AI strategy for your business in India. Understand market trends, implementation approaches, and ROI expectations.',
      date: '2026-01-15',
      readTime: '10 min read',
      category: 'Strategy',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      featured: false
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{ background: '#1a1a2e', color: 'white', position: 'relative', minHeight: '100vh' }}>
      <SEO 
        title="AI Insights & Resources | Zentiam Blog"
        description="Expert insights on AI consulting, automation strategies, and digital transformation for Indian businesses. Learn from Zentiam's AI consultants in Bangalore."
        keywords="AI blog, AI consulting insights, AI automation tips, AI strategy guide, machine learning resources, AI trends India"
        canonical="/blog"
      />
      <ParticleBackground />

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          minHeight: '50vh',
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
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Insights & Resources
          </div>

          <h1
            className="fade-in-up delay-100"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #9333ea 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            AI Consulting Blog
          </h1>

          <p
            className="fade-in-up delay-200"
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.35rem)',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.95)',
              maxWidth: '700px',
              margin: '0 auto'
            }}
          >
            Expert insights, practical guides, and industry trends from Zentiam's AI consultants in Bangalore.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section style={{ padding: '3rem 1.5rem 5rem', position: 'relative', zIndex: 2 }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
              gap: '2rem'
            }}
          >
            {blogPosts.map((post, index) => (
              <Link
                to={`/blog/${post.slug}`}
                key={index}
                className="glass-card hover-lift"
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                  overflow: 'hidden',
                  borderColor: post.featured ? 'rgba(147, 51, 234, 0.4)' : 'rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Image */}
                <div
                  style={{
                    height: '200px',
                    background: `linear-gradient(to bottom, transparent 60%, rgba(26, 26, 46, 0.9)), url(${post.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                  }}
                >
                  {post.featured && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '50px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                      }}
                    >
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Tag size={14} />
                      {post.category}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={14} />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.3 }}>
                    {post.title}
                  </h2>

                  <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {post.excerpt}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} />
                      {formatDate(post.date)}
                    </span>
                    <span style={{ color: '#9333ea', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Read More <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '3rem 1.5rem 5rem', position: 'relative', zIndex: 2 }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div
            className="glass-card"
            style={{
              padding: '3rem',
              background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
              borderColor: 'rgba(147, 51, 234, 0.3)'
            }}
          >
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>
              Ready to Implement AI in Your Business?
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1.5rem' }}>
              Book a free consultation with our AI experts in Bangalore and get a personalized roadmap.
            </p>
            <Link
              to="/contact"
              className="btn-neon btn-neon-purple"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem' }}
            >
              Book AI Consultation <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
