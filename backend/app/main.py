from fastapi import FastAPI
from .db import Base, engine
from .routes.auth import router as auth_router
from .routes.stores import router as stores_router
from .routes.ingest import router as ingest_router

app = FastAPI(title="Retail Future Engine")

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(stores_router)
app.include_router(ingest_router)

@app.get("/")
def root():
    return {"status": "ok"}