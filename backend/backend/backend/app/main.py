from fastapi import FastAPI

app = FastAPI(title="Retail Future Engine API")

@app.get("/health")
def health():
    return {"status": "ok"}
