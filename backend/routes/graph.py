from fastapi import APIRouter, HTTPException, Query
from groq import APIError

from services.llm_service import expand_topic, get_random_topic

router = APIRouter(tags=["graph"])


@router.get("/expand")
async def expand(topic: str = Query(..., min_length=1)):
    try:
        return await expand_topic(topic)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except APIError as e:
        raise HTTPException(status_code=502, detail=e.message)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to expand topic")


@router.get("/random-topic")
async def random_topic():
    try:
        topic = await get_random_topic()
        return {"topic": topic}
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to generate random topic")

