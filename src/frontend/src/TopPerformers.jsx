import React, { useState,useEffect } from 'react';
import './TopPerformers.css';

const TopPerformers = () => {
  const [expandedCard, setExpandedCard] = useState(null);
  
 const [seasonPerformers, setSeasonPerformers] = useState([]);

  // Data organized by seasons
 useEffect(() => {
    const fetchSeasonPerformers = async () => {
      try {
        const apiUrl = import.meta.env.VITE_LEAGUE_API_URL;
        const response = await fetch(`${apiUrl}/stats/topperformers`);
        const data = await response.json();
        setSeasonPerformers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSeasonPerformers();
  }, []);


  const toggleCard = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <section className="stats-section" id="performers">
      <h2 className="section-title">🌟 Top Performers by Season</h2>
      
      {seasonPerformers.map((seasonBlock) => (
        <div key={seasonBlock.season} className="season-block performers-block">
          <div className="season-header">
            <h3 className="season-title">{seasonBlock.season}</h3>
            <span className={`season-badge ${seasonBlock.status.toLowerCase().replace(' ', '-')}`}>
              {seasonBlock.status}
            </span>
          </div>
          
          <div className="performers-grid">
            {seasonBlock.performers.map((performer) => (
              <div
                key={performer.id}
                className={`performer-card ${expandedCard === performer.id ? 'expanded' : ''}`}
                onClick={() => toggleCard(performer.id)}
              >
                <div className="performer-header">
                  <div className="performer-rank">{performer.rank}</div>
                  <div className="performer-info">
                    <h4>
                      {performer.image} {performer.name}
                    </h4>
                    <p>{performer.team} • {performer.position}</p>
                  </div>
                  <div className="expand-indicator">
                    {expandedCard === performer.id ? '−' : '+'}
                  </div>
                </div>
                
                <div className="performer-stats">
                  <div className="stat-item">
                    <div className="label">Goals</div>
                    <div className="value">{performer.stats.goals}</div>
                  </div>
                  <div className="stat-item">
                    <div className="label">Assists</div>
                    <div className="value">{performer.stats.assists}</div>
                  </div>
                  <div className="stat-item">
                    <div className="label">Goals Conceded</div>
                    <div className="value">{performer.stats.goals_conceded}</div>
                  </div>
                  <div className="stat-item">
                    <div className="label">Minutes</div>
                    <div className="value">{performer.stats.minutes.toLocaleString()}</div>
                  </div>
                </div>

                {expandedCard === performer.id && (
                  <div className="performer-details">
                    <div className="details-divider"></div>
                    <h4>Detailed Statistics</h4>
                    <div className="details-grid">
                      <div className="detail-row">
                        <span className="detail-label">Goals per Match:</span>
                        <span className="detail-value">{performer.detailedStats.goalsPerMatch}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Shots on Target:</span>
                        <span className="detail-value">{performer.detailedStats.shotsOnTarget}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Conversion Rate:</span>
                        <span className="detail-value">{performer.detailedStats.conversion}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Penalties Scored:</span>
                        <span className="detail-value">{performer.detailedStats.penaltiesScored}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Hat-tricks:</span>
                        <span className="detail-value">{performer.detailedStats.hatTricks || performer.detailedStats.freeKicks || 0}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Left Foot Goals:</span>
                        <span className="detail-value">{performer.detailedStats.leftFoot}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Right Foot Goals:</span>
                        <span className="detail-value">{performer.detailedStats.rightFoot}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Headers:</span>
                        <span className="detail-value">{performer.detailedStats.headers}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Big Chances:</span>
                        <span className="detail-value">{performer.detailedStats.bigChances}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Average Rating:</span>
                        <span className="detail-value highlight">{performer.detailedStats.avgRating}</span>
                      </div>
                    </div>
                    <div className="click-hint">Click again to collapse</div>
                  </div>
                )}

                {expandedCard !== performer.id && (
                  <div className="click-hint">Click to view detailed stats</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default TopPerformers;
