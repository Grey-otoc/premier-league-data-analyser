from fastapi import FastAPI, HTTPException
import pandas as pd
from pathlib import Path

'''
creates endpoints that frontend can query to retrieve necessary static data
'''

# dervive files path to player_data directory
CURRENT_DIR = Path(__file__).resolve()
PLAYER_DATA_DIR = CURRENT_DIR.parent / "player_data"

app = FastAPI()

# ensure player_data directory and files exist before attempting access
if not PLAYER_DATA_DIR.exists() or not any(PLAYER_DATA_DIR.glob("*.csv")):
    raise FileNotFoundError("Player directory and/or files were not found.")

# retrieve data from player_data directory and store in dataframes 
season_data = {}
for file in PLAYER_DATA_DIR.glob("*.csv"):
    # .stem returns the file name without the file type (".csv")
    extracted_season = file.stem.split("_")[2]
    
    # load each csv file into a df and add them to the dictionary
    season_data[extracted_season] = pd.read_csv(PLAYER_DATA_DIR / file.name)

@app.get("/")
def read_root():
    '''default endpoint when server goes up'''
    
    return {"status": "Server up and running..."}

@app.get("/api/stats")
def get_seasons_and_stats():
    '''test endpoint to retrieve all seasons and stat categories available'''
    
    return {
        "seasons": sorted(list(season_data.keys()), reverse = True),
        "available_stats": sorted({col for season in season_data.values() for col in season.columns})
    }

@app.get("/api/stats/{season}/{category}")
def get_stat_leaders(season: str, category: str, limit: int = 10):
    '''
    endpoint to retrieve top n performers in specified category from specified season
    provides data to "data cards" discussed for homepage
    '''
    
    if season not in season_data:
        raise HTTPException(status_code = 404, detail = f"Data for season {season} is not available.")
    
    season_df = season_data[season]
    if category not in season_df.columns:
        raise HTTPException(status_code = 400, detail = f"Category {category} not found in dataset.")
    
    # retrieve the name and specific stat columns for the top N performers 
    # example: get 'first_name', 'second_name', and 'goals_scored' for the top 10 goal scorers
    top_performers = season_df.nlargest(limit, category.lower())[["first_name", "second_name", category.lower()]]
    
    return {
        "season": season,
        "category": category,
        "display_name": category.replace("_", " ").title(),
        "top_players": top_performers.to_dict("records")
    }
