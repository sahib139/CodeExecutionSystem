#!/bin/bash

# Function to extract the public class name from a Java file
extractPublicClassName() {
    java_file="$1"
    class_name=$(grep -oE 'public class \w+' "$java_file" | awk '{print $3}')
    echo "$class_name"
}

# Function to generate current timestamp with nanoseconds
getCurrentDateTime() {
    date '+%Y%m%d_%H%M%S%N'
}

# Get the names of the Java source file, input file, and time limit
java_file="$1"
input_file="$2"
time_limit="$3"

# Check if all arguments are provided
if [ -z "$java_file" ] || [ -z "$input_file" ] || [ -z "$time_limit" ]; then
  echo "Usage: $0 <JavaFile.java> <input_file> <time_limit>"
  exit 1
fi

# Extract the public class name
public_class_name=$(extractPublicClassName "$java_file")

# Check if the class name was extracted successfully
if [ -z "$public_class_name" ]; then
  echo "Error: No public class found in $java_file"
  exit 1
fi

# Copy the file if necessary
if [ "$public_class_name.java" != "$java_file" ]; then
  cp "$java_file" "${public_class_name}.java"
  java_file="${public_class_name}.java"
fi

# Verify if the copied file exists
if [ ! -f "$java_file" ]; then
  echo "Error: Copied file $java_file not found."
  exit 1
fi

# Generate unique timestamp for file names
timestamp=$(getCurrentDateTime)

# Compile the Java source file and capture any errors
javac "$java_file" 2> "compile_errors_$timestamp.txt"

# Check compilation status
if [ $? -eq 0 ]; then
  echo "Success: Compilation successful."

  # Run the Java class with input redirection and time limit, capturing stdout and stderr
  { /usr/bin/time -v timeout "$time_limit"s java "$public_class_name" < "$input_file" ; } > "output_$timestamp.txt" 2> "time_$timestamp.txt"
  execution_status=$?

  # Check if the execution timed out
  if [ $execution_status -eq 124 ]; then
    echo "Error: Execution timed out."
  else
    # Display the command output and timing information
    echo "Execution Output:"
    cat "output_$timestamp.txt"
    # Display timing and resource usage information
    real_time=$(grep 'Elapsed (wall clock) time' "time_$timestamp.txt" | awk '{for (i=8; i<=NF; i++) printf "%s ", $i; print ""}')
    cpu_usage=$(grep 'Percent of CPU this job got' "time_$timestamp.txt" | awk -F ': ' '{print $2}')
    memory_usage=$(grep 'Maximum resident set size' "time_$timestamp.txt" | awk '{for (i=6; i<=NF; i++) printf "%s ", $i; print ""}')
    
    echo "Timing Information: $real_time"
    echo "CPU Usage: $cpu_usage"
    echo "Memory Usage: $memory_usage KB"
    echo "----------------"
    echo "ENDENDEND" >> "output_$timestamp.txt"
    cat "output_$timestamp.txt" >> "AllOutput_$timestamp.txt"
    echo "$real_time ENDENDEND" >> "AllOutput_Timing_$timestamp.txt"
    echo "$memory_usage ENDENDEND" >> "AllOutput_Memory_$timestamp.txt"
    rm -f "output_$timestamp.txt" "time_$timestamp.txt"
  fi
else
  echo "Error: Compilation failed."
  echo "Compilation errors:"

  # Read and classify the compilation errors
  while IFS= read -r line; do
    if [[ $line == *"error: "* ]]; then
      if [[ $line == *"cannot find symbol"* ]]; then
        echo "Symbol Error: $line"
      elif [[ $line == *"class, interface, or enum expected"* ]]; then
        echo "Class/Interface/Enum Error: $line"
      elif [[ $line == *"';' expected"* ]]; then
        echo "Syntax Error: $line"
      elif [[ $line == *"method does not override or implement a method from a supertype"* ]]; then
        echo "Override Error: $line"
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
