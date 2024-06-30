FROM alpine:latest

# Install necessary packages
RUN apk add --no-cache \
    python3 \
    coreutils \
    bash \
    procps

# Set the working directory
WORKDIR /app

# Copy the necessary files to the working directory
RUN touch compile_and_run.sh 
RUN touch myprogram.py 
RUN touch input.txt 

# Ensure the script is executable
RUN chmod +x compile_and_run.sh

# Set the entry point to the script
ENTRYPOINT ["/bin/bash", "/app/compile_and_run.sh"]