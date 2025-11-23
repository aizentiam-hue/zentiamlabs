import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Clock, Users, X } from 'lucide-react';

const ROICalculator = ({ onClose }) => {
  const [inputs, setInputs] = useState({
    employees: 100,
    avgSalary: 60000,
    hoursPerWeek: 40,
    tasksToAutomate: 30,
    implementationCost: 50000
  });

  const [results, setResults] = useState(null);

  useEffect(() => {
    calculateROI();
  }, [inputs]);

  const calculateROI = () => {
    const { employees, avgSalary, hoursPerWeek, tasksToAutomate, implementationCost } = inputs;

    // Calculate time savings
    const automationPercent = tasksToAutomate / 100;
    const hoursSavedPerWeek = hoursPerWeek * automationPercent;
    const hoursSavedPerYear = hoursSavedPerWeek * 52;
    
    // Calculate cost savings
    const hourlyRate = avgSalary / 2080; // 2080 working hours per year
    const savingsPerEmployee = hoursSavedPerYear * hourlyRate;
    const totalAnnualSavings = savingsPerEmployee * employees;
    
    // Calculate ROI
    const roi = ((totalAnnualSavings - implementationCost) / implementationCost) * 100;
    const paybackMonths = (implementationCost / (totalAnnualSavings / 12));
    const threeYearValue = (totalAnnualSavings * 3) - implementationCost;

    // Productivity gains (industry average: 25-40%)
    const productivityIncrease = automationPercent * 35; // 35% average
    const additionalRevenue = (employees * avgSalary * 0.15) * (productivityIncrease / 100); // 15% of salary as revenue contribution

    setResults({
      hoursSavedPerYear: Math.round(hoursSavedPerYear),
      totalAnnualSavings: Math.round(totalAnnualSavings),
      roi: Math.round(roi),
      paybackMonths: Math.round(paybackMonths * 10) / 10,
      threeYearValue: Math.round(threeYearValue),
      productivityIncrease: Math.round(productivityIncrease),
      additionalRevenue: Math.round(additionalRevenue)
    });
  };

  const handleInputChange = (field, value) => {
    setInputs({ ...inputs, [field]: parseFloat(value) || 0 });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
          borderRadius: '24px',
          padding: '3rem',
          maxWidth: '1000px',
          width: '100%',
          color: 'white',
          position: 'relative',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}
        className="fade-in-scale"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={24} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>AI ROI Calculator</h2>
          <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>See how much you'll save with AI automation</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          {/* Input Section */}
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={24} /> Your Organization
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', opacity: 0.8 }}>
                  Number of Employees
                </label>
                <input
                  type="number"
                  value={inputs.employees}
                  onChange={(e) => handleInputChange('employees', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', opacity: 0.8 }}>
                  Average Salary ($/year)
                </label>
                <input
                  type="number"
                  value={inputs.avgSalary}
                  onChange={(e) => handleInputChange('avgSalary', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', opacity: 0.8 }}>
                  Hours Worked Per Week
                </label>
                <input
                  type="number"
                  value={inputs.hoursPerWeek}
                  onChange={(e) => handleInputChange('hoursPerWeek', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', opacity: 0.8 }}>
                  Tasks to Automate (%)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={inputs.tasksToAutomate}
                    onChange={(e) => handleInputChange('tasksToAutomate', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: '1.25rem', fontWeight: '600', minWidth: '50px' }}>{inputs.tasksToAutomate}%</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', opacity: 0.8 }}>
                  Implementation Cost ($)
                </label>
                <input
                  type="number"
                  value={inputs.implementationCost}
                  onChange={(e) => handleInputChange('implementationCost', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          {results && (
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={24} /> Your AI ROI
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Big ROI Number */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
                    border: '2px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '16px',
                    padding: '2rem',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '4rem', fontWeight: '700', marginBottom: '0.5rem', color: '#22c55e' }}>
                    {results.roi > 0 ? '+' : ''}{results.roi}%
                  </div>
                  <div style={{ fontSize: '1rem', opacity: 0.8 }}>Return on Investment</div>
                </div>

                {/* Key Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '12px',
                      padding: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', opacity: 0.8 }}>
                      <Clock size={16} />
                      <span style={{ fontSize: '0.75rem' }}>Payback Period</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{results.paybackMonths} mo</div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '12px',
                      padding: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', opacity: 0.8 }}>
                      <DollarSign size={16} />
                      <span style={{ fontSize: '0.75rem' }}>Annual Savings</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>${(results.totalAnnualSavings / 1000).toFixed(0)}K</div>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ opacity: 0.8 }}>Hours Saved/Year</span>
                    <span style={{ fontWeight: '600' }}>{results.hoursSavedPerYear.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ opacity: 0.8 }}>Productivity Increase</span>
                    <span style={{ fontWeight: '600', color: '#22c55e' }}>+{results.productivityIncrease}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ opacity: 0.8 }}>Additional Revenue</span>
                    <span style={{ fontWeight: '600' }}>${(results.additionalRevenue / 1000).toFixed(0)}K</span>
                  </div>
                  <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '1rem 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ opacity: 0.8 }}>3-Year Value</span>
                    <span style={{ fontWeight: '700', fontSize: '1.25rem', color: '#22c55e' }}>
                      ${(results.threeYearValue / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => {
                    onClose();
                    window.location.href = '/contact';
                  }}
                  style={{
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    marginTop: '1rem'
                  }}
                >
                  Get Your Custom AI Strategy →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
          <p style={{ fontSize: '0.75rem', opacity: 0.7, textAlign: 'center' }}>
            * Calculations based on industry averages. Actual results may vary. Based on 2024-2025 AI ROI data from Accenture, Deloitte, and McKinsey studies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;
