from fastapi import FastAPI, HTTPException, Depends
import sqlite3
from stats_db_config import get_stats_db_path
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router  

'''
creates endpoints that frontend can query to retrieve necessary static data
'''

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#add router for authentication endpoints
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])

def get_connection():
    '''generator function that acts as a dependency for FastAPI endpoints'''
    
    connection = sqlite3.connect(get_stats_db_path(),check_same_thread=False)
    # allows us to access column names rather than their index
    connection.row_factory = sqlite3.Row
    
    try:
        # yield ensures the connection passed to endpoint will be closed in finally block
        yield connection
        
    finally:
        connection.close()
        
def load_cached_data():
    '''allows for better modularity by caching seasons and stat columns at startup'''
    
    connection = None
    
    try:
        connection = sqlite3.connect(get_stats_db_path())
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()
        
        seasons = [
            season_abbr[0]
            for season_abbr in cursor.execute(
                '''
                SELECT season_abbr
                FROM seasons
                ORDER BY season_abbr
                '''
            )
        ]
        
        irrelevant = ["id", "player_id", "season_id"]
        available_stats = cursor.execute("PRAGMA table_info(player_stats)")
        available_stats = [row["name"] for row in cursor.fetchall() if row["name"] not in irrelevant]
        
        return (seasons, available_stats)
    
    except Exception as e:
        print(f"FATAL ERROR: Failed to connect to db at 'load_cached_data()': {e}.")
        raise
    
    finally:
        connection.close()

SEASONS, AVAILABLE_STATS = load_cached_data()

@app.get("/")
def read_root():
    '''default endpoint when server goes up'''
    
    return {"status": "Server up and running..."}

@app.get("/api/stats")
def get_seasons_and_stats():
    '''test endpoint to retrieve all seasons and stat categories available'''
    
    return {
        "seasons": SEASONS,
        "available_stats": AVAILABLE_STATS
    }

@app.get("/api/stats/summary")
def get_seasons_and_stats(connection: sqlite3.Connection = Depends(get_connection)):
    '''test endpoint to retrieve  and stat categories available'''

    cursor = connection.cursor()
    
    # retrieve the summary stats for the season to populate the "data cards" on the homepage 
    count_query = '''
        SELECT season_abbr,
            COUNT(players.full_name) AS total_players,
            SUM(player_stats.goals_scored) AS total_goals,
            SUM(player_stats.assists) AS total_assists,
            SUM(player_stats.minutes) AS total_minutes
        FROM player_stats
        JOIN players ON player_stats.player_id = players.id
        JOIN seasons ON player_stats.season_id = seasons.id
        group by season_abbr 
        ORDER BY CAST(SUBSTRING(season_abbr, 1, 2) AS INT) DESC
        LIMIT 3;
    '''
    # execute the query and return json response in the format:
    cursor.execute(count_query)
    results = [
        {
          "season": f"20{row['season_abbr'].split('-')[0]}-20{row['season_abbr'].split('-')[1]}",
          "status": 'Current Season',
          "stats": [
                {
                    "id": "players-" + row["season_abbr"],
                    "title": "Total Players",
                    "icon": '👥',
                    "number": row["total_players"],
                    "url": "/players",
                    "description": "Total number of players who played in the season"
                }, 
                {
                    "id": "goals-" + row["season_abbr"],
                    "title": "Total Goals",
                    "icon": '⚽',
                    "number": row["total_goals"],
                    "url": "/goals",
                    "description": "Total number of goals scored in the season"
                },
                {
                    "id": "assists-" + row["season_abbr"],
                    "title": "Total Assists",
                    "icon": '🎯',
                    "number": row["total_assists"],
                    "url": "/assists",
                    "description": "Total number of assists in the season"
                },
                {
                    "id": "minutes-" + row["season_abbr"],
                    "title": "Minutes Played",
                    "icon": '📊',
                    "number": row["total_minutes"],
                    "url": "/mintues", 
                    "description": "Total number of minutes played in the season"
                }
            ]
        }
        for row in cursor.fetchall()
    ]
    
    return results

