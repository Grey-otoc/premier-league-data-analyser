import React, { useState } from 'react';
import './TopPerformers.css';

const TopPerformers = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  // Performers organized by season
  const seasonPerformers = [
    {
      season: '2024-25',
      status: 'Current Season',
      performers: [
        {
          id: 'haaland-2425',
          rank: 1,
          name: 'Erling Haaland',
          team: 'Manchester City',
          position: 'Forward',
          image: '🇳🇴',
          stats: {
            goals: 27,
            assists: 5,
            appearances: 31,
            minutes: 2489
          },
          detailedStats: {
            goalsPerMatch: 0.87,
            shotsOnTarget: 67,
            conversion: '32%',
            penaltiesScored: 4,
            hatTricks: 2,
            leftFoot: 8,
            rightFoot: 16,
            headers: 3,
            bigChances: 42,
            avgRating: 8.2
          }
        },
        {
          id: 'salah-2425',
          rank: 2,
          name: 'Mohamed Salah',
          team: 'Liverpool',
          position: 'Forward',
          image: '🇪🇬',
          stats: {
            goals: 22,
            assists: 13,
            appearances: 33,
            minutes: 2891
          },
          detailedStats: {
            goalsPerMatch: 0.67,
            shotsOnTarget: 54,
            conversion: '28%',
            penaltiesScored: 6,
            freeKicks: 2,
            leftFoot: 18,
            rightFoot: 2,
            headers: 2,
            bigChances: 38,
            avgRating: 8.5
          }
        },
        {
          id: 'palmer-2425',
          rank: 3,
          name: 'Cole Palmer',
          team: 'Chelsea',
          position: 'Midfielder',
          image: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
          stats: {
            goals: 20,
            assists: 11,
            appearances: 32,
            minutes: 2756
          },
          detailedStats: {
            goalsPerMatch: 0.63,
            shotsOnTarget: 48,
            conversion: '26%',
            penaltiesScored: 8,
            freeKicks: 3,
            leftFoot: 15,
            rightFoot: 2,
            headers: 3,
            bigChances: 35,
            avgRating: 8.1
          }
        }
      ]
    },
    {
      season: '2023-24',
      status: 'Previous Season',
      performers: [
        {
          id: 'haaland-2324',
          rank: 1,
          name: 'Erling Haaland',
          team: 'Manchester City',
          position: 'Forward',
          image: '🇳🇴',
          stats: {
            goals: 36,
            assists: 6,
            appearances: 38,
            minutes: 3272
          },
          detailedStats: {
            goalsPerMatch: 0.95,
            shotsOnTarget: 89,
            conversion: '35%',
            penaltiesScored: 7,
            hatTricks: 3,
            leftFoot: 11,
            rightFoot: 22,
            headers: 3,
            bigChances: 51,
            avgRating: 8.8
          }
        },
        {
          id: 'palmer-2324',
          rank: 2,
          name: 'Cole Palmer',
          team: 'Chelsea',
          position: 'Midfielder',
          image: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
          stats: {
            goals: 22,
            assists: 11,
            appearances: 34,
            minutes: 2992
          },
          detailedStats: {
            goalsPerMatch: 0.65,
            shotsOnTarget: 52,
            conversion: '27%',
            penaltiesScored: 9,
            freeKicks: 2,
            leftFoot: 17,
            rightFoot: 3,
            headers: 2,
            bigChances: 38,
            avgRating: 7.9
          }
        },
        {
          id: 'watkins-2324',
          rank: 3,
          name: 'Ollie Watkins',
          team: 'Aston Villa',
          position: 'Forward',
          image: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
          stats: {
            goals: 19,
            assists: 13,
            appearances: 37,
            minutes: 3189
          },
          detailedStats: {
            goalsPerMatch: 0.51,
            shotsOnTarget: 45,
            conversion: '24%',
            penaltiesScored: 2,
            hatTricks: 1,
            leftFoot: 7,
            rightFoot: 10,
            headers: 2,
            bigChances: 32,
            avgRating: 7.7
          }
        }
      ]
    }
  ];

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
                    <div className="label">Appearances</div>
                    <div className="value">{performer.stats.appearances}</div>
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
