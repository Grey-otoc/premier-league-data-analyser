from pathlib import Path
import sqlite3

"""
initialises the user database and creates user_info table for all account information
"""

CURRENT_DIR = Path(__file__).resolve()
# even if file is not yet made, establish the path to give to sqlite3
DB_PATH = CURRENT_DIR.parent / "database" / "memberships.db"

TIERS = [
    (5, "Free"),
    (10, "Pro"),
    (15, "Elite")
]

def initialise_and_populate_db():
    connection = None
    
    try:
        # create the 'database' folder if it doesn't exist, if it does no error raised
        DB_PATH.parent.mkdir(parents=True, exist_ok=True)
        
        # "memberships.db" file created and/or opened
        connection = sqlite3.connect(DB_PATH)  
        cursor = connection.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS memberships (
                id INTEGER PRIMARY KEY,
                requests_per_ten INTEGER NOT NULL,
                name TEXT NOT NULL UNIQUE
            ) 
        ''')
        
        cursor.executemany(
            '''INSERT OR IGNORE INTO memberships (requests_per_ten, name) VALUES (?, ?)''',
            TIERS
        )
        
        connection.commit()
    
    except Exception as e:
        print(f"FATAL ERROR: Failed to initialise membership database: {e}")
        if connection:
            connection.rollback()
        raise
    
    finally:
        if connection:
            connection.close()
    
def get_membership_db_path() -> Path:
    if not DB_PATH.exists():
        print("NON-FATAL ERROR: Membership database file not found. Initialising new database...")
        initialise_and_populate_db()

    return DB_PATH

if __name__ == "__main__":
    initialise_and_populate_db()
