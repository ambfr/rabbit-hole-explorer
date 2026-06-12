from fastapi import FastAPI, HTTPException

from database import client

app = FastAPI()


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
