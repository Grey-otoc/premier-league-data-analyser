from fastapi import APIRouter

router = APIRouter()
TIERS = [
    {"name": "Free", "requests": 5},
    {"name": "Pro", "requests": 10},
    {"name": "Elite", "requests": 15},
]

@router.get("/summary")
def get_memberships():
    return {
        "memberships": TIERS
    }
