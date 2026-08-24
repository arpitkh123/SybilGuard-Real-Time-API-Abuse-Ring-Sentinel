from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import websockets
from app.core.config import settings

# Initialize the application using the Pydantic settings we defined earlier
app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

# Crucial for the hackathon pitch: allows a frontend dashboard to connect to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the WebSocket router
app.include_router(websockets.router)

@app.get("/")
async def root():
    return {"status": "SybilGuard Core Online"}