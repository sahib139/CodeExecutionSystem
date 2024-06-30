#!/bin/bash

# Function to generate current timestamp with nanoseconds
getCurrentDateTime() {
    date '+%Y%m%d_%H%M%S%N'
}

# Get the names of the Python source file, input file, and time limit
python_file="$1"
input_file="$2"
time_limit="$3"

# Check if both arguments are provided
if [ -z "$python_file" ] || [ -z "$input_file" ]; then
  echo "Usage: $0 <python_file.py> <input_file> <time_limit>"
  exit 1
fi

# Generate unique timestamp for file names
timestamp=$(getCurrentDateTime)

# Ensure the Python script is syntactically correct
python3 -m py_compile "$python_file" 2> "compile_errors_$timestamp.txt"

# Check syntax check status
if [ $? -eq 0 ]; then
  echo "Success: Syntax check successful."

  # Run the Python script with input redirection and time limit, capturing stdout and stderr
  { time timeout "$time_limit"s python3 "$python_file" < "$input_file" ; } > "output_$timestamp.txt" 2> "time_$timestamp.txt"
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
  echo "Error: Syntax check failed."
  echo "Syntax errors:"

  # Read and classify the syntax errors
  while IFS= read -r line; do
    echo "$line"
  done < "compile_errors_$timestamp.txt"

  # Cleanup
  rm -f "compile_errors_$timestamp.txt"
fi
