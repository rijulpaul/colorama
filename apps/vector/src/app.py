from fastapi import FastAPI

from dotenv import load_dotenv

load_dotenv(Path(__file__).parents[2] / ".env")

from src.services.generate_embeddings import generate_embeddings
from src.services.weaviate_client import Weaviate

app = FastAPI()
db = Weaviate()

@app.get('/health')
async def get_health():
    return {"message": "ok"}

@app.get('/')
async def get_vectors(query: str):
    vector = generate_embeddings(query)
    res = db.query(query,vector)
    return res