@app.get("/api/stats/{season}/{category}")
def get_stat_leaders(season: str, category: str, limit: int = 10, connection: sqlite3.Connection = Depends(get_connection)):
    '''
    endpoint to retrieve top n performers in specified category from specified season
    provides data to "data cards" discussed for homepage
    '''
    
    if season not in SEASONS:
        raise HTTPException(status_code = 404, detail = f"Data for season {season} is not available.")
    
    if category not in AVAILABLE_STATS:
        raise HTTPException(status_code = 400, detail = f"Category {category} not found in dataset.")
    
    cursor = connection.cursor()
    
    # retrieve the name and specific stat columns for the top N performers 
    # example: get 'first_name', 'second_name', and 'goals_scored' for the top 10 goal scorers
    top_performers_query = f'''
        SELECT players.full_name, player_stats.{category}
        FROM player_stats
        JOIN players ON player_stats.player_id = players.id
        JOIN seasons ON player_stats.season_id = seasons.id
        WHERE seasons.season_abbr = ?
        ORDER BY player_stats.{category} DESC
        LIMIT ?
    '''
    cursor.execute(top_performers_query, (season, limit))
    top_performers = [{"player": row["full_name"], category: row[category]} for row in cursor.fetchall()]
    
    return {
        "season": season,
        "category": category,
        "display_name": category.replace("_", " ").title(),
        "top_performers": top_performers
    }



@app.get("/api/stats/topperformers")
def get_stat_leaders(connection: sqlite3.Connection = Depends(get_connection)):
    '''
    endpoint to retrieve top n performers in specified category from specified season
    provides data to "data cards" discussed for homepage
    '''
       
    cursor = connection.cursor()
    
    # retrieve the name and specific stat columns for the top N performers 
    # example: get 'first_name', 'second_name', and 'goals_scored' for the top 10 goal scorers
    top_performers_query = f'''
    -- First, get the last 3 seasons
     WITH LatestSeasons AS (
            SELECT season_abbr
            FROM seasons
            ORDER BY season_abbr DESC
            LIMIT 3
        ),
        RankedPlayers AS (
            SELECT 
                s.season_abbr,
                p.id AS player_id,
                p.full_name,
                ps.goals_scored,
                ps.assists,
                ps.minutes,
                ps.goals_conceded,
                ROW_NUMBER() OVER (
                    PARTITION BY s.season_abbr
                    ORDER BY ps.goals_scored DESC
                ) AS rn
            FROM player_stats ps
            JOIN players p ON ps.player_id = p.id
            JOIN seasons s ON ps.season_id = s.id
            WHERE s.season_abbr IN (SELECT season_abbr FROM LatestSeasons)
        )
        SELECT *
        FROM RankedPlayers
        WHERE rn <= 3
        ORDER BY season_abbr DESC, goals_scored DESC;
'''

    cursor.execute(top_performers_query)
    rows = cursor.fetchall()
   
    # Format as JSON with top 3 performers per season
    from collections import defaultdict

    season_map = defaultdict(list)

    for row in rows:
        season_map[row["season_abbr"]].append({
            "id": f"{row['full_name'].lower().replace(' ', '-')}-{row['season_abbr']}",
            "rank": len(season_map[row["season_abbr"]]) + 1,
            "name": row["full_name"],
            "stats": {
                "goals": row["goals_scored"],
                "assists": row["assists"],
                "goals_conceded": row["goals_conceded"],
                "minutes": row["minutes"]              
            }
        })

    result = [
        {
           "season": f"20{season.split('-')[0]}-20{season.split('-')[1]}",
            "status": "Current Season" if season == SEASONS[-1] else "Previous Season",
            "performers": performers
        } for season, performers in season_map.items()
    ]
    return result
