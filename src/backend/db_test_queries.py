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
            
def get_table_row_counts():
    connection = None
    
    try:
        connection = sqlite3.connect(get_db_path())
        cursor = connection.cursor()

        cursor.execute("SELECT COUNT(*) FROM players")
        print("Players:", cursor.fetchone()[0])

        cursor.execute("SELECT COUNT(*) FROM seasons")
        print("Seasons:", cursor.fetchone()[0])

        cursor.execute(
            '''SELECT COUNT(*) FROM player_stats WHERE season_id = ?''',
            (4,)
        )
        print("Player Stats:", cursor.fetchone()[0])
        
    except Exception as e:
        print("FATAL ERROR: Failed to perform table counts: {e}")
        raise
        
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    get_table_row_counts()
    print(get_season_abbrs())
