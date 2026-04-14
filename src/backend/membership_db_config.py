from pathlib import Path
import sqlite3

"""
initialises the memberships database and creates membership_info table to store
all relevant information about different membership tiers displayed
on frontend membership page
"""

CURRENT_DIR = Path(__file__).resolve()
# even if file is not yet made, establish the path to give to sqlite3
DB_PATH = CURRENT_DIR.parent / "database" / "memberships.db"

TIERS = [
    (
        "Scout", 
        15, 
        0, 
        "Track your favorite player's performance and get essential season stats at a glance."
    ),
    (
        "Analyst", 
        150, 
        7, 
        "Unlock deep-dive comparisons, historical trends, and league-wide metrics."
    ),
    (
        "Manager", 
        1000, 
        15, 
        "Unrestricted research. Build exhaustive reports and analyze full seasons with ease."
    )
]

def initialise_and_populate_db():
    connection = None
    
    try:
        # create the "database" folder if it doesn't exist, if it does no error raised
        DB_PATH.parent.mkdir(parents=True, exist_ok=True)
        
        # "memberships.db" file created and/or opened
        connection = sqlite3.connect(DB_PATH)  
        cursor = connection.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS memberships (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                requests_per_day INTEGER NOT NULL,
                price INTEGER NOT NULL,
                description TEXT NOT NULL
            ) 
        ''')
        
        cursor.executemany(
            '''
            INSERT OR IGNORE INTO memberships (name, requests_per_day, price, description)
            VALUES (?, ?, ?, ?)
            ''',
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
