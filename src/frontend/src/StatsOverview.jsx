import React, { useState,useEffect } from 'react';
import './StatsOverview.css';



const StatsOverview = () => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [seasonData, setSeasonData] = useState([]);

  // Data organized by seasons
 useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const apiUrl = import.meta.env.VITE_LEAGUE_API_URL;
        const response = await fetch(`${apiUrl}/stats/summary`);
        const data = await response.json();
        setSeasonData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSeasons();
  }, []);

  const toggleCard = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <section className="stats-section" id="stats">
      <h2 className="section-title">📊 Season Summary based on years</h2>
      
      {seasonData.map((seasonBlock) => (
        <div key={seasonBlock.season} className="season-block">
          <div className="season-header">
            <h3 className="season-title">{seasonBlock.season}</h3>           
          </div>
          
          <div className="stats-grid">
            {seasonBlock.stats.map((stat) => (
              <div
                key={stat.id}
                className={`stat-card ${expandedCard === stat.id ? 'expanded' : ''}`}
                onClick={() => toggleCard(stat.id)}
              >
                <div className="stat-card-header">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="expand-indicator">
                    {expandedCard === stat.id ? '−' : '+'}
                  </div>
                </div>
                
                <h3>{stat.title}</h3>
                <div className="stat-number">{stat.number}</div>
                <p className="stat-description">{stat.description}</p>
                
                {expandedCard === stat.id && (
                  <div className="stat-details">
                    <div className="details-divider"></div>
                    <h4>Detailed Breakdown</h4>
                    <div className="details-grid">
                      {Object.entries(stat.details).map(([key, value]) => (
                        <div key={key} className="detail-item">
                          <span className="detail-label">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </span>
                          <span className="detail-value">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="click-hint">Click again to collapse</div>
                  </div>
                )}
                
                {expandedCard !== stat.id && (
                  <div className="click-hint">Click to view details</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default StatsOverview;
