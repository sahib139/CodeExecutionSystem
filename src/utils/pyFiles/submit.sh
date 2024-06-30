#!/bin/bash

# Function to generate current timestamp with milliseconds
getCurrentDateTime() {
    date '+%Y%m%d_%H%M%S%3N'
}

# Check if the correct number of arguments is provided
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <source_code> <input_file> <time_limit>"
    exit 1
fi

# Assign arguments to variables
source_code=$1
input_file=$2
time_limit=$3

# Generate unique timestamp for file names
timestamp=$(getCurrentDateTime)

# Split content by delimiter "\n" into an array directly from the file
IFS=$'\n' read -r -d '' -a numbers < "$input_file"

# Ensure the source code file exists
if [ ! -f "$source_code" ]; then
    echo "Error: Source code file $source_code not found."
    exit 1
fi

# Check if the Python script is syntactically correct
python3 -m py_compile "$source_code" 2> "compile_errors_$timestamp.txt"

# Check compilation status
if [ $? -eq 0 ]; then
    echo "Success: Syntax check successful."
    touch "AllOutput_$timestamp.txt" "AllOutput_Timing_$timestamp.txt" "AllOutput_Memory_$timestamp.txt"
    # Loop through each input case and perform tasks
    for number in "${numbers[@]}"; do
        # Write the current test case to an input file
        echo "$number" > "temp_input_$timestamp.txt"
        
        # Run the Python script with the current input and monitor CPU/memory usage
        { /usr/bin/time -v timeout "$time_limit"s python3 "$source_code" < "temp_input_$timestamp.txt" > "output_$timestamp.txt"; } 2> "time_$timestamp.txt"
        execution_status=$?
        
        # Check if the execution timed out
        if [ $execution_status -eq 124 ]; then
            echo "Error: Execution timed out for input: $number"
        else
            # Display the command output
            echo "Execution Output for input: $number ---->"
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
    done
    echo "ALL_TEST_CASES_OUTPUT:"
    cat "AllOutput_$timestamp.txt"
    echo "ALL_TEST_CASES_TIMING"
    cat "AllOutput_Timing_$timestamp.txt"
    echo "ALL_TEST_CASES_MEMORY"
    cat "AllOutput_Memory_$timestamp.txt"
    rm -f "AllOutput_$timestamp.txt" "AllOutput_Timing_$timestamp.txt" "AllOutput_Memory_$timestamp.txt"
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

# Cleanup temporary input file
rm -f "temp_input_$timestamp.txt"
