import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, Sparkles } from 'lucide-react';

const FreeAuditCTA = () => {
  const [spotsLeft, setSpotsLeft] = useState(7);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 });
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset to 24 hours
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    // Simulate spots being taken
    const spotsTimer = setInterval(() => {
      setSpotsLeft(prev => {
        const newSpots = prev - 1;
        return newSpots < 3 ? Math.floor(Math.random() * 5) + 3 : newSpots;
      });
    }, 45000); // Every 45 seconds

    return () => {
      clearInterval(timer);
      clearInterval(spotsTimer);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Save to database (using newsletter endpoint for now)
    try {
      const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
      await fetch(`${API}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      setSubmitted(true);
      setTimeout(() => {
        window.location.href = '/contact';
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
        borderRadius: '16px',
        padding: 'clamp(1.5rem, 5vw, 3rem)',
        position: 'relative',
        overflow: 'hidden',
        color: 'white',
        border: '2px solid rgba(147, 51, 234, 0.3)'
      }}
      className="holographic"
    >
      {/* Animated background effects */}
      <div className="scan-effect" />
      
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '50px',
              marginBottom: '1rem',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Sparkles size={16} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Limited Time Offer
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', fontWeight: 700, marginBottom: '0.75rem' }}>
            Free AI Strategy Audit
          </h2>
          <p style={{ fontSize: 'clamp(0.9rem, 3vw, 1.125rem)', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
            Get a personalized AI roadmap for your business. Discover opportunities worth $100K+ in potential savings.
          </p>
        </div>

        {/* Countdown & Spots */}
        <div
          className="audit-stats-grid"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '1.5rem',
            maxWidth: '600px',
            margin: '0 auto 1.5rem'
          }}
        >
          {/* Countdown */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Clock size={18} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Time Left</span>
            </div>
            <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 700 }}>{String(timeLeft.hours).padStart(2, '0')}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Hours</div>
              </div>
              <div style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 700 }}>:</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 700 }}>{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Mins</div>
              </div>
              <div style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 700 }}>:</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 700 }}>{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Secs</div>
              </div>
            </div>
          </div>

          {/* Spots Left */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Spots Available</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', fontWeight: 700, color: '#22c55e' }}>{spotsLeft}</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>This Week</span>
            </div>
          </div>
        </div>

        {/* Form or Success */}
        {submitted ? (
          <div
            style={{
              maxWidth: '500px',
              margin: '0 auto',
              padding: '1.5rem',
              background: 'rgba(34, 197, 94, 0.2)',
              borderRadius: '12px',
              border: '2px solid rgba(34, 197, 94, 0.5)',
              textAlign: 'center'
            }}
            className="fade-in-scale"
          >
            <CheckCircle size={40} style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.375rem' }}>You're In!</h3>
            <p style={{ fontSize: '0.9rem' }}>Redirecting to booking page...</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              maxWidth: '500px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email"
              required
              style={{
                width: '100%',
                padding: '0.875rem 1.25rem',
                borderRadius: '10px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '1rem',
                backdropFilter: 'blur(10px)',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '1rem 2rem',
                background: 'white',
                color: '#7c3aed',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                boxShadow: '0 4px 20px rgba(255, 255, 255, 0.3)'
              }}
              className="hover-scale"
            >
              Claim My Spot
            </button>
          </form>
        )}

        {/* What You Get */}
        <div style={{ marginTop: '1.5rem', maxWidth: '600px', margin: '1.5rem auto 0' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '1rem',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              What You'll Get:
            </h4>
            <div className="audit-benefits-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
              {[
                '60-min strategy session',
                'AI readiness assessment',
                'Custom implementation roadmap',
                'ROI projections',
                'Technology recommendations',
                'Quick-win opportunities'
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={14} style={{ flexShrink: 0, color: '#22c55e' }} />
                  <span style={{ fontSize: '0.8rem' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .audit-stats-grid {
            flex-direction: row !important;
          }
          .audit-stats-grid > div {
            flex: 1;
          }
          .audit-stats-grid > div:last-child {
            flex-direction: column !important;
            text-align: center;
          }
          .audit-stats-grid > div:last-child > div:last-child {
            flex-direction: column !important;
          }
          .audit-benefits-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FreeAuditCTA;
