FROM python:3.14-slim
COPY --from=docker.io/astral/uv:latest /uv /uvx /bin/

WORKDIR /usr/src/app

COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-dev --system-certs

COPY src ./src

EXPOSE 8000

ENV WEAVIATE_HOST='host.docker.internal'
ENV WEAVIATE_PORT='8080'
ENV WEAVIATE_COLLECTION='color_sense'
ENV EMBEDDING_MODEL='all-MiniLM-L6-v2'

ENTRYPOINT [".venv/bin/fastapi"]
CMD ["run","./src/app.py", "--host", "0.0.0.0", "--port", "8000"]