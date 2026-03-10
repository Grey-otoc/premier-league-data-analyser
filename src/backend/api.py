from routers import auth, stats, llm_questions
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

'''
establishes API server and connects to routers that provide endpoints
for frontend data requests
'''

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#add routers for authentication, stats, and LLM question box endpoints
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(stats.router, prefix="/api/stats", tags=["stats"])
app.include_router(llm_questions.router, prefix="/api/questions", tags=["questions"])

@app.get("/")
def read_root():
    '''default endpoint when server goes up'''
    
    return {"status": "Server up and running..."}
