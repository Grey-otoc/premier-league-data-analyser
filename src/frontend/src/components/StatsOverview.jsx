import React, { useState, useEffect } from 'react';
import './StatsOverview.css';
import AdBanner from './AdBanner';

const StatsOverview = () => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [statsData, setSeasonData] = useState([]);
  const apiUrl = import.meta.env.VITE_LEAGUE_API_URL;

  useEffect(() => {
    const fetchSeasons = async () => {
      try {

        const response = await fetch(`${apiUrl}/stats/leaders?limit=5`);
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


  const [expandedCategories, setExpandedCategories] = useState({});

  const handleViewMore = (seasonKey, categoryKey) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [`${seasonKey}-${categoryKey}`]: true,
    }));
  };
  if (!statsData || !statsData.seasons) return <p>Loading stats...</p>;

  return (
    <><div className="container mx-auto px-4">
      {Object.entries(statsData.seasons).map(([seasonKey, seasonData]) => (
        <div key={seasonKey} className="mb-16"> {/* Increased spacing between seasons */}
          <h2 className="text-xl font-bold mb-6">{`Season ${seasonKey}`}</h2>
          <div className="flex flex-wrap gap-6"> {/* Increased spacing between cards */}
            {seasonData &&
              Object.entries(seasonData).map(([categoryKey, category]) => {
                const isExpanded = expandedCategories[`${seasonKey}-${categoryKey}`];
                const topPerformers = isExpanded
                  ? category.top_performers
                  : category.top_performers.slice(0, 4);

                return (
                  <div
                    key={categoryKey}
                    className="w-full sm:w-64 bg-white border border-gray-200 rounded-lg shadow p-4"
                  >
                    <h2 className="text-lg font-semibold mb-3">
                      {category.display_name}
                    </h2>
                    <ul className="mb-4">
                      {topPerformers.map((player, index) => {
                        const statValue = Object.values(player).find(
                          (v) => typeof v === "number"
                        );
                        return (
                          <li
                            key={index}
                            className={`flex justify-between py-1 ${index !== topPerformers.length - 1
                              ? "border-b border-gray-100"
                              : ""}`}
                          >
                            <span>{player.player}</span>
                            <span>{statValue}</span>
                          </li>
                        );
                      })}
                    </ul>
                    {!isExpanded && (
                      <button
                        onClick={() => handleViewMore(seasonKey, categoryKey)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                      >
                        View More
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div><AdBanner /></>
  );
};

export default StatsOverview;
