from dotenv import load_dotenv
from fastapi import APIRouter, Depends
from google import genai
import os
from pathlib import Path
from pydantic import BaseModel
from stats_db_config import get_stats_db_path
import sqlite3

'''
creates endpoint that leverages Google Gemini API to provide answers for users
free form questions
'''

ENV_FILE_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(ENV_FILE_PATH)
GEMINI_KEY = os.getenv("GEMINI_KEY")
client = genai.Client(api_key=GEMINI_KEY)

router = APIRouter()

# defines the argument structure when a user asks a question, converts JSON 
# input from frontend to python object on backend
class UserQuestion(BaseModel):
    season: str
    question: str

# sample question
question = UserQuestion(
    season="22-23",
    question="Who was the top goal scorer in this season?"
)

def get_connection():
    '''generator function that acts as a dependency for FastAPI endpoints'''
    
    connection = sqlite3.connect(get_stats_db_path(), check_same_thread=False)
    # allows us to access column names rather than their index
    connection.row_factory = sqlite3.Row
    
    try:
        # yield ensures the connection passed to endpoint will be closed in finally block
        yield connection
        
    finally:
        connection.close()

@router.post("/ask")
def ask_question(ques: UserQuestion, connection: sqlite3.Connection = Depends(get_connection)) -> dict:
    '''
    endpoint to prompt Gemini LLM and receive a response    
    '''

    cursor = connection.cursor()
    
    cursor.execute(
        '''SELECT players.full_name, player_stats.*
        FROM player_stats
        JOIN players ON player_stats.player_id = players.id
        JOIN seasons ON player_stats.season_id = seasons.id
        WHERE seasons.season_abbr = ?''',
        (ques.season,)
    )
    data = [dict(row) for row in cursor.fetchall()]
    
    # "guidelines" are used to help keep the LLM in check in the case of invalid questions
    guidelines = """
        Only answer using the dataset. Do not invent players or statistics. 
        If the question cannot reliably be answered using this dataset and this
        dataset alone, respond exactly: \"Question cannot be answered from this dataset.\"
        then provide a one sentence descriptive error sentence."
    """
    
    # prompt sent to Gemini API
    prompt = f"""
        Dataset: {data}
        
        User's Question: {ques.question}
        
        Guidelines that MUST be followed: {guidelines}
    """
    
    response = client.models.generate_content(
        model="gemini-3.1-flash-lite-preview",
        contents=prompt
    )

    return {
        "answer": response.text
    }
