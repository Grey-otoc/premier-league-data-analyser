import './AdBanner.css';

const AdBanner = ({
  sponsor = "Sponsored by",
  title = "PremierStats Pro",
  subtitle = "Advanced analytics and predictions for fantasy football managers",
  ctaText = "Learn More →",
  logoText = "PS",
  badgeText = "NEW",
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

  return (
    <div className="ad-banner-container">
      <div className="ad-banner-pattern"></div>
      <div className="ad-banner-content">
        <div className="ad-banner-left">
          <div className="ad-banner-sponsor">{sponsor}</div>
          <h2 className="ad-banner-title">{title}</h2>
          <p className="ad-banner-subtitle">{subtitle}</p>
          <a href="#" className="ad-banner-cta" onClick={handleClick}>
            {ctaText}
          </a>
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
