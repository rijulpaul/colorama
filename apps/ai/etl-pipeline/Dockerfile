FROM ubuntu:22.04

RUN apt-get update && apt-get install -y python3 python3-pip git

RUN git clone --depth 1 --filter=blob:none --no-checkout https://github.com/rijulpaul/colorama.git && \
    cd colorama && \
    git sparse-checkout init --cone && \
    git sparse-checkout set apps/web && \
    git checkout main

COPY requirements.txt /

RUN pip install -r requirements.txt

COPY main.py /

CMD ["python3","main.py"]