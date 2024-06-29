#!/bin/bash

# Define an array of languages
languages=("cpp" "java" "python" "go" "ruby") # Can more languages in future!

# Base directory for Dockerfiles
base_dir="DockerFiles"

# Iterate over each language
for lang in "${languages[@]}"; do
    dockerfile_dir="$base_dir/$lang"
    dockerfile="$dockerfile_dir/Dockerfile"
    
    if [ -f "$dockerfile" ]; then
        echo "Building Docker image for $lang..."
        
        # Navigate to the Dockerfile directory, exit if cd fails
        cd "$dockerfile_dir" || { echo "Failed to navigate to $dockerfile_dir. Skipping $lang."; continue; }
        
        # Try to build the Docker image, capture any error
        if ! sudo docker build -t "${lang}_runner" .; then
            echo "Error occurred while building Docker image for $lang. Skipping to the next language."
        fi
        
        # Return to the base directory
        cd - > /dev/null || exit
    else
        echo "No Dockerfile found for $lang. Skipping."
    fi
done

echo "Docker build process completed."
