# premier-league-data-analyser

## Description
A web application that provides the ability to freely query a ML model and get a data-specific response, along with static data cards with top performers. The dataset used includes all Premier League player data between 2016-2025.

## Setup and Use

### 1. Clone the repository
```bash
git clone https://github.com/grey-otoc/premier-league-data-analyser.git
cd premier-league-data-analyser
```

### 2. Setup Python Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# And activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure API Key
Add your Gemini API key to the ".env" file in "src/backend/":
```bash
GEMINI_KEY = "INPUT_YOUR_KEY_HERE"
```

This key can be obtained from https://ai.google.dev/gemini-api/docs/api-key

### 5. Install Frontend Dependencies
```bash
cd premier-league-data-analyser/src/frontend
npm install
```

### 6. Start the Application

**Terminal 1 - Backend:**
```bash
fastapi dev premier-league-data-analyser/src/backend/api.py
```

**Terminal 2 - Frontend:**
```bash
cd premier-league-data-analyser/src/frontend/src
npm run dev
```

Visit the URL shown by Vite (usually http://localhost:5173) and try out our app!
