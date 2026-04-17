import React, { useState } from 'react';
import ProTipsCarousel from './ProTipsCarousel';

/**
 * ProTipsCarousel Examples & Usage Demonstrations
 * 
 * Shows various ways to integrate and use the carousel component
 */

// =====================================================================
// Example 1: Standalone Demo
// =====================================================================

export const ProTipsCarouselDemo = () => {
  const sampleTips = [
    "Stay hydrated by drinking at least 8 glasses of water daily to maintain optimal body functions.",
    "Get 7-9 hours of quality sleep each night to boost your immune system and mental health.",
    "Take regular breaks during work - stand up and stretch every 30 minutes to prevent muscle stiffness.",
    "Eat a balanced diet rich in fruits and vegetables to get essential nutrients.",
    "Exercise for at least 30 minutes daily to improve cardiovascular health and mood.",
    "Practice meditation or deep breathing exercises to reduce stress and anxiety.",
  ];

  const samplePrecautions = [
    "Avoid direct sunlight for extended periods without UV protection to prevent skin damage.",
    "Do not skip meals as it can lead to low blood sugar and fatigue.",
    "Never ignore persistent symptoms - consult a doctor if issues persist for more than a few days.",
    "Avoid excessive caffeine intake after 2 PM as it can interfere with sleep quality.",
    "Do not engage in strenuous activities immediately after meals.",
    "Avoid heavy lifting if you have back pain or musculoskeletal issues.",
  ];

  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <ProTipsCarousel
        tips={sampleTips}
        precautions={samplePrecautions}
        riskLevel="medium"
        autoPlayInterval={6000}
        onRefresh={() => console.log('Tips refreshed!')}
      />
    </div>
  );
};

// =====================================================================
// Example 2: Low Risk Level
// =====================================================================

export const LowRiskExample = () => {
  const lowRiskTips = [
    "Maintain a consistent bedtime routine for better sleep quality.",
    "Stay active with light exercises like walking or swimming.",
    "Practice mindfulness meditation to manage daily stress.",
  ];

  const lowRiskPrecautions = [
    "Remember to take breaks during long work sessions.",
    "Stay within recommended caffeine intake limits.",
  ];

  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f5f5f5' }}>
      <h2>Low Risk Level - Green Theme</h2>
      <ProTipsCarousel
        tips={lowRiskTips}
        precautions={lowRiskPrecautions}
        riskLevel="low"
      />
    </div>
  );
};

// =====================================================================
// Example 3: Medium Risk Level
// =====================================================================

export const MediumRiskExample = () => {
  const mediumRiskTips = [
    "Monitor your symptoms regularly and keep a health journal.",
    "Consult your doctor if symptoms persist for more than a week.",
    "Take prescribed medications on schedule without skipping doses.",
  ];

  const mediumRiskPrecautions = [
    "Avoid strenuous activities until symptoms improve.",
    "Do not self-diagnose - professional medical advice is essential.",
    "Check blood pressure regularly if you have hypertension.",
  ];

  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f5f5f5' }}>
      <h2>Medium Risk Level - Amber Theme</h2>
      <ProTipsCarousel
        tips={mediumRiskTips}
        precautions={mediumRiskPrecautions}
        riskLevel="medium"
      />
    </div>
  );
};

// =====================================================================
// Example 4: High Risk Level
// =====================================================================

export const HighRiskExample = () => {
  const highRiskTips = [
    "Seek immediate medical attention if symptoms worsen suddenly.",
    "Emergency contact: Call 911 if experiencing chest pain or severe symptoms.",
    "Follow all doctor instructions strictly to manage your condition.",
  ];

  const highRiskPrecautions = [
    "Do not delay treatment - seek professional medical help immediately.",
    "Avoid any strenuous activities until fully evaluated by a doctor.",
    "Emergency protocol: Keep emergency numbers accessible at all times.",
  ];

  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f5f5f5' }}>
      <h2>High Risk Level - Red Theme</h2>
      <ProTipsCarousel
        tips={highRiskTips}
        precautions={highRiskPrecautions}
        riskLevel="high"
      />
    </div>
  );
};

// =====================================================================
// Example 5: Dynamic Data with Refresh Callback
// =====================================================================

export const DynamicDataExample = () => {
  const [tips, setTips] = useState([
    "Start with a morning walk to boost energy levels.",
    "Eat a healthy breakfast within an hour of waking up.",
  ]);

  const [precautions, setPrecautions] = useState([
    "Avoid heavy meals late at night before sleep.",
    "Do not exercise on an empty stomach.",
  ]);

  const [riskLevel, setRiskLevel] = useState('low');

  const handleRefresh = () => {
    // Simulate API call to refresh tips
    const newTips = [
      "Drink a glass of water first thing in the morning.",
      "Do 10 minutes of stretching exercises daily.",
      "Include protein in every meal.",
    ];

    const newPrecautions = [
      "Avoid processed foods high in sodium.",
      "Do not skip your routine check-ups.",
    ];

    setTips(newTips);
    setPrecautions(newPrecautions);
    setRiskLevel(Math.random() > 0.33 ? (Math.random() > 0.5 ? 'medium' : 'high') : 'low');

    // Show feedback
    alert('Tips refreshed! Check the carousel for updated content.');
  };

  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f5f5f5' }}>
      <h2>Dynamic Data with Refresh</h2>
      <ProTipsCarousel
        tips={tips}
        precautions={precautions}
        riskLevel={riskLevel}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

// =====================================================================
// Example 6: Minimal Setup
// =====================================================================

export const MinimalExample = () => {
  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f5f5f5' }}>
      <h2>Minimal Setup</h2>
      <ProTipsCarousel
        tips={["Drink water regularly", "Get enough sleep", "Exercise daily"]}
        precautions={["Check with doctor before exercising"]}
      />
    </div>
  );
};

// =====================================================================
// Example 7: Empty State
// =====================================================================

export const EmptyStateExample = () => {
  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f5f5f5' }}>
      <h2>Empty State (No Tips)</h2>
      <ProTipsCarousel tips={[]} precautions={[]} />
    </div>
  );
};

// =====================================================================
// Example 8: Display All Examples
// =====================================================================

export const AllExamplesShowcase = () => {
  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>ProTipsCarousel - All Examples</h1>

      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>1. Main Demo</h2>
        <ProTipsCarouselDemo />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>2. Low Risk</h2>
        <LowRiskExample />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>3. Medium Risk</h2>
        <MediumRiskExample />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>4. High Risk</h2>
        <HighRiskExample />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>5. Dynamic Data</h2>
        <DynamicDataExample />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>6. Minimal</h2>
        <MinimalExample />
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>7. Empty State</h2>
        <EmptyStateExample />
      </div>
    </div>
  );
};

// Default export - Main demo
export default ProTipsCarouselDemo;
