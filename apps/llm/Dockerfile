FROM alpine:latest AS build

RUN apk add --no-cache git build-base cmake linux-headers openssl-dev

RUN git clone https://github.com/ggml-org/llama.cpp /llama_cpp

WORKDIR /llama_cpp

RUN cmake -B build \
    -DCMAKE_BUILD_TYPE=Release \
    -DLLAMA_NATIVE=ON \
    -DLLAMA_OPENSSL=ON

RUN cmake --build build --parallel 4

FROM alpine:latest

RUN apk add --no-cache \
    libstdc++ libgomp

COPY --from=build /llama_cpp/build/bin/ /usr/local/bin/
COPY --from=build /llama_cpp/build/bin/*.so* /usr/local/lib/
    
ENV LD_LIBRARY_PATH=/usr/local/lib

EXPOSE 8001

CMD ["llama-server","-hf", "unsloth/Qwen2.5-Coder-0.5B-Instruct-GGUF:Q4_K_M","--host", "0.0.0.0","--port", "8001"]