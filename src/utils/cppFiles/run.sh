#!/bin/bash

# Function to generate current timestamp with nanoseconds
getCurrentDateTime() {
    date '+%Y%m%d_%H%M%S%N'
}

# Get the names of the C++ source file, input file, and time limit
cpp_file="$1"
input_file="$2"
time_limit="$3"

# Check if both arguments are provided
if [ -z "$cpp_file" ] || [ -z "$input_file" ]; then
  echo "Usage: $0 <cpp_file.cpp> <input_file> <time_limit>"
  exit 1
fi

# Extract the base filename without extension (assuming .cpp)
base_name="${cpp_file%.*}"

# Generate unique timestamp for file names
timestamp=$(getCurrentDateTime)

# Compile the C++ source file and capture any errors
g++ -o "$base_name" "$cpp_file" 2> "compile_errors_$timestamp.txt"

# Check compilation status
if [ $? -eq 0 ]; then
  echo "Success: Compilation successful."

  # Run the executable with input redirection and time limit, capturing stdout and stderr
  { time timeout "$time_limit"s ./"$base_name" < "$input_file" ; } > "output_$timestamp.txt" 2> "time_$timestamp.txt"
  execution_status=$?

  # Check if the execution timed out
  if [ $execution_status -eq 124 ]; then
    echo "Error: Execution timed out."
  else
    # Display the command output and timing information
    echo "Execution Output:"
    cat "output_$timestamp.txt"
    echo
    real_time=$(grep 'real' "time_$timestamp.txt" | awk '{print $2}' | sed 's/m/:/g' | awk -F: '{print ($1 * 60 + $2)"s"}')
    echo "Timing Information: $real_time"
    rm -f "output_$timestamp.txt" "time_$timestamp.txt"
  fi
else
  echo "Error: Compilation failed."
  echo "Compilation errors:"

  # Read and classify the compilation errors
  while IFS= read -r line; do
    if [[ $line == *"error: "* ]]; then
      if [[ $line == *"syntax error"* ]]; then
        echo "Syntax Error: $line"
      elif [[ $line == *"undeclared identifier"* ]]; then
        echo "Undeclared Identifier: $line"
      elif [[ $line == *"no matching function for call to"* ]]; then
        echo "Function Call Error: $line"
      elif [[ $line == *"expected"* ]]; then
        echo "Expected Error: $line"
      elif [[ $line == *"cannot be used as a function"* ]]; then
        echo "Function Misuse: $line"
      else
        echo "General Error: $line"
      fi
    else
      echo "$line"
    fi
  done < "compile_errors_$timestamp.txt"

  # Cleanup
  rm -f "compile_errors_$timestamp.txt"
fi
