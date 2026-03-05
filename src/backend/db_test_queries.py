import pathlib
import sqlite3
from stats_db_config import get_stats_db_path
from user_db_config import get_users_db_path

def get_season_abbrs():
    connection = None
    
    try:
        connection = sqlite3.connect(get_stats_db_path())
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
        connection = sqlite3.connect(get_stats_db_path())
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
        connection = sqlite3.connect(get_stats_db_path())
        cursor = connection.cursor()

        cursor.execute("SELECT COUNT(*) FROM players")
        print("Players:", cursor.fetchone()[0])

        cursor.execute("SELECT COUNT(*) FROM seasons")
        print("Seasons:", cursor.fetchone()[0])

        cursor.execute(
            '''SELECT COUNT(*) FROM player_stats'''
        )
        print("Player Stats:", cursor.fetchone()[0])
        
    except Exception as e:
        print("FATAL ERROR: Failed to perform table counts: {e}")
        raise
        
    finally:
        if connection:
            connection.close()

def add_mock_user():
    connection = None
    
    try:
        connection = sqlite3.connect(get_users_db_path())
        cursor = connection.cursor()

        username = input("Username: ")
        password = input("Password: ")
        
        cursor.execute(
            '''INSERT INTO user_info (username, password_hash)
            VALUES (?, ?)''',
            (username, password)
        )
        connection.commit()
        
    except Exception as e:
        print("FATAL ERROR: Failed to add mock user to users database: {e}.")
        raise
        
    finally:
        if connection:
            connection.close()
            
def print_all_users():
    connection = None
    
    try:
        connection = sqlite3.connect(get_users_db_path())
        cursor = connection.cursor()

        cursor.execute("SELECT * FROM user_info")
        print("Users:", cursor.fetchall())
        
    except Exception as e:
        print("FATAL ERROR: Failed to retrieve and print users from database: {e}.")
        raise
        
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    #add_mock_user()
    #print_all_users()
    get_table_row_counts()
