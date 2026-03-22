import { useEffect, useState } from 'react';
import './Memberships.css';

const TIER_META = {
  Free:  {
    icon: '⚽',
    tagline: 'Get started with the basics',
    price: '£0',
    period: 'forever',
    features: ['5 AI questions per session', 'Basic player stats', 'Season overview'],
    accent: '#4a4a6a',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #2a2a4e 100%)',
    badge: null,
  },
  Pro:   {
    icon: '🏆',
    tagline: 'For the serious fan',
    price: '£4.99',
    period: 'per month',
    features: ['10 AI questions per session', 'Full player analytics', 'Head-to-head comparisons', 'Historical data access'],
    accent: '#3d0068',
    gradient: 'linear-gradient(135deg, #2e0050 0%, #5a0099 100%)',
    badge: 'Most Popular',
  },
  Elite: {
    icon: '👑',
    tagline: 'The ultimate experience',
    price: '£9.99',
    period: 'per month',
    features: ['15 AI questions per session', 'Advanced performance metrics', 'Predictive analytics', 'Export & share reports', 'Priority support'],
    accent: '#b8962e',
    gradient: 'linear-gradient(135deg, #1a1200 0%, #3d2a00 100%)',
    badge: 'Best Value',
  },
};

export default function Memberships() {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribing, setSubscribing] = useState(null);
  const [subscribed, setSubscribed] = useState(null);

  useEffect(() => {
    fetch('/api/memberships/summary')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load membership tiers');
        return res.json();
      })
      .then(data => {
        setTiers(data.memberships);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSubscribe = async (tierName) => {
    setSubscribing(tierName);
    // Simulate API call — replace with real subscription endpoint
    await new Promise(r => setTimeout(r, 1200));
    setSubscribing(null);
    setSubscribed(tierName);
    setTimeout(() => setSubscribed(null), 3000);
  };

  if (loading) {
    return (
      <div className="memberships-loading">
        <div className="memberships-spinner" />
        <p>Loading membership tiers…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="memberships-error">
        <span>⚠️</span>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="memberships-page">
      {/* Hero header */}
      <div className="memberships-hero">
        <p className="memberships-eyebrow">Choose your plan</p>
        <h1 className="memberships-title">
          Unlock the <em>Full Game</em>
        </h1>
        <p className="memberships-subtitle">
          Power your football analytics with AI-driven insights.<br />
          Pick the tier that matches your passion.
        </p>
      </div>

      {/* Cards grid */}
      <div className="memberships-grid">
        {tiers.map((tier) => {
          const meta = TIER_META[tier.name] ?? {};
          const isFeatured = tier.name === 'Pro';
          const isSubscribing = subscribing === tier.name;
          const isSubscribed = subscribed === tier.name;

          return (
            <div
              key={tier.name}
              className={`membership-card${isFeatured ? ' membership-card--featured' : ''}`}
              style={{ '--card-gradient': meta.gradient, '--card-accent': meta.accent }}
            >
              {meta.badge && (
                <div className="membership-badge" style={{ background: meta.accent }}>
                  {meta.badge}
                </div>
              )}

              {/* Top section */}
              <div className="membership-card-top">
                <span className="membership-icon">{meta.icon}</span>
                <h2 className="membership-name">{tier.name}</h2>
                <p className="membership-tagline">{meta.tagline}</p>
              </div>

              {/* Price */}
              <div className="membership-price-block">
                <span className="membership-price">{meta.price}</span>
                <span className="membership-period">{meta.period}</span>
              </div>

              {/* Divider */}
              <div className="membership-divider" style={{ background: meta.accent }} />

              {/* Feature list */}
              <ul className="membership-features">
                {(meta.features ?? [`${tier.requests} AI questions per session`]).map(f => (
                  <li key={f}>
                    <span className="membership-check" style={{ color: meta.accent }}>✔</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className={`membership-subscribe-btn${isFeatured ? ' membership-subscribe-btn--featured' : ''}`}
                style={isFeatured ? { background: meta.accent } : {}}
                onClick={() => handleSubscribe(tier.name)}
                disabled={isSubscribing || isSubscribed}
              >
                {isSubscribed ? '✓ Subscribed!' : isSubscribing ? (
                  <span className="btn-spinner" />
                ) : (
                  tier.name === 'Free' ? 'Get Started' : `Subscribe to ${tier.name}`
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="memberships-footnote">
        All plans include access to Premier League data. Upgrade or cancel anytime.
      </p>
    </div>
  );
}
