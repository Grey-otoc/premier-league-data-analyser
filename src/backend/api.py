from fastapi import FastAPI, HTTPException, Depends
import sqlite3
from stats_db_config import get_db_path

'''
creates endpoints that frontend can query to retrieve necessary static data
'''

app = FastAPI()

def get_connection():
    '''generator function that acts as a dependency for FastAPI endpoints'''
    
    connection = sqlite3.connect(get_db_path())
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
        connection = sqlite3.connect(get_db_path())
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
