import { useEffect, useState, useCallback } from 'react';
import './Subscriptions.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/** Pull .data from the standardised { status, data, message } envelope */
function unwrap(json) {
  if (json?.status === 'success') return json.data;
  if (json?.status === 'error') throw new Error(json.message || 'API error');
  return json; // plain object e.g. { memberships: [...] }
}

function tierColor(name) {
  return { Scout: 'green', Analyst: 'blue', Manager: 'gold' }[name] ?? 'green';
}



/* ─── TierCard ──────────────────────────────────────────────────────────── */
function TierCard({ tier }) {
  const { name, price, requests_per_day, description } = tier;
  const color = tierColor(name);
  return (
    <div className={`tier-card ${color}`}>

      {/* Header */}
      <p className={`tier-name ${color}`}>{name}</p>
      <div className="tier-price-row">
        <span className="tier-price">
          {price === 0 ? '£0' : `£${price}`}
        </span>
        <span className="tier-price-label">
          {price === 0 ? 'Free forever' : '/ month'}
        </span>
      </div>
      <p className="tier-quota-line">
        <span>💬</span>
        <strong>{requests_per_day}</strong>&nbsp;AI questions per day

      </p>

      <div className="tier-divider" />

      {/* description is a plain string from the API */}
      <p className="tier-description">{description}</p>

      {/* CTA */}
      <button className={`tier-cta ${color}`}>
        {name === 'Scout' ? 'Current Plan' : `Get ${name}`}
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
