    FROM python:3.10-slim

    WORKDIR /usr/src/app

    COPY requirements.txt ./
    RUN pip install --no-cache-dir -r requirements.txt

    COPY . .

    EXPOSE 8000

    ENV WEAVIATE_HOST='host.docker.internal'
    ENV WEAVIATE_PORT='8080'
    ENV WEAVIATE_COLLECTION='color_sense'

    ENTRYPOINT ["uvicorn"]
    CMD ["src.app:app", "--host", "0.0.0.0", "--port", "8000"]