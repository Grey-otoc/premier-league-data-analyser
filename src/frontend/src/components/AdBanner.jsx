import React from 'react';
import './AdBanner.css';

const AdBanner = ({
  sponsor = "Sponsored by",
  title = "PremierStats Pro",
  subtitle = "Advanced analytics and predictions for fantasy football managers",
  ctaText = "Learn More",
  logoText = "PS",
  badgeText = "NEW",
  features = [],
  onCtaClick = null
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (onCtaClick) {
      onCtaClick();
    } else {
      alert('This is a demo advertisement!');
    }
  };

  // Default features if none provided
  const defaultFeatures = [
    { icon: '⚡', text: 'Real-time Updates' },
    { icon: '📊', text: 'Advanced Analytics' },
    { icon: '🎯', text: '95% Accuracy' }
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  return (
    <div className="ad-banner-container">
      <div className="ad-banner-pattern"></div>
      <div className="ad-banner-content">
        <div className="ad-banner-left">
          <div className="ad-banner-sponsor">{sponsor}</div>
          <h2 className="ad-banner-title">{title}</h2>
          <p className="ad-banner-subtitle">{subtitle}</p>
          
          {displayFeatures.length > 0 && (
            <div className="ad-banner-features">
              {displayFeatures.map((feature, index) => (
                <div key={index} className="ad-banner-feature">
                  <span className="ad-banner-feature-icon">{feature.icon}</span>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          )}
          
          <div style={{ marginTop: '28px' }}>
            <a href="#" className="ad-banner-cta" onClick={handleClick}>
              {ctaText}
            </a>
          </div>
        </div>
        <div className="ad-banner-right">
          <div className="ad-banner-logo">
            <div className="ad-banner-logo-shine"></div>
            <div className="ad-banner-logo-text">{logoText}</div>
            <div className="ad-banner-badge">{badgeText}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;