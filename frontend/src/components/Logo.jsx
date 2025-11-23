import React from 'react';

const Logo = ({ width = 40, height = 40, showText = true, textColor = 'white' }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: showText ? '0.75rem' : '0' }}>
      {/* Logo Icon */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient for the logo */}
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer hexagon frame */}
        <path
          d="M50 5 L85 27.5 L85 72.5 L50 95 L15 72.5 L15 27.5 Z"
          stroke="url(#logoGradient)"
          strokeWidth="3"
          fill="none"
          filter="url(#glow)"
        />

        {/* Stylized "Z" with neural network nodes */}
        <g filter="url(#glow)">
          {/* Top part of Z */}
          <line x1="30" y1="30" x2="70" y2="30" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round"/>
          
          {/* Diagonal of Z with nodes */}
          <line x1="70" y1="30" x2="30" y2="70" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round"/>
          
          {/* Bottom part of Z */}
          <line x1="30" y1="70" x2="70" y2="70" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round"/>
          
          {/* Neural network nodes */}
          <circle cx="30" cy="30" r="4" fill="#a78bfa"/>
          <circle cx="70" cy="30" r="4" fill="#a78bfa"/>
          <circle cx="50" cy="50" r="5" fill="#9333ea"/>
          <circle cx="30" cy="70" r="4" fill="#a78bfa"/>
          <circle cx="70" cy="70" r="4" fill="#a78bfa"/>
          
          {/* Connection lines (subtle) */}
          <line x1="30" y1="30" x2="50" y2="50" stroke="#a78bfa" strokeWidth="1" opacity="0.5"/>
          <line x1="70" y1="30" x2="50" y2="50" stroke="#a78bfa" strokeWidth="1" opacity="0.5"/>
          <line x1="50" y1="50" x2="30" y2="70" stroke="#a78bfa" strokeWidth="1" opacity="0.5"/>
          <line x1="50" y1="50" x2="70" y2="70" stroke="#a78bfa" strokeWidth="1" opacity="0.5"/>
        </g>

        {/* Corner accents for tech feel */}
        <circle cx="85" cy="27.5" r="2" fill="#9333ea" opacity="0.8"/>
        <circle cx="85" cy="72.5" r="2" fill="#9333ea" opacity="0.8"/>
        <circle cx="15" cy="27.5" r="2" fill="#9333ea" opacity="0.8"/>
        <circle cx="15" cy="72.5" r="2" fill="#9333ea" opacity="0.8"/>
      </svg>

      {/* Company Name */}
      {showText && (
        <span
          style={{
            fontSize: 'inherit',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            background: textColor === 'gradient' 
              ? 'linear-gradient(135deg, #ffffff 0%, #a78bfa 100%)'
              : textColor,
            WebkitBackgroundClip: textColor === 'gradient' ? 'text' : 'unset',
            WebkitTextFillColor: textColor === 'gradient' ? 'transparent' : 'unset',
            backgroundClip: textColor === 'gradient' ? 'text' : 'unset',
            color: textColor === 'gradient' ? 'transparent' : textColor
          }}
        >
          Zentiam
        </span>
      )}
    </div>
  );
};

export default Logo;
