import { useEffect, useState, useCallback } from 'react';
import './Subscriptions.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/** Pull .data from the standardised { status, data, message } envelope */
function unwrap(json) {
  if (json?.status === 'success') return json.data;
  throw new Error(json?.message || 'API error');
}

/* ─── TierCard ──────────────────────────────────────────────────────────── */
function TierCard({ tier }) {
  const { name, price, price_label, requests, benefits, color, featured } = tier;

  return (
    <div className={`tier-card ${featured ? 'featured' : ''}`}>
      {featured && <span className="featured-badge">Most Popular</span>}

      {/* Header */}
      <p className={`tier-name ${color}`}>{name}</p>
      <div className="tier-price-row">
        <span className="tier-price">{price}</span>
        <span className="tier-price-label">/ {price_label}</span>
      </div>
      <p className="tier-quota-line">
        <span>💬</span>
        {requests} AI questions per day
      </p>

      <div className="tier-divider" />

      {/* Benefits */}
      <ul className="tier-benefits">
        {benefits.map(b => (
          <li key={b} className="tier-benefit">
            <span className={`tier-check ${color}`}>✓</span>
            {b}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button className={`tier-cta ${color}`}>
        {name === 'Free' ? 'Current Plan' : `Get ${name}`}
      </button>
    </div>
  );
}

/* ─── Subscriptions (main) ──────────────────────────────────────────────── */
export default function Subscriptions() {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMemberships = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/memberships/summary`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const data = unwrap(json);
      setTiers(data.memberships);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMemberships(); }, [fetchMemberships]);

  return (
    <div className="subs-page">

      {/* ── Hero ── */}
      <div className="subs-hero">
        <p className="subs-hero-eyebrow">Pricing &amp; Plans</p>
        <h1 className="subs-hero-title">
          Choose Your <span>Edge</span>
        </h1>
        <p className="subs-hero-sub">
          Unlock deeper Premier League insights. Upgrade anytime — cancel anytime.
        </p>
      </div>

      {/* ── States ── */}
      {loading && (
        <div className="subs-loading">
          <div className="subs-spinner" />
          Loading plans…
        </div>
      )}

      {!loading && error && (
        <div className="subs-error">
          <p>⚠ Failed to load subscription plans: {error}</p>
          <button className="retry-btn" onClick={fetchMemberships}>
            Try again
          </button>
        </div>
      )}

      {/* ── Cards ── */}
      {!loading && !error && tiers.length > 0 && (
        <>
          <div className="subs-grid">
            {tiers.map(tier => <TierCard key={tier.name} tier={tier} />)}
          </div>
          <p className="subs-footer-note">
            All plans include access to 9 seasons of Premier League data (2016–2025). · Prices exclude VAT.
          </p>
        </>
      )}

    </div>
  );
}
