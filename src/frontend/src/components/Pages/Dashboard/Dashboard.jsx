import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/* ─── helpers ─────────────────────────────────────────────────────────── */
function authHeaders() {
  const token = localStorage.getItem('access_token');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

/** Pull .data from a standardised { status, data, message } envelope */
function unwrap(json) {
  if (json?.status === 'success') return json.data;
  throw new Error(json?.message || 'API error');
}

/* ─── BarChart ────────────────────────────────────────────────────────── */
function BarChart({ data, valueKey, color1 = '#7c3aed', color2 = '#a855f7', formatValue }) {
  const W = 460;
  const H = 180;
  const padL = 52;
  const padB = 36;
  const padT = 20;
  const padR = 10;

  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const maxVal = Math.max(...data.map(d => d[valueKey]), 1);

  const barW = Math.floor(innerW / data.length) - 4;

  const yTicks = 4;
  const tickStep = maxVal / yTicks;

  function fmt(v) {
    if (formatValue) return formatValue(v);
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k`;
    return String(v);
  }

  return (
    <div className="bar-chart-wrap">
      <svg
        className="bar-chart-svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={`g-${color1.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Y-axis grid + labels */}
        {Array.from({ length: yTicks + 1 }, (_, i) => {
          const val = tickStep * i;
          const y = padT + innerH - (innerH * i) / yTicks;
          return (
            <g key={i}>
              <line
                x1={padL} y1={y} x2={W - padR} y2={y}
                stroke="#2a1d38" strokeWidth="1"
              />
              <text className="y-label" x={padL - 6} y={y + 3}>
                {fmt(val)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const barH = Math.max((d[valueKey] / maxVal) * innerH, 2);
          const x = padL + (innerW / data.length) * i + (innerW / data.length - barW) / 2;
          const y = padT + innerH - barH;

          return (
            <g key={d.season_abbr}>
              <rect
                className="bar"
                x={x} y={y}
                width={barW} height={barH}
                fill={`url(#g-${color1.slice(1)})`}
              >
                <title>{`${d.season}: ${fmt(d[valueKey])}`}</title>
              </rect>

              {/* value above bar */}
              <text className="val-label" x={x + barW / 2} y={y - 5}>
                {fmt(d[valueKey])}
              </text>

              {/* season label below */}
              <text className="bar-label" x={x + barW / 2} y={H - padB + 14}>
                {d.season.slice(2)}   {/* e.g. "16/17" */}
              </text>
            </g>
          );
        })}

        {/* X axis line */}
        <line
          x1={padL} y1={padT + innerH}
          x2={W - padR} y2={padT + innerH}
          stroke="#2a1d38" strokeWidth="1"
        />
      </svg>
    </div>
  );
}

/* ─── SkeletonCard ────────────────────────────────────────────────────── */
function SkeletonCard({ lines = 4 }) {
  return (
    <div className="dash-card">
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="skeleton skeleton-line"
          style={{ width: `${75 - i * 10}%` }}
        />
      ))}
    </div>
  );
}

