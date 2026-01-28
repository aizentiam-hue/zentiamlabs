import React, { useState } from 'react';
import { Brain, TrendingUp, Users, Zap, CheckCircle, Share2, Download, X } from 'lucide-react';

const AIAssessment = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const questions = [
    {
      id: 'current_ai',
      question: 'What is your current AI adoption level?',
      options: [
        { value: 0, label: 'No AI implementation yet' },
        { value: 25, label: 'Exploring AI possibilities' },
        { value: 50, label: 'Pilot projects in progress' },
        { value: 75, label: 'AI in production for some processes' },
        { value: 100, label: 'AI integrated across organization' }
      ]
    },
    {
      id: 'data_readiness',
      question: 'How would you rate your data infrastructure?',
      options: [
        { value: 0, label: 'No centralized data' },
        { value: 25, label: 'Data in silos' },
        { value: 50, label: 'Some integration, needs improvement' },
        { value: 75, label: 'Well-organized data infrastructure' },
        { value: 100, label: 'Advanced data platform with governance' }
      ]
    },
    {
      id: 'team_skills',
      question: 'What is your team\'s AI/ML expertise?',
      options: [
        { value: 0, label: 'No AI expertise' },
        { value: 25, label: 'Basic understanding' },
        { value: 50, label: 'Some technical skills' },
        { value: 75, label: 'Dedicated AI team' },
        { value: 100, label: 'Advanced AI research team' }
      ]
    },
    {
      id: 'business_goals',
      question: 'How clear are your AI business objectives?',
      options: [
        { value: 0, label: 'Not defined yet' },
        { value: 25, label: 'Vague ideas' },
        { value: 50, label: 'Some defined use cases' },
        { value: 75, label: 'Clear objectives with metrics' },
        { value: 100, label: 'Detailed AI strategy with ROI targets' }
      ]
    },
    {
      id: 'investment',
      question: 'What is your AI investment readiness?',
      options: [
        { value: 0, label: 'No budget allocated' },
        { value: 25, label: 'Exploring budget options' },
        { value: 50, label: 'Budget available for pilots' },
        { value: 75, label: 'Significant budget approved' },
        { value: 100, label: 'Strategic AI investment program' }
      ]
    }
  ];

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [questions[step].id]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers) => {
    const totalScore = Object.values(finalAnswers).reduce((sum, val) => sum + val, 0);
    const avgScore = totalScore / questions.length;

    let category, description, recommendations;

    if (avgScore < 25) {
      category = 'AI Beginner';
      description = 'Your organization is at the early stages of AI adoption. This is a great opportunity to build a strong foundation.';
      recommendations = [
        'Start with AI education and awareness programs',
        'Identify quick-win use cases',
        'Build data infrastructure',
        'Partner with AI experts for guidance'
      ];
    } else if (avgScore < 50) {
      category = 'AI Explorer';
      description = 'You\'re making progress in your AI journey. Focus on building capabilities and running pilot projects.';
      recommendations = [
        'Launch pilot AI projects',
        'Invest in team training',
        'Improve data quality and access',
        'Define clear AI success metrics'
      ];
    } else if (avgScore < 75) {
      category = 'AI Adopter';
      description = 'Your organization is actively adopting AI. Now is the time to scale successful initiatives.';
      recommendations = [
        'Scale successful pilot projects',
        'Implement AI governance framework',
        'Expand AI use cases across departments',
        'Build center of excellence'
      ];
    } else {
      category = 'AI Leader';
      description = 'You\'re leading in AI adoption. Focus on innovation and competitive differentiation.';
      recommendations = [
        'Invest in cutting-edge AI research',
        'Build proprietary AI capabilities',
        'Create AI-driven business models',
        'Share best practices industry-wide'
      ];
    }

    setResult({ score: Math.round(avgScore), category, description, recommendations });
  };

  const shareResults = () => {
    const text = `I scored ${result.score}/100 on the Zentiam AI Readiness Assessment! I'm an ${result.category}. Get your AI readiness score: ${window.location.origin}`;
    if (navigator.share) {
      navigator.share({ title: 'My AI Readiness Score', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  };

  const downloadReport = () => {
    const reportContent = `
=================================
ZENTIAM AI READINESS ASSESSMENT
=================================

Your Score: ${result.score}/100
Category: ${result.category}

${result.description}

RECOMMENDATIONS:
${result.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

Next Steps:
Schedule a free consultation with Zentiam:
${window.location.origin}/contact

---
Powered by Zentiam AI
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zentiam-ai-readiness-report.txt';
    a.click();
  };

  if (result) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '1rem',
          overflowY: 'auto'
        }}
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            maxWidth: '550px',
            width: '100%',
            color: 'white',
            position: 'relative',
            margin: '1rem 0'
          }}
          className="fade-in-scale"
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
          >
            <X size={20} />
          </button>

          <div style={{ textAlign: 'center', marginBottom: '1.5rem', paddingRight: '2rem' }}>
            <div style={{ fontSize: 'clamp(3rem, 12vw, 4.5rem)', fontWeight: '700', marginBottom: '0.25rem' }}>
              {result.score}
              <span style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', opacity: 0.7 }}>/100</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', marginBottom: '0.5rem' }}>{result.category}</h2>
            <p style={{ opacity: 0.9, fontSize: 'clamp(0.875rem, 3vw, 1rem)' }}>{result.description}</p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: 'clamp(1rem, 4vw, 1.15rem)', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={20} /> Recommended Actions
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {result.recommendations.map((rec, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <CheckCircle size={18} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
            <button
              onClick={shareResults}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem'
              }}
            >
              <Share2 size={18} /> Share Results
            </button>
            <button
              onClick={downloadReport}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '2px solid white',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem'
              }}
            >
              <Download size={18} /> Download Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[step];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          padding: '1.5rem',
          maxWidth: '600px',
          width: '100%',
          color: 'white',
          border: '1px solid rgba(147, 51, 234, 0.3)',
          position: 'relative',
          margin: '1rem 0'
        }}
        className="fade-in-scale"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* Progress Bar */}
        <div style={{ marginBottom: '1.5rem', paddingRight: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Question {step + 1} of {questions.length}</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{Math.round(((step + 1) / questions.length) * 100)}%</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #667eea, #764ba2)',
                width: `${((step + 1) / questions.length) * 100}%`,
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', marginBottom: '1.25rem', lineHeight: 1.3 }}>{currentQuestion.question}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.value)}
                style={{
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid rgba(147, 51, 234, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(147, 51, 234, 0.2)';
                  e.target.style.borderColor = '#9333ea';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'rgba(147, 51, 234, 0.3)';
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssessment;
