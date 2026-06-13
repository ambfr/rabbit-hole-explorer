from fastapi import APIRouter, Depends

from database import db
from models.graph import SavedGraphCreate
from services.auth_service import get_current_user

from bson import ObjectId
from fastapi import HTTPException

router = APIRouter(tags=["graphs"])


@router.post("/graphs")
async def save_graph(graph: SavedGraphCreate, user: dict = Depends(get_current_user)):
    result = await db.saved_graphs.insert_one(
        {
            "user_id": str(user["_id"]),
            "title": graph.title,
            "nodes": graph.nodes,
            "edges": graph.edges,
        }
    )
    return {"id": str(result.inserted_id), "title": graph.title}


@router.get("/graphs")
async def list_graphs(user: dict = Depends(get_current_user)):
    cursor = db.saved_graphs.find({"user_id": str(user["_id"])})
    graphs = []
    async for doc in cursor:
        graphs.append(
            {
                "id": str(doc["_id"]),
                "title": doc["title"],
                "nodes": doc["nodes"],
                "edges": doc["edges"],
            }
        )
    return graphs


@router.delete("/graphs/{graph_id}")
async def delete_graph(graph_id: str, user: dict = Depends(get_current_user)):
    result = await db.saved_graphs.delete_one(
        {"_id": ObjectId(graph_id), "user_id": str(user["_id"])}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Graph not found")
    return {"deleted": True}