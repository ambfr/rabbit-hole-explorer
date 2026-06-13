from typing import Any

from pydantic import BaseModel


class SavedGraphCreate(BaseModel):
    title: str
    nodes: list[dict[str, Any]]
    edges: list[dict[str, Any]]


class SavedGraph(BaseModel):
    id: str
    title: str
    nodes: list[dict[str, Any]]
    edges: list[dict[str, Any]]