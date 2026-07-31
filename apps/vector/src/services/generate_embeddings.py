import os

from sentence_transformers import SentenceTransformer

EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL")

model = SentenceTransformer(EMBEDDING_MODEL)


def generate_embeddings(text):
    return model.encode(text)
