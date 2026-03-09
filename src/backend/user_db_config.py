import pandas as pd
from pathlib import Path
import sqlite3

"""
initialises the user database and creates user_info table for all account information
"""

CURRENT_DIR = Path(__file__).resolve()
# even if file is not yet made, establish the path to give to sqlite3
DB_PATH = CURRENT_DIR.parent / "database" / "users.db"

def initialise_db():
    connection = None
    
    try:
        # Create the 'database' folder if it doesn't exist, if it does no error raised
        DB_PATH.parent.mkdir(parents=True, exist_ok=True)
        
        # "users.db" file created and/or opened
        connection = sqlite3.connect(DB_PATH)  
        cursor = connection.cursor()
        cursor.execute("DROP TABLE IF EXISTS users")
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                phone_number TEXT
            ) 
        ''')
        
        connection.commit()
    
    except Exception as e:
        print(f"FATAL ERROR: Failed to initialise users database: {e}")
        if connection:
            connection.rollback()
        raise
    
    finally:
        if connection:
            connection.close()
            
    
def get_users_db_path() -> Path:
    if not DB_PATH.exists():
        print("NON-FATAL ERROR: Users database file not found. Initialising new database...")
        initialise_db()

    return DB_PATH

if __name__ == "__main__":
    initialise_db()
