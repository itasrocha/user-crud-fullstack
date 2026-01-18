from fastapi import FastAPI

app = FastAPI(title="CRUD de Usuários")

@app.get("/")
def read_root():
    return {"status": "ok"}