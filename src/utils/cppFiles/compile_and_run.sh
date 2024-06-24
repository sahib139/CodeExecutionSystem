#!/bin/bash

# Get the names of the C++ source file and input file
cpp_file="$1"
input_file="$2"
time_limit="$3" 

# Check if both arguments are provided
if [ -z "$cpp_file" ] || [ -z "$input_file" ]; then
  echo "Usage: $0 <cpp_file.cpp> <input_file>"
  exit 1
fi

# Extract the base filename without extension (assuming .cpp)
base_name="${cpp_file%.*}"

compile_output=$(g++ -o "$base_name" "$cpp_file" 2>&1)

# Check compilation status
if [ $? -eq 0 ]; then
  echo "Success: Compilation successful."

  # Run the executable with input redirection, limiting execution time to 5 seconds
  timeout "$time_limit"s ./"$base_name" < "$input_file"
  if [ $? -eq 124 ]; then
    echo "Error: Execution timed out."
  fi
else
  echo "Error: Compilation failed."
  echo "$compile_output"  # Display the compilation errors
fi