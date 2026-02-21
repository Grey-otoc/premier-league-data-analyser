import React, { useState } from 'react';
import './StatsOverview.css';

const StatsOverview = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  // Data organized by seasons
  const seasonData = [
    {
      season: '2024-25',
      status: 'Current Season',
      stats: [
        {
          id: 'players-2425',
          icon: '👥',
          title: 'Total Players',
          number: '520',
          description: 'Active players in current season',
          details: {
            newPlayers: 78,
            returningPlayers: 442,
            avgAge: 26.3,
            nationalities: 64,
            topTeam: 'Manchester City (28 players)'
          }
        },
        {
          id: 'goals-2425',
          icon: '⚽',
          title: 'Total Goals',
          number: '432',
          description: 'Goals scored so far this season',
          details: {
            matchesPlayed: 156,
            goalsPerMatch: 2.77,
            topScorer: 'Erling Haaland (27 goals)',
            penalties: 48,
            freeKicks: 12
          }
        },
        {
          id: 'assists-2425',
          icon: '🎯',
          title: 'Total Assists',
          number: '298',
          description: 'Assists recorded this season',
          details: {
            assistsPerMatch: 1.91,
            topAssister: 'Mohamed Salah (13 assists)',
            teamHighest: 'Arsenal (42 assists)',
            crossAssists: 124,
            throughBallAssists: 67
          }
        },
        {
          id: 'matches-2425',
          icon: '📊',
          title: 'Matches Played',
          number: '156',
          description: 'Games completed this season',
          details: {
            homeWins: 67,
            awayWins: 48,
            draws: 41,
            avgAttendance: '38,420',
            totalCards: 524
          }
        }
      ]
    },
    {
      season: '2023-24',
      status: 'Previous Season',
      stats: [
        {
          id: 'players-2324',
          icon: '👥',
          title: 'Total Players',
          number: '542',
          description: 'Players who participated in 2023-24',
          details: {
            appearances: 18972,
            minutesPlayed: '1,708,800',
            avgAppearances: 35,
            debutPlayers: 82,
            retiredPlayers: 34
          }
        },
        {
          id: 'goals-2324',
          icon: '⚽',
          title: 'Total Goals',
          number: '1,114',
          description: 'Full season goals scored',
          details: {
            matchesPlayed: 380,
            goalsPerMatch: 2.93,
            topScorer: 'Erling Haaland (36 goals)',
            hatTricks: 7,
            cleanSheets: 142
          }
        },
        {
          id: 'assists-2324',
          icon: '🎯',
          title: 'Total Assists',
          number: '789',
          description: 'Season assist total',
          details: {
            assistsPerMatch: 2.08,
            topAssister: 'Ollie Watkins (13 assists)',
            mostCombination: 'Palmer to Jackson (8)',
            setPlays: 178,
            openPlay: 611
          }
        },
        {
          id: 'matches-2324',
          icon: '📊',
          title: 'Matches Played',
          number: '380',
          description: 'Complete season',
          details: {
            homeWins: 173,
            awayWins: 108,
            draws: 99,
            champion: 'Manchester City',
            relegated: 'Luton, Burnley, Sheffield Utd'
          }
        }
      ]
    },
    {
      season: '2022-23',
      status: 'Historical',
      stats: [
        {
          id: 'players-2223',
          icon: '👥',
          title: 'Total Players',
          number: '536',
          description: 'Players in 2022-23 season',
          details: {
            appearances: 19028,
            minutesPlayed: '1,712,520',
            avgAge: 26.1,
            youngestDebut: 'Ethan Nwaneri (15y 181d)',
            oldestPlayer: 'Thiago Silva (38)'
          }
        },
        {
          id: 'goals-2223',
          icon: '⚽',
          title: 'Total Goals',
          number: '1,084',
          description: 'Goals in 2022-23 season',
          details: {
            matchesPlayed: 380,
            goalsPerMatch: 2.85,
            topScorer: 'Erling Haaland (36 goals)',
            goldenBoot: 'Erling Haaland',
            ownGoals: 32
          }
        },
        {
          id: 'assists-2223',
          icon: '🎯',
          title: 'Total Assists',
          number: '756',
          description: 'Season assists',
          details: {
            assistsPerMatch: 1.99,
            topAssister: 'Kevin De Bruyne (16 assists)',
            playmakerAward: 'Kevin De Bruyne',
            keyPasses: 4823,
            chances: 2156
          }
        },
        {
          id: 'matches-2223',
          icon: '📊',
          title: 'Matches Played',
          number: '380',
          description: 'Full season completed',
          details: {
            homeWins: 169,
            awayWins: 112,
            draws: 99,
            champion: 'Manchester City (89 pts)',
            topScorer: 'Haaland (36)'
          }
        }
      ]
    }
  ];

  const toggleCard = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <section className="stats-section" id="stats">
      <h2 className="section-title">📊 Dataset Overview by Season</h2>
      
      {seasonData.map((seasonBlock) => (
        <div key={seasonBlock.season} className="season-block">
          <div className="season-header">
            <h3 className="season-title">{seasonBlock.season}</h3>
            <span className={`season-badge ${seasonBlock.status.toLowerCase().replace(' ', '-')}`}>
              {seasonBlock.status}
            </span>
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
