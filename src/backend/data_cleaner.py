import pandas as pd
from pathlib import Path

# returns a Path object that directs to current file
CURRENT_DIR = Path(__file__).resolve()
PLAYER_DATA_DIR = CURRENT_DIR.parent / "player_data"

def remove_unnecessary_columns():
    '''
    Player data is originally pulled from the FPL (Fantasy Premier League) API
    and includes stats that are just bloat for our purposes...removes total_points
    (fantasy points), bonus, bps (bonus points system), selected_by_percent 
    (percent of FPL managers who selected that player), and element_type (position;
    useful but isn't available for every season)
    '''
    
    if not PLAYER_DATA_DIR.exists() or not any(PLAYER_DATA_DIR.iterdir()):
        raise FileNotFoundError("FATAL ERROR: Player data directory not found.")
    
    columns_to_drop = ["total_points", "bonus", "bps", "selected_by_percent", "element_type"]
    for file_path in PLAYER_DATA_DIR.iterdir():
        if file_path.is_file() and file_path.suffix == ".csv" and "extra" not in file_path.name:
            df = pd.read_csv(file_path, encoding="utf-8", encoding_errors="replace")

            # drop fantasy premier league specific statistics
            df.drop(
                columns=[col for col in columns_to_drop if col in df.columns],
                inplace=True
            )
            
            # create new, further cleaned CSV
            cleaned_file_path = f"extra_clean_{file_path.name.split("_")[0]}.csv"
            df.to_csv(PLAYER_DATA_DIR / cleaned_file_path, index=False)

if __name__ == "__main__":
    remove_unnecessary_columns()
