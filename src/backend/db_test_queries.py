import pathlib
import sqlite3
from stats_db_config import get_db_path

def get_season_abbrs():
    connection = None
    
    try:
        connection = sqlite3.connect(get_db_path())
        cursor = connection.cursor()
        
        cursor.execute('''
            SELECT * FROM seasons
            ORDER BY id
        ''')
        
        seasons = cursor.fetchall()
        
        return seasons
        
    except Exception as e:
        print("FATAL ERROR: Failed to retrieve seasons abbreviations: {e}")
        raise
        
    finally:
        if connection:
            connection.close()
            
def get_player_names():
    connection = None
    
    try:
        connection = sqlite3.connect(get_db_path())
        cursor = connection.cursor()
        
        cursor.execute('''
            SELECT * FROM players
            ORDER BY id
        ''')
        
        players = cursor.fetchall()
        
        return players
        
    except Exception as e:
        print("FATAL ERROR: Failed to retrieve player names: {e}")
        raise
        
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    print(get_player_names())
