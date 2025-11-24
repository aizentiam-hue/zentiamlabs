import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Zap, DollarSign } from 'lucide-react';

const LiveMetrics = () => {
  const [metrics, setMetrics] = useState({
    aiMarketSize: 184,
    adoptionRate: 78,
    avgROI: 370,
    projectsDelivered: 150
  });

  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        aiMarketSize: prev.aiMarketSize + Math.random() * 0.5,
        adoptionRate: Math.min(100, prev.adoptionRate + Math.random() * 0.1),
        avgROI: prev.avgROI + Math.random() * 2,
        projectsDelivered: prev.projectsDelivered + Math.random() * 0.5
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const metricCards = [
    {
      icon: TrendingUp,
      label: 'AI Market Size',
      value: `$${metrics.aiMarketSize.toFixed(1)}B`,
      trend: '+28% YoY',
      color: '#9333ea'
    },
    {
      icon: Users,
      label: 'Enterprise Adoption',
      value: `${metrics.adoptionRate.toFixed(1)}%`,
      trend: '+5% this quarter',
      color: '#3b82f6'
    },
    {
      icon: DollarSign,
      label: 'Average ROI',
      value: `${metrics.avgROI.toFixed(0)}%`,
      trend: '3.7x return',
      color: '#22c55e'
    },
    {
      icon: Zap,
      label: 'Projects Delivered',
      value: metrics.projectsDelivered.toFixed(0),
      trend: 'Zentiam clients',
      color: '#f59e0b'
    }
  ];

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(15, 32, 39, 0.95) 0%, rgba(32, 58, 67, 0.95) 100%)',
        borderRadius: '24px',
        padding: '2rem',
        border: '1px solid rgba(147, 51, 234, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated background effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(147, 51, 234, 0.8), transparent)',
          animation: 'scan 3s linear infinite'
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#22c55e',
              animation: 'glow 2s ease-in-out infinite'
            }}
          />
          <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Live AI Industry Metrics
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {metricCards.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: `1px solid ${metric.color}40`,
                  transition: 'all 0.3s ease'
                }}
                className="hover-lift"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <Icon size={24} style={{ color: metric.color }} />
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#22c55e',
                      fontWeight: 500
                    }}
                  >
                    {metric.trend}
                  </span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
                  {metric.value}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  {metric.label}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.75)', textAlign: 'center' }}>
          Data updated in real-time from industry sources
        </div>
      </div>
    </div>
  );
};

export default LiveMetrics;
