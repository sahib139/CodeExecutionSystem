FROM ubuntu:latest
RUN apt-get update && apt-get install -y g++
WORKDIR /app
COPY compile_and_run.sh .
COPY myprogram.cpp .
COPY input.txt .
ENTRYPOINT ["/bin/bash", "compile_and_run.sh"]
