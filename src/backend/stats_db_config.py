import pandas as pd
from pathlib import Path
import sqlite3

"""
initialises the stats database and creates players, seasons, and player_stats
tables if they do not exist

once schema is configured, populate_db reads statistics from player_data csv files
and inserts relevant data into relevant tables
"""

CURRENT_DIR = Path(__file__).resolve()
# even if file is not yet made, establish the path to give to sqlite3
DB_PATH = CURRENT_DIR.parent / "database" / "stats.db"
PLAYER_DATA_DIR = CURRENT_DIR.parent / "player_data"

def initialise_db():
    connection = None
    
    try:
        # Create the 'database' folder if it doesn't exist, if it does no error raised
        DB_PATH.parent.mkdir(parents=True, exist_ok=True)
        
        # "player_stats.db" file created and/or opened
        connection = sqlite3.connect(DB_PATH)
        # ensures foreign keys are enforced
        connection.execute("PRAGMA foreign_keys = ON;")
        
        cursor = connection.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS players (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL UNIQUE
            ) 
        ''')
        
        cursor.execute(''' 
            CREATE TABLE IF NOT EXISTS seasons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                season_abbr TEXT NOT NULL UNIQUE
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS player_stats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                player_id INTEGER NOT NULL,
                season_id INTEGER NOT NULL,
                
                goals_scored INTEGER DEFAULT 0,
                assists INTEGER DEFAULT 0,
                minutes INTEGER DEFAULT 0,
                goals_conceded INTEGER DEFAULT 0,
                creativity REAL DEFAULT 0.0,
                influence REAL DEFAULT 0.0,
                threat INTEGER DEFAULT 0,
                ict_index REAL DEFAULT 0.0,
                clean_sheets INTEGER DEFAULT 0,
                red_cards INTEGER DEFAULT 0,
                yellow_cards INTEGER DEFAULT 0,
                now_cost INTEGER DEFAULT 0,
                
                FOREIGN KEY(player_id) REFERENCES players(id),
                FOREIGN KEY(season_id) REFERENCES seasons(id),
                
                UNIQUE(player_id, season_id)
            )                   
        ''')

        connection.commit()
    
    except Exception as e:
        print(f"FATAL ERROR: Failed to initialise stats database: {e}")
        if connection:
            connection.rollback()
        raise
    
    finally:
        if connection:
            connection.close()
            
def populate_db():
    connection = None
    
    stats_db_path = get_db_path()

    if not PLAYER_DATA_DIR.exists() or not any(PLAYER_DATA_DIR.glob("*.csv")):
        raise FileNotFoundError("FATAL ERROR: Player directory and/or files were not found.")
    
    try:
        connection = sqlite3.connect(stats_db_path)
    
        for file in PLAYER_DATA_DIR.glob("*.csv"):
            # load each csv file into a df and add full_name column
            df = pd.read_csv(PLAYER_DATA_DIR / file.name)
            df["full_name"] = df["first_name"] + " " + df["second_name"]
            
            # populate seasons with every season abbreviation (like "23-24")
            extracted_season = file.stem.split("_")[2]
            populate_seasons_table(connection, extracted_season)
            
            # populate players table with every player full_name
            # must be done before player_stats table due to foreign key relationships
            full_names = [row.full_name for row in df.itertuples(index=False)]
            populate_players_table(connection, full_names)
            
            for row in df.itertuples(index=False):
                print(row.full_name)
                populate_player_stats_table(connection, row, extracted_season)
                break
    
    except Exception as e:
        print(f"FATAL ERROR: Failed while populating database: {e}")
        
        if connection:
            connection.rollback()
            
        raise
    
    finally:
        if connection:
            connection.close()
            
def populate_player_stats_table(connection: sqlite3.Connection, stat_row: pd.Series, extracted_season: str):
    cursor = connection.cursor()
    
    cursor.execute(
        '''SELECT id FROM players WHERE full_name = ?''',
        (stat_row.full_name,)
    )
    player_id = cursor.fetchone()
    
    if player_id == None:
        raise ValueError(
            f"FATAL ERROR: Database mismatch. Player {stat_row.full_name} not "
            f"found in players database."
        )
    
    cursor.execute(
        '''SELECT id FROM seasons WHERE season_abbr = ?''',
        (extracted_season,)
    )
    season_id = cursor.fetchone()
    
    if season_id == None:
        raise ValueError(
            f"FATAL ERROR: Database mismatch. Season {extracted_season} not "
            f"found in seasons database."
        )
        
    print(player_id, season_id, extracted_season)
    
        
def populate_players_table(connection: sqlite3.Connection, player_names: list):
    cursor = connection.cursor()
    
    for name in player_names:
        cursor.execute(
            '''SELECT 1 FROM players WHERE full_name = ?''',
            (name,)
        )
        result = cursor.fetchone()
        is_new_player = result is None
        
        if is_new_player:
            cursor.execute(
                '''INSERT INTO players (full_name) VALUES (?)''',
                (name,)
            )
        
    connection.commit()
        
def populate_seasons_table(connection: sqlite3.Connection, extracted_season: str):
    cursor = connection.cursor()
    cursor.execute(
        '''SELECT 1 FROM seasons WHERE season_abbr = ?''',
        (extracted_season,)
    )
    result = cursor.fetchone()
    is_new_season = result is None
    
    if is_new_season:
        cursor.execute(
            '''INSERT INTO seasons (season_abbr) VALUES (?)''',
            (extracted_season,)
        )
        
        connection.commit()
        
def get_db_path() -> Path:
    if not DB_PATH.exists():
        print("NON-FATAL ERROR: Stats database file not found. Initialising new database...")
        initialise_db()

    return DB_PATH

if __name__ == "__main__":
    #initialise_db()
    populate_db()
