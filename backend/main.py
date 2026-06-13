from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import client
from routes.auth import router as auth_router
from routes.graph import router as graph_router

from routes import graphs


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(graph_router)
app.include_router(graphs.router)

@app.get("/")
def read_root():
    return {"message": "Hello World"}


@app.get("/ping")
async def ping():
    try:
        await client.admin.command("ping")
        return {"db": "connected"}
    except Exception:
        raise HTTPException(status_code=503, detail="Database connection failed")