/* ─── ChartSkeleton ───────────────────────────────────────────────────── */
function ChartSkeleton() {
  const heights = [60, 90, 110, 75, 130, 100, 80, 115, 95];
  return (
    <div className="chart-skeleton">
      {heights.map((h, i) => (
        <div
          key={i}
          className="chart-skeleton-bar skeleton"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

/* ─── QuotaCard ───────────────────────────────────────────────────────── */
function QuotaCard({ meData, loading, error }) {
  if (loading) return <SkeletonCard lines={5} />;
  if (error) return (
    <div className="dash-card">
      <p className="dash-error">⚠ Could not load quota: {error}</p>
    </div>
  );

  const total = meData?.quota?.total ?? 5;
  const used = Number(localStorage.getItem('questions_used') || 0);
  const remaining = Math.max(total - used, 0);
  const pct = total > 0 ? (remaining / total) * 100 : 0;

  return (
    <div className="dash-card">
      <div className="card-icon-label">
        <div className="card-icon purple">💬</div>
        <span className="card-label">AI Question Quota</span>
      </div>

      <div className="quota-number">
        {remaining}<span> / {total}</span>
      </div>
      <p className="quota-desc">Questions remaining this session</p>

      <div className="quota-bar-track">
        <div
          className="quota-bar-fill"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="quota-meta">
        <span>{used} used</span>
        <span>{remaining} left</span>
      </div>
    </div>
  );
}

/* ─── SubscriptionCard ────────────────────────────────────────────────── */
function SubscriptionCard({ meData, loading, error, navigate }) {
  if (loading) return <SkeletonCard lines={6} />;
  if (error) return (
    <div className="dash-card">
      <p className="dash-error">⚠ Could not load subscription: {error}</p>
    </div>
  );

  const sub = meData?.subscription ?? { name: 'Free', color: 'gray', price: '£0', price_label: 'Free forever' };
  const benefits = meData?.subscription?.benefits ?? [
    '5 AI questions per session',
    'Basic player stats',
    'Season overview',
  ];

  return (
    <div className="dash-card">
      <div className="card-icon-label">
        <div className="card-icon gold">⭐</div>
        <span className="card-label">Your Subscription</span>
      </div>

      <div className={`sub-badge ${sub.color}`}>
        {sub.color === 'purple' ? '👑' : sub.color === 'blue' ? '🔵' : '◻'} {sub.name}
      </div>

      <div className="sub-plan-name">{sub.name} Plan</div>
      <p className="sub-price">{sub.price} · {sub.price_label}</p>

      <ul className="sub-benefits">
        {benefits.map(b => (
          <li key={b}>
            <span className="benefit-check">✓</span>
            {b}
          </li>
        ))}
      </ul>

      {sub.name === 'Free' && (
        <button className="upgrade-btn" onClick={() => navigate('/subscriptions')}>
          Upgrade Plan →
        </button>
      )}
    </div>
  );
}

/* ─── Dashboard (main) ────────────────────────────────────────────────── */
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [meData, setMeData] = useState(null);
  const [meLoading, setMeLoading] = useState(true);
  const [meError, setMeError] = useState(null);

  const [chartData, setChartData] = useState(null);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [chartsError, setChartsError] = useState(null);

  /* ── fetch /api/auth/me ── */
  const fetchMe = useCallback(async () => {
    setMeLoading(true);
    setMeError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, { headers: authHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setMeData(unwrap(json));
    } catch (e) {
      setMeError(e.message);
    } finally {
      setMeLoading(false);
    }
  }, []);

  /* ── fetch /api/stats/charts ── */
  const fetchCharts = useCallback(async () => {
    setChartsLoading(true);
    setChartsError(null);
    try {
      const res = await fetch(`${API_URL}/api/stats/charts`, { headers: authHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setChartData(unwrap(json));
    } catch (e) {
      setChartsError(e.message);
    } finally {
      setChartsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
    fetchCharts();
  }, [fetchMe, fetchCharts]);

  const displayName = meData?.first_name || user?.username || 'Manager';

  return (
    <div className="dashboard">

      {/* ── Hero ── */}
      <div className="dashboard-hero">
        <h1 className="hero-greeting">
          Welcome back, <span>{displayName}</span> ⚽
        </h1>
        <p className="hero-sub">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          &nbsp;· Premier League Data Analyser
        </p>
      </div>

      <div className="dashboard-body">

        {/* ── Overview cards ── */}
        <p className="section-title">Your Account</p>
        <div className="cards-row">
          <QuotaCard meData={meData} loading={meLoading} error={meError} />
          <SubscriptionCard
            meData={meData}
            loading={meLoading}
            error={meError}
            navigate={navigate}
          />
        </div>

        {/* ── Charts ── */}
        <p className="section-title">Season Analytics</p>
        <div className="charts-row">

          {/* Top Scores per Season */}
          <div className="chart-card">
            <div className="chart-header">
              <p className="chart-title">🥅 Top Scores Per Season</p>
              <p className="chart-subtitle">Highest single-player goals scored each Premier League season</p>
            </div>
            {chartsLoading ? <ChartSkeleton /> : chartsError ? (
              <p className="dash-error">⚠ {chartsError}</p>
            ) : (
              <BarChart
                data={chartData.top_scores_per_season}
                valueKey="top_score"
                color1="#7c3aed"
                color2="#c084fc"
              />
            )}
          </div>

          {/* Total Minutes per Season */}
          <div className="chart-card">
            <div className="chart-header">
              <p className="chart-title">⏱ Total Minutes Per Season</p>
              <p className="chart-subtitle">Cumulative player minutes across all clubs each season</p>
            </div>
            {chartsLoading ? <ChartSkeleton /> : chartsError ? (
              <p className="dash-error">⚠ {chartsError}</p>
            ) : (
              <BarChart
                data={chartData.total_minutes_per_season}
                valueKey="total_minutes"
                color1="#1d4ed8"
                color2="#60a5fa"
              />
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
