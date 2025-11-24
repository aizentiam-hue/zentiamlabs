import React, { useState } from 'react';
import { TrendingUp, ArrowRight, Clock, DollarSign, Users } from 'lucide-react';

const SuccessStories = () => {
  const [selectedStory, setSelectedStory] = useState(0);

  const stories = [
    {
      industry: 'Retail',
      company: 'Major Retail Chain',
      challenge: 'Siloed data, inconsistent customer experience, slow sales cycles',
      solution: 'AI-driven omnichannel integration and customer journey optimization',
      results: [
        { label: 'Sales Increase', value: '+20%', icon: TrendingUp },
        { label: 'Cost Reduction', value: '-15%', icon: DollarSign },
        { label: 'Customer Engagement', value: '+30%', icon: Users },
        { label: 'Implementation Time', value: '4 months', icon: Clock }
      ],
      roi: '4.5x',
      color: '#9333ea'
    },
    {
      industry: 'Healthcare',
      company: 'Healthcare Provider Network',
      challenge: 'Slow diagnostics, unpredictable sales pipeline, inefficient marketing',
      solution: 'AI-driven diagnostics and sales lead qualification system',
      results: [
        { label: 'Diagnostic Speed', value: '+40%', icon: TrendingUp },
        { label: 'Qualified Leads', value: '+22%', icon: Users },
        { label: 'ROI', value: '3.2x', icon: DollarSign },
        { label: 'Implementation', value: '5 months', icon: Clock }
      ],
      roi: '3.2x',
      color: '#3b82f6'
    },
    {
      industry: 'Real Estate',
      company: 'Property Tech Platform',
      challenge: 'Manual pricing, high customer service costs, scalability issues',
      solution: 'AI-powered property pricing and automated customer support',
      results: [
        { label: 'Cost Savings', value: '$1B annually', icon: DollarSign },
        { label: 'Calls Automated', value: '40%', icon: Users },
        { label: 'Pricing Accuracy', value: '+95%', icon: TrendingUp },
        { label: 'Go-Live', value: '3 months', icon: Clock }
      ],
      roi: '10x+',
      color: '#22c55e'
    },
    {
      industry: 'Manufacturing',
      company: 'Industrial Equipment Manufacturer',
      challenge: 'Reactive maintenance, unplanned downtime, manual processes',
      solution: 'AI predictive maintenance and digital manufacturing hub',
      results: [
        { label: 'Downtime Reduced', value: '-35%', icon: TrendingUp },
        { label: 'Maintenance Costs', value: '-25%', icon: DollarSign },
        { label: 'Productivity', value: '+28%', icon: Users },
        { label: 'Payback Period', value: '8 months', icon: Clock }
      ],
      roi: '5.8x',
      color: '#f59e0b'
    }
  ];

  const currentStory = stories[selectedStory];

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 className="heading-1 gradient-text" style={{ marginBottom: '1rem' }}>
          Real Results, Real Impact
        </h2>
        <p className="body-large" style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
          See how we've helped organizations achieve measurable transformation
        </p>
      </div>

      {/* Story Selector */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {stories.map((story, index) => (
          <button
            key={index}
            onClick={() => setSelectedStory(index)}
            style={{
              padding: '0.75rem 1.5rem',
              background: selectedStory === index ? story.color : 'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${selectedStory === index ? story.color : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '50px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: selectedStory === index ? 600 : 400,
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
            className="hover-scale"
          >
            {story.industry}
          </button>
        ))}
      </div>

      {/* Story Content */}
      <div
        className="glass-card fade-in-scale"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          padding: '3rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${currentStory.color}, transparent)`,
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          {/* Left: Story Details */}
          <div>
            <div
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                background: `${currentStory.color}20`,
                borderRadius: '50px',
                color: currentStory.color,
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: '1.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {currentStory.industry}
            </div>

            <h3 className="heading-2" style={{ marginBottom: '1rem', color: 'white' }}>
              {currentStory.company}
            </h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Challenge
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{currentStory.challenge}</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Solution
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{currentStory.solution}</p>
            </div>

            {/* ROI Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 1.5rem',
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
                border: '2px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '16px',
                marginTop: '1rem'
              }}
            >
              <TrendingUp size={24} color="#22c55e" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.9)' }}>ROI Achieved</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e' }}>{currentStory.roi}</div>
              </div>
            </div>
          </div>

          {/* Right: Results Grid */}
          <div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', marginBottom: '1.5rem' }}>
              Key Results
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {currentStory.results.map((result, index) => {
                const Icon = result.icon;
                return (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    className="hover-lift"
                  >
                    <Icon size={20} style={{ color: currentStory.color, marginBottom: '0.75rem' }} />
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
                      {result.value}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                      {result.label}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => window.location.href = '/contact'}
              style={{
                marginTop: '2rem',
                width: '100%',
                padding: '1rem',
                background: currentStory.color,
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              className="hover-scale"
            >
              Get Similar Results <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .glass-card > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SuccessStories;
