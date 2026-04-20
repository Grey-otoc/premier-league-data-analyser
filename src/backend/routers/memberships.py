from fastapi import APIRouter, Depends, HTTPException
from membership_db_config import get_membership_db_path
import sqlite3

router = APIRouter()

def get_connection():
    '''generator function that acts as a dependency for FastAPI endpoints'''
    
    connection = sqlite3.connect(get_membership_db_path(),check_same_thread=False)
    # allows us to access column names rather than their index
    connection.row_factory = sqlite3.Row
    
    try:
        # yield ensures the connection passed to endpoint will be closed in finally block
        yield connection
        
    finally:
        connection.close()

def load_cached_data():
    '''
    allows for more efficiency by caching membership data on startup rather
    than per request
    '''
    
    connection = None
    
    try:
        # we don't use the dependency here because startup isn't a request
        connection = sqlite3.connect(get_membership_db_path())
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()
        
        cursor.execute('''
            SELECT name, requests_per_day, price, description FROM memberships
        ''')
        
        memberships = [dict(row) for row in cursor.fetchall()]
        
        return memberships
    
    except Exception as e:
        print(f"FATAL ERROR: Could not cache membership data: {e}.")
        raise
    
    finally:
        connection.close()

MEMBERSHIPS = load_cached_data()

@router.get("/summary")
def get_memberships():
    if not MEMBERSHIPS:
        # if the cache failed to load
        raise HTTPException(status_code=503, detail="Membership data unavailable")

    return {
        "memberships": MEMBERSHIPS
    }
