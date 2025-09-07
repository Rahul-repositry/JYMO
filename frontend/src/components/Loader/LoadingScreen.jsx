import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');
  
  useEffect(() => {
    const loadingSteps = [
      { percent: 10, text: 'Loading resources...' },
      { percent: 25, text: 'Connecting to server...' },
      { percent: 40, text: 'Preparing your data...' },
      { percent: 60, text: 'Loading your profile...' },
      { percent: 80, text: 'Almost there...' },
      { percent: 95, text: 'Finalizing...' },
      { percent: 100, text: 'Ready!' }
    ];
    
    let currentStep = 0;
    
    // Simulate loading progress
    const timer = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        const { percent, text } = loadingSteps[currentStep];
        setProgress(percent);
        setLoadingText(text);
        currentStep++;
      } else {
        clearInterval(timer);
        // Allow a small delay to show 100% before completing
        setTimeout(() => {
          if (onLoadComplete) onLoadComplete();
        }, 500);
      }
    }, 1000); // Adjust timing based on your actual loading time
    
    return () => clearInterval(timer);
  }, [onLoadComplete]);
  
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="logo-container">
          <img src="/apple-icon.png" alt="Jymo Logo" className="loading-logo" />
          <h1>JYMO</h1>
        </div>
        
        <div className="loading-progress-container">
          <div 
            className="loading-progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="loading-percentage">{progress}%</div>
        <div className="loading-text">{loadingText}</div>
        
        <div className="loading-tips">
          {progress > 50 ? (
            <p>Tip: Set up your workout schedule for better tracking</p>
          ) : (
            <p>Tip: Check in daily to maintain your streak</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